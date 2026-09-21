import React, { useState, useEffect, useCallback } from 'react';
import { DailyRecord } from './types';
import {
  getTodayDateString,
  getRecordForDate,
  getAllRecords,
  saveRecord,
  calculateScore,
  calculateStreak,
  getDefaultRecord,
} from './utils/storage';
import { playChime } from './utils/sound';
import { useAuth } from './contexts/AuthContext';
import {
  saveDailyRecordToFirestore,
  fetchAllDailyRecordsFromFirestore,
  syncLocalRecordsToFirestore,
} from './services/firestoreService';
import { Header } from './components/Header';
import { DailyFocusGoal } from './components/DailyFocusGoal';
import { ScoreBanner } from './components/ScoreBanner';
import { HardStartSection } from './components/HardStartSection';
import { OrganizeSection } from './components/OrganizeSection';
import { SmallSessionsSection } from './components/SmallSessionsSection';
import { TargetedWorkSection } from './components/TargetedWorkSection';
import { EntertainmentSection } from './components/EntertainmentSection';
import { LightsOutSection } from './components/LightsOutSection';
import { RulesCard } from './components/RulesCard';
import { HistoryModal } from './components/HistoryModal';
import { AuthModal } from './components/AuthModal';
import { AuthGate } from './components/AuthGate';
import { UserProfileModal } from './components/UserProfileModal';
import { PWAInstallBanner, PWAInstallModal } from './components/PWAInstallModal';
import { ActiveFocusMode } from './components/ActiveFocusMode';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DistractionLogger } from './components/DistractionLogger';
import { MessageSquare, ShieldAlert, Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());
  const [record, setRecord] = useState<DailyRecord>(() => getRecordForDate(getTodayDateString()));
  const [allRecords, setAllRecords] = useState<Record<string, DailyRecord>>(() => getAllRecords());
  const [streak, setStreak] = useState(() => calculateStreak());
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showActiveFocus, setShowActiveFocus] = useState(false);
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  // Cloud sync handler when user logs in
  const syncWithCloud = useCallback(async (userId: string) => {
    try {
      setSyncState('syncing');
      // 1. Fetch remote records from Firestore
      const remoteRecords = await fetchAllDailyRecordsFromFirestore(userId);
      const localRecords = getAllRecords();

      // 2. Sync local records to cloud if they are newer or not yet stored
      await syncLocalRecordsToFirestore(userId, localRecords);

      // 3. Merge: remote records take priority or combine
      const mergedRecords: Record<string, DailyRecord> = {
        ...localRecords,
        ...remoteRecords,
      };

      // Save merged to local storage
      localStorage.setItem('hostel_student_productivity_records_v1', JSON.stringify(mergedRecords));
      setAllRecords(mergedRecords);
      setStreak(calculateStreak());

      // If current selected date has a record in merged, load it
      if (mergedRecords[currentDate]) {
        setRecord(mergedRecords[currentDate]);
      } else {
        setRecord(getDefaultRecord(currentDate));
      }

      setSyncState('synced');
    } catch (err) {
      console.error('Failed cloud synchronization:', err);
      setSyncState('error');
    }
  }, [currentDate]);

  // When auth state changes, sync with Firestore
  useEffect(() => {
    if (currentUser?.uid) {
      syncWithCloud(currentUser.uid);
    } else {
      setSyncState('idle');
    }
  }, [currentUser?.uid, syncWithCloud]);

  // When date changes, load record
  useEffect(() => {
    const loaded = getRecordForDate(currentDate);
    setRecord(loaded);
  }, [currentDate]);

  // Update helper
  const handleUpdateRecord = async (updated: DailyRecord) => {
    // 1. Optimistic Local Update
    setRecord(updated);
    saveRecord(updated);
    const updatedAll = getAllRecords();
    setAllRecords(updatedAll);
    setStreak(calculateStreak());

    // 2. Cloud Firestore Update if authenticated
    if (currentUser?.uid) {
      setSyncState('syncing');
      try {
        await saveDailyRecordToFirestore(currentUser.uid, updated);
        setSyncState('synced');
      } catch (err) {
        console.error('Firestore save failed:', err);
        setSyncState('error');
      }
    }
  };

  const scoreBreakdown = calculateScore(record);

  const handleResetDay = () => {
    if (window.confirm('Reset this day to initial state?')) {
      const fresh = getDefaultRecord(currentDate);
      handleUpdateRecord(fresh);
      playChime('reset');
    }
  };

  const handlePrefillSample = () => {
    const sample: DailyRecord = {
      date: currentDate,
      dailyFocusGoal: 'Crush the Dynamic Programming module and master LeetCode tree problems',
      hardStart: {
        wakeNoPhone: true,
        waterFreshen: true,
        aptitudeDone: true,
        aptitudeCount: 18,
      },
      organize: {
        priorities: [
          {
            id: '1',
            text: 'Dynamic Programming (Knapsack & Subsequences on LeetCode)',
            timeSlot: '05:30 PM - 06:30 PM',
            category: 'Coding',
            completed: true,
          },
          {
            id: '2',
            text: 'Final Year Capstone Project API & Auth testing',
            timeSlot: '06:45 PM - 07:30 PM',
            category: 'Project',
            completed: true,
          },
          {
            id: '3',
            text: 'GATE Operating Systems: Virtual Memory & Page Faults PYQs',
            timeSlot: '07:45 PM - 08:30 PM',
            category: 'GATE',
            completed: true,
          },
        ],
        resourcesPrepared: true,
      },
      smallSessions: {
        aptitudeBreakDone: true,
        aptitudeBreakCount: 10,
        codingProblemRead: true,
        codingProblemTitle: 'Longest Palindromic Substring',
        csConceptRevised: true,
        csSubject: 'OS',
        csNotes: 'Revised Paging, TLB Hit ratio, and Belady Anomaly in FIFO',
      },
      targetedWork: {
        codingMinutes: 60,
        codingCompleted: true,
        projectMinutes: 45,
        projectCompleted: true,
        gateMinutes: 30,
        gateCompleted: true,
        notes: 'Great evening focus block. Finished all 3 priority items with zero distraction.',
      },
      entertainment: {
        startedAfter930: true,
        under30Mins: true,
        noWeekdayBinge: true,
        entertainmentType: 'Watched 1 anime episode',
        actualDurationMins: 25,
      },
      lightsOut: {
        screensOffEarly: true,
        tomorrowTop3Written: true,
        sleptBetween11And12: true,
        bedOnlyForSleep: true,
      },
      dailyNotes: 'Execution score 6/6! Consistent daily execution compounds over the semester.',
    };

    handleUpdateRecord(sample);
    playChime('success');
  };

  const jumpToSection = (letter: string) => {
    const map: Record<string, string> = {
      H: 'section-hard-start',
      O: 'section-organize',
      S: 'section-small-sessions',
      T: 'section-targeted-work',
      E: 'section-entertainment',
      L: 'section-lights-out',
    };
    const element = document.getElementById(map[letter]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Callback when a focus mode block completes
  const handleFocusBlockCompleted = (mins: number, notes: string) => {
    const currentNotes = record.targetedWork.notes ? `${record.targetedWork.notes}\n• ${notes}` : `• ${notes}`;
    const newCodingMinutes = record.targetedWork.codingMinutes + mins;
    handleUpdateRecord({
      ...record,
      targetedWork: {
        ...record.targetedWork,
        codingMinutes: newCodingMinutes,
        codingCompleted: newCodingMinutes >= 45,
        notes: currentNotes,
      },
    });
  };

  // Initial auth checking state
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-lg mb-4 animate-pulse">
          HL
        </div>
        <div className="flex items-center gap-2 text-stone-300 text-sm font-semibold">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          <span>Verifying student session...</span>
        </div>
      </div>
    );
  }

  // Feature Access Gate: user must create an account and log in before accessing system features
  if (!currentUser) {
    return <AuthGate />;
  }

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 pb-16 font-sans transition-colors duration-200">
      {/* Mobile Install Promotion Banner */}
      <PWAInstallBanner />

      {/* Top Navbar */}
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        streak={streak}
        onOpenRules={() => setShowRules(true)}
        onOpenHistory={() => setShowHistory(true)}
        onResetDay={handleResetDay}
        onPrefillSample={handlePrefillSample}
        onOpenAuth={() => setShowAuth(true)}
        onOpenInstall={() => setShowInstallModal(true)}
        onOpenFocusMode={() => setShowActiveFocus(true)}
        onOpenProfile={() => setShowProfile(true)}
        syncState={syncState}
      />

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Daily Focus Goal */}
        <DailyFocusGoal
          value={record.dailyFocusGoal || ''}
          onChange={(goal) => handleUpdateRecord({ ...record, dailyFocusGoal: goal })}
        />

        {/* Score Banner */}
        <ScoreBanner scoreBreakdown={scoreBreakdown} onJumpToSection={jumpToSection} />

        {/* 6 H.O.S.T.E.L. Execution Sections */}
        <HardStartSection
          data={record.hardStart}
          onChange={(hardStart) => handleUpdateRecord({ ...record, hardStart })}
          earned={scoreBreakdown.hardStart}
        />

        <OrganizeSection
          data={record.organize}
          onChange={(organize) => handleUpdateRecord({ ...record, organize })}
          earned={scoreBreakdown.organize}
        />

        <SmallSessionsSection
          data={record.smallSessions}
          onChange={(smallSessions) => handleUpdateRecord({ ...record, smallSessions })}
          earned={scoreBreakdown.smallSessions}
        />

        <TargetedWorkSection
          data={record.targetedWork}
          onChange={(targetedWork) => handleUpdateRecord({ ...record, targetedWork })}
          earned={scoreBreakdown.targetedWork}
          onLaunchActiveFocus={() => setShowActiveFocus(true)}
        />

        <EntertainmentSection
          data={record.entertainment}
          onChange={(entertainment) => handleUpdateRecord({ ...record, entertainment })}
          earned={scoreBreakdown.entertainment}
        />

        <LightsOutSection
          data={record.lightsOut}
          onChange={(lightsOut) => handleUpdateRecord({ ...record, lightsOut })}
          earned={scoreBreakdown.lightsOut}
        />

        {/* Daily Reflection / Diary Notes */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs mb-6" id="section-reflection">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-stone-500 dark:text-stone-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Hostel Daily Reflection & Notes
            </h3>
          </div>
          <textarea
            value={record.dailyNotes || ''}
            onChange={(e) => handleUpdateRecord({ ...record, dailyNotes: e.target.value })}
            placeholder="How was today's discipline? Any distraction triggers in the hostel room (e.g. friends dropping by, late gaming)? How will you adjust tomorrow?"
            rows={3}
            className="w-full text-xs p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-850 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />

          {/* Distraction Logger */}
          <DistractionLogger
            selectedDistractions={record.distractions || []}
            onChange={(distractions) => handleUpdateRecord({ ...record, distractions })}
            allRecords={allRecords}
          />
        </div>

        {/* Hostel Cardinal Rule Reminder Footer */}
        <div className="p-4 rounded-xl bg-stone-900 dark:bg-stone-900/90 border border-stone-800 text-stone-300 text-xs flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-white">The Hostel Student Golden Law: </span>
            Your bed should only be used for sleep. Avoid watching shows in bed, scrolling social media in bed, or studying in bed. Do not aim for perfect days—aim for consistent daily execution of the loop.
          </div>
        </div>
      </main>

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />

      {/* Modals & Fullscreen Overlays */}
      <RulesCard isOpen={showRules} onClose={() => setShowRules(false)} />
      
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectDate={setCurrentDate}
        streak={streak}
        records={allRecords}
        onForceSync={currentUser?.uid ? () => syncWithCloud(currentUser.uid) : undefined}
        isSyncing={syncState === 'syncing'}
        onOpenProfile={() => setShowProfile(true)}
      />
      
      <UserProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        streak={streak}
        records={allRecords}
        onOpenAuth={() => setShowAuth(true)}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />

      <ActiveFocusMode
        isOpen={showActiveFocus}
        onClose={() => setShowActiveFocus(false)}
        dailyGoal={record.dailyFocusGoal}
        onCompleteFocusBlock={handleFocusBlockCompleted}
      />
    </div>
  );
};
