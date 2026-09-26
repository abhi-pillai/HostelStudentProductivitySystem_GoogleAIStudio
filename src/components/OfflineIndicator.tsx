import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-40 flex items-center gap-2.5 rounded-xl bg-[#2d5641] dark:bg-[#1a3828] text-white px-3.5 py-2.5 text-xs font-medium shadow-lg border border-[#3d7056] animate-fade-in"
      role="status"
    >
      <WifiOff className="w-4 h-4 shrink-0 animate-pulse text-[#7fc09d]" />
      <span><strong>Offline Mode Active:</strong> You are disconnected from the network. Your daily records and focus sprints are saved locally and will sync to Firestore once reconnected.</span>
    </div>
  );
};
