import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  Eye,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  Zap,
  CheckCircle2,
  X,
  Bell
} from 'lucide-react';
import { playChime } from '../utils/sound';

interface ActiveFocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  dailyGoal?: string;
  onCompleteFocusBlock?: (durationMins: number, notes: string) => void;
}

export const ActiveFocusMode: React.FC<ActiveFocusModeProps> = ({
  isOpen,
  onClose,
  dailyGoal,
  onCompleteFocusBlock,
}) => {
  const [sessionMinutes, setSessionMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [distractionCount, setDistractionCount] = useState<number>(0);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'whitenoise' | 'rain' | 'binaural'>('none');
  const [blockNotes, setBlockNotes] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // References
  const wakeLockRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  // Reset timer whenever session minutes change while not running
  const setDuration = (mins: number) => {
    if (!isRunning) {
      setSessionMinutes(mins);
      setSecondsLeft(mins * 60);
    }
  };

  // Screen Wake Lock API to prevent phone screen from turning off
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await (navigator as any).wakeLock.request('screen');
        wakeLockRef.current = lock;
        setWakeLockActive(true);
        lock.addEventListener('release', () => {
          setWakeLockActive(false);
          wakeLockRef.current = null;
        });
      }
    } catch (err) {
      console.warn('Wake Lock request failed or denied:', err);
      setWakeLockActive(false);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
      setWakeLockActive(false);
    }
  };

  // Fullscreen API implementation
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (modalContainerRef.current?.requestFullscreen) {
          await modalContainerRef.current.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Ambient sound synthesizer using Web Audio API (zero external assets needed)
  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.();
        noiseNodeRef.current.disconnect();
      } catch {}
      noiseNodeRef.current = null;
    }
    if (gainNodeRef.current) {
      try {
        gainNodeRef.current.disconnect();
      } catch {}
      gainNodeRef.current = null;
    }
  };

  const startAmbientSound = (type: 'whitenoise' | 'rain' | 'binaural' | 'none') => {
    stopAmbientSound();
    if (isMuted || type === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      if (type === 'whitenoise' || type === 'rain') {
        // Buffer of noise
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Brown / Pink filter for soft rain
            b0 = 0.99 * b0 + white * 0.05;
            output[i] = b0 * 3.5;
          } else {
            // White / gentle pink noise
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            output[i] = (b0 + b1 + b2) * 0.4;
          }
        }
        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.connect(gain);
        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
      } else if (type === 'binaural') {
        // 40Hz Gamma frequency focus sine wave
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, ctx.currentTime); // A note grounding
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        noiseNodeRef.current = osc;
      }
    } catch (err) {
      console.warn('Audio synthesis could not initialize:', err);
    }
  };

  // Notification sound on timer finish
  const notifyComplete = () => {
    playChime('success');
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Focus Block Complete! 🎯', {
          body: `Great job! You maintained focus for ${sessionMinutes} minutes. Record your progress!`,
          icon: '/pwa-192x192.png',
        });
      } catch {}
    }
    // Vibration API for mobile feedback
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 400]);
      } catch {}
    }
  };

  // Request browser notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch {}
    }
  };

  // Page visibility detector: Tracks when hostel student navigates away or checks other tabs
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setDistractionCount((prev) => prev + 1);
        // Alert sound if unmuted
        if (!isMuted) {
          playChime('warning');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, isRunning, isMuted]);

  // Main countdown timer interval
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    // Keep screen awake during running session
    requestWakeLock();
    if (ambientSound !== 'none') {
      startAmbientSound(ambientSound);
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          setIsCompleted(true);
          releaseWakeLock();
          stopAmbientSound();
          notifyComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      releaseWakeLock();
      stopAmbientSound();
    };
  }, [isOpen, isRunning, ambientSound]);

  // Handle ambient sound changes on the fly
  useEffect(() => {
    if (isRunning) {
      if (ambientSound === 'none' || isMuted) {
        stopAmbientSound();
      } else {
        startAmbientSound(ambientSound);
      }
    }
  }, [ambientSound, isMuted]);

  // Cleanup on close
  useEffect(() => {
    if (!isOpen) {
      setIsRunning(false);
      releaseWakeLock();
      stopAmbientSound();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPercent = ((sessionMinutes * 60 - secondsLeft) / (sessionMinutes * 60)) * 100;

  const handleStartPause = () => {
    if (!isRunning) {
      requestNotificationPermission();
      setIsRunning(true);
      setIsCompleted(false);
    } else {
      setIsRunning(false);
      releaseWakeLock();
      stopAmbientSound();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(sessionMinutes * 60);
    setIsCompleted(false);
    releaseWakeLock();
    stopAmbientSound();
  };

  const handleFinishAndSave = () => {
    if (onCompleteFocusBlock) {
      onCompleteFocusBlock(sessionMinutes, blockNotes || `Completed focus sprint (${sessionMinutes}m)`);
    }
    onClose();
  };

  return (
    <div
      ref={modalContainerRef}
      className="fixed inset-0 z-50 flex flex-col bg-[#0f1712] text-[#edf0ec] overflow-y-auto"
      id="active-focus-screen"
    >
      {/* Top Controls Bar */}
      <header className="px-4 py-3 sm:px-6 flex items-center justify-between border-b border-[#233328] bg-[#152019]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2d5641]/25 text-[#7fc09d] flex items-center justify-center font-bold text-xs">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#edf0ec] tracking-wide uppercase">
                Active Study Focus Lock
              </h2>
              {wakeLockActive && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#233328] text-[#7fc09d] border border-[#2d5641]/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7fc09d]" />
                  Screen Awake
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#9cb0a2]">
              {isRunning ? 'Timer running — phone screen locked awake' : 'Choose duration & enter deep study state'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Sound Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-[#18251e] border border-[#283b2f] rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-1.5 rounded ${isMuted ? 'text-[#6e8275]' : 'text-[#9cb0a2]'}`}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value as any)}
              className="bg-transparent text-[11px] text-[#edf0ec] font-medium focus:outline-hidden pr-1"
            >
              <option value="none" className="bg-[#18251e] text-[#edf0ec]">No Sound</option>
              <option value="rain" className="bg-[#18251e] text-[#edf0ec]">🌧️ Gentle Rain</option>
              <option value="whitenoise" className="bg-[#18251e] text-[#edf0ec]">💨 White Noise</option>
              <option value="binaural" className="bg-[#18251e] text-[#edf0ec]">🧠 40Hz Focus Wave</option>
            </select>
          </div>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-[#18251e] hover:bg-[#203229] text-[#9cb0a2] hover:text-[#edf0ec] border border-[#283b2f] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-[#18251e] hover:bg-[#203229] text-[#798b7f] hover:text-white border border-[#283b2f] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Focus Center */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto w-full">
        {/* Daily Objective Reminder */}
        {dailyGoal && (
          <div className="w-full mb-6 p-3 rounded-xl bg-[#152019] border border-[#233328] text-center">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7fc09d] block mb-0.5">
              Current Mission
            </span>
            <p className="text-xs font-semibold text-[#edf0ec] line-clamp-2">
              "{dailyGoal}"
            </p>
          </div>
        )}

        {/* Tab Switch / Distraction Counter Badge */}
        {distractionCount > 0 && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18251e] border border-[#c06541]/40 text-[#f09a79] text-xs">
            <AlertTriangle className="w-4 h-4 text-[#e88d6a] shrink-0" />
            <span>App minimized or left tab <strong>{distractionCount}</strong> time{distractionCount > 1 ? 's' : ''}! Return to hostel focus.</span>
          </div>
        )}

        {/* Circular Countdown Display */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-[#1a2820] stroke-current"
              strokeWidth="4"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`stroke-current transition-all duration-500 ${
                isCompleted ? 'text-[#deb16d]' : isRunning ? 'text-[#7fc09d]' : 'text-[#3d5a49]'
              }`}
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock & Status */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-5xl sm:text-6xl font-extrabold tracking-tight text-[#edf0ec]">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest text-[#9cb0a2] mt-2">
              {isCompleted ? 'Sprint Completed!' : isRunning ? 'Deep Focus Active' : 'Ready to Start'}
            </span>
          </div>
        </div>

        {/* Sprint Presets */}
        {!isRunning && !isCompleted && (
          <div className="flex items-center gap-2 my-4">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDuration(mins)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  sessionMinutes === mins
                    ? 'bg-[#7fc09d] text-[#0f1d15] border-[#7fc09d] shadow-2xs font-semibold'
                    : 'bg-[#18251e] text-[#edf0ec] border-[#283b2f] hover:border-[#3a5242]'
                }`}
              >
                {mins}m {mins === 25 ? '(Pomodoro)' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Primary Controls */}
        <div className="flex items-center gap-3 mt-4">
          {!isCompleted ? (
            <>
              <button
                type="button"
                onClick={handleStartPause}
                className={`px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isRunning
                    ? 'bg-[#18251e] hover:bg-[#203229] text-[#edf0ec] border border-[#2d5641]/50'
                    : 'bg-[#7fc09d] hover:bg-[#90d2af] text-[#0f1d15] shadow-sm font-bold'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Session</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Focus Session</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-[#18251e] hover:bg-[#203229] text-[#798b7f] hover:text-[#edf0ec] border border-[#283b2f] transition-colors cursor-pointer"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full max-w-sm flex flex-col gap-3">
              <input
                type="text"
                placeholder="What did you accomplish in this block?"
                value={blockNotes}
                onChange={(e) => setBlockNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-[#18251e] border border-[#283b2f] text-[#edf0ec] placeholder-[#6e8275] focus:outline-hidden focus:border-[#7fc09d]"
              />
              <button
                type="button"
                onClick={handleFinishAndSave}
                className="w-full py-2.5 px-4 bg-[#7fc09d] hover:bg-[#90d2af] text-[#0f1d15] rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save to Targeted Work Block & Exit</span>
              </button>
            </div>
          )}
        </div>

        {/* Hostel Rules of the Focus State */}
        <div className="mt-8 p-4 rounded-xl bg-[#152019]/80 border border-[#233328] text-xs text-[#9cb0a2] max-w-md w-full">
          <div className="flex items-center gap-2 text-[#edf0ec] font-semibold mb-1.5">
            <Shield className="w-4 h-4 text-[#7fc09d]" />
            <span>Hostel Focus Mode Enforcement:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-[#9cb0a2]">
            <li><strong>Screen Wake Lock:</strong> Your phone screen stays awake so you don't keep tapping it.</li>
            <li><strong>Tab Switching Penalty:</strong> Minimizing the app or opening YouTube/Instagram increments your distraction counter.</li>
            <li><strong>No Bed Rule:</strong> Sit upright at your study desk with your feet on the floor.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
