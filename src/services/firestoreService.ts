import {
  doc,
  setDoc,
  getDocs,
  collection,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DailyRecord } from '../types';
import { calculateScore } from '../utils/storage';

export interface SyncStatus {
  state: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt?: Date;
  error?: string;
}

/**
 * Saves or updates a user profile document in Firestore
 */
export async function saveUserProfileToFirestore(user: {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}): Promise<void> {
  if (!user.uid) return;
  const userRef = doc(db, 'users', user.uid);
  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Saves a single day's execution record to Firestore subcollection /users/{userId}/dailyRecords/{date}
 */
export async function saveDailyRecordToFirestore(
  userId: string,
  record: DailyRecord
): Promise<void> {
  if (!userId || !record.date) return;
  const score = calculateScore(record);
  const recordRef = doc(db, 'users', userId, 'dailyRecords', record.date);

  const payload = {
    ...record,
    totalScore: score.totalScore,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(recordRef, payload, { merge: true });
}

/**
 * Fetches all historical daily records for a user from Firestore
 */
export async function fetchAllDailyRecordsFromFirestore(
  userId: string
): Promise<Record<string, DailyRecord>> {
  if (!userId) return {};
  const recordsCol = collection(db, 'users', userId, 'dailyRecords');
  const snapshot = await getDocs(recordsCol);

  const records: Record<string, DailyRecord> = {};
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as DailyRecord;
    if (data.date) {
      records[data.date] = data;
    }
  });

  return records;
}

/**
 * Syncs an entire dictionary of local records to Firestore (e.g. upon user sign-in)
 */
export async function syncLocalRecordsToFirestore(
  userId: string,
  localRecords: Record<string, DailyRecord>
): Promise<void> {
  if (!userId) return;
  const dates = Object.keys(localRecords);
  if (dates.length === 0) return;

  const batch = writeBatch(db);
  let count = 0;

  for (const date of dates) {
    const rec = localRecords[date];
    const score = calculateScore(rec);
    const docRef = doc(db, 'users', userId, 'dailyRecords', date);
    batch.set(
      docRef,
      {
        ...rec,
        totalScore: score.totalScore,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    count++;
    // Firestore batch limit is 500 operations
    if (count >= 450) break;
  }

  await batch.commit();
}
