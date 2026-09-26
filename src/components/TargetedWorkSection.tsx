import React, { useState, useEffect, useRef } from 'react';
import { TargetedWorkData } from '../types';
import { Check, Play, Pause, RotateCcw, Code, BookMarked, GraduationCap, Zap } from 'lucide-react';
import { playChime } from '../utils/sound';

interface TargetedWorkSectionProps {
  data: TargetedWorkData;
  onChange: (data: TargetedWorkData) => void;
  earned: boolean;
  onLaunchActiveFocus?: () => void;
}

type TimerMode = 'coding' | 'project' | 'gate' | 'custom';

export const TargetedWorkSection: React.FC<TargetedWorkSectionProps> = ({
  data,
  onChange,
  earned,
  onLaunchActiveFocus,
}) => {
  // Timer State
  const [timerMode, setTimerMode] = useState<TimerMode>('coding');
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(60 * 60); // 60 mins default
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Set default duration based on selected mode
  const setMode = (mode: TimerMode) => {
    setIsRunning(false);
    setTimerMode(mode);
    if (mode === 'coding') setTimeLeftSeconds(60 * 60);
    if (mode === 'project') setTimeLeftSeconds(45 * 60);
    if (mode === 'gate') setTimeLeftSeconds(30 * 60);
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime('success');

            // Automatically log minutes
            if (timerMode === 'coding') {
              onChange({
                ...data,
                codingMinutes: Math.max(data.codingMinutes, 60),
                codingCompleted: true
              });
            } else if (timerMode === 'project') {
              onChange({
                ...data,
                projectMinutes: Math.max(data.projectMinutes, 45),
                projectCompleted: true
              });
            } else if (timerMode === 'gate') {
              onChange({
                ...data,
                gateMinutes: Math.max(data.gateMinutes, 30),
                gateCompleted: true
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, data, onChange]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    playChime('reset');
    setMode(timerMode);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section
      id="section-targeted-work"
      className={`bg-[#fcfbfa] dark:bg-[#18221d] border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-[#3a586d]/60 dark:border-[#7da5c2]/50 ring-1 ring-[#3a586d]/15'
          : 'border-[#e4e1d6] dark:border-[#28362e]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#3a586d]/10 dark:bg-[#7da5c2]/15 text-[#2a4557] dark:text-[#8cb3cf] border border-[#3a586d]/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Targeted Evening Work (Deep Focus Block)
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-[#2a4557] dark:text-[#8cb3cf] px-2 py-0.5 rounded-md bg-[#3a586d]/10 border border-[#3a586d]/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mt-0.5">
              The golden hostel study block. Strict deep work with zero multitasking or social interruptions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLaunchActiveFocus && (
            <button
              type="button"
              onClick={onLaunchActiveFocus}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] flex items-center gap-1 shadow-2xs transition-colors"
              title="Launch Screen-Locked Fullscreen Focus Mode"
            >
              <Zap className="w-3.5 h-3.5 fill-[#e88d6a] text-[#e88d6a] dark:fill-[#0f1d15] dark:text-[#0f1d15]" />
              <span className="hidden sm:inline">Active Focus Mode</span>
            </button>
          )}

          <div className="text-xs font-mono text-[#526357] dark:text-[#9bb0a2] bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2b3a31] px-2.5 py-1 rounded-lg">
            {data.codingMinutes + data.projectMinutes + data.gateMinutes} mins logged
          </div>
        </div>
      </div>

      {/* Built-in Deep Work Timer */}
      <div className="mt-4 p-4 rounded-xl bg-[#142019] dark:bg-[#0f1713] border border-[#233529] text-[#edf0ec] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xs text-[#8ca094] font-normal">
            Active Focus Sprint
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-mono text-3xl font-semibold tracking-wider text-[#edf0ec]">
              {formatTime(timeLeftSeconds)}
            </span>
            <span className="text-xs text-[#8ca094] capitalize">({timerMode})</span>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex items-center bg-[#1c2c23] dark:bg-[#15211b] p-0.5 rounded-lg text-xs gap-1 border border-[#2a3f33]">
          <button
            type="button"
            onClick={() => setMode('coding')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timerMode === 'coding' ? 'bg-[#2d4e3d] text-white font-medium shadow-2xs' : 'text-[#8ca094] hover:text-white'
            }`}
          >
            Coding (60m)
          </button>
          <button
            type="button"
            onClick={() => setMode('project')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timerMode === 'project' ? 'bg-[#2d4e3d] text-white font-medium shadow-2xs' : 'text-[#8ca094] hover:text-white'
            }`}
          >
            Project (45m)
          </button>
          <button
            type="button"
            onClick={() => setMode('gate')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timerMode === 'gate' ? 'bg-[#2d4e3d] text-white font-medium shadow-2xs' : 'text-[#8ca094] hover:text-white'
            }`}
          >
            GATE (30m)
          </button>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-timer-toggle"
            onClick={toggleTimer}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 bg-[#7fc09d] text-[#0f1d15] hover:bg-[#92d2b0]"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 rounded-lg bg-[#1c2c23] text-[#8ca094] hover:text-[#edf0ec] border border-[#2a3f33] transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3 Structured Work Targets */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Block 1: Coding */}
        <div
          className={`p-3.5 rounded-lg border transition-all ${
            data.codingCompleted 
              ? 'bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 border-[#2d5641]/30 dark:border-[#7fc09d]/30' 
              : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#e8e5dc] dark:border-[#26352c]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#3a586d] dark:text-[#7da5c2]" />
              <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                1 Hour Coding Practice
              </span>
            </div>
            <input
              type="checkbox"
              id="chk-coding-completed"
              checked={data.codingCompleted}
              onChange={(e) => onChange({ ...data, codingCompleted: e.target.checked, codingMinutes: e.target.checked && data.codingMinutes < 60 ? 60 : data.codingMinutes })}
              className="w-4 h-4 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
            />
          </div>
          <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] mt-1">
            DSA, algorithmic patterns, or contest problem solving.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#526357] dark:text-[#9bb0a2] text-xs">Minutes:</span>
              <button
                type="button"
                onClick={() => {
                  const newMins = data.codingMinutes + 15;
                  onChange({ ...data, codingMinutes: newMins, codingCompleted: newMins >= 45 ? true : data.codingCompleted });
                }}
                className="text-xs px-2 py-0.5 rounded bg-[#efece4] dark:bg-[#202d25] text-[#344339] dark:text-[#d3ded7] border border-[#dedad0] dark:border-[#2c3d33] hover:bg-[#e4e0d4]"
                title="Quick add 15 minutes"
              >
                +15m
              </button>
            </div>
            <div className="flex items-center bg-[#f7f6f0] dark:bg-[#1e2a22] rounded border border-[#dedad0] dark:border-[#2b3a31] px-2 py-0.5">
              <input
                type="number"
                min="0"
                max="240"
                value={data.codingMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ ...data, codingMinutes: val, codingCompleted: val >= 45 ? true : data.codingCompleted });
                }}
                className="w-12 text-center text-xs font-mono font-bold focus:outline-hidden bg-transparent text-[#1b2620] dark:text-[#edf0ec]"
              />
              <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275]">min</span>
            </div>
          </div>
        </div>

        {/* Block 2: Academic Project */}
        <div
          className={`p-3.5 rounded-lg border transition-all ${
            data.projectCompleted 
              ? 'bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 border-[#2d5641]/30 dark:border-[#7fc09d]/30' 
              : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#e8e5dc] dark:border-[#26352c]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-[#3a586d] dark:text-[#7da5c2]" />
              <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                45m Final Year Project
              </span>
            </div>
            <input
              type="checkbox"
              id="chk-project-completed"
              checked={data.projectCompleted}
              onChange={(e) => onChange({ ...data, projectCompleted: e.target.checked, projectMinutes: e.target.checked && data.projectMinutes < 45 ? 45 : data.projectMinutes })}
              className="w-4 h-4 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
            />
          </div>
          <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] mt-1">
            Documentation, system design, feature implementation or testing.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#526357] dark:text-[#9bb0a2] text-xs">Minutes:</span>
              <button
                type="button"
                onClick={() => {
                  const newMins = data.projectMinutes + 15;
                  onChange({ ...data, projectMinutes: newMins, projectCompleted: newMins >= 30 ? true : data.projectCompleted });
                }}
                className="text-xs px-2 py-0.5 rounded bg-[#efece4] dark:bg-[#202d25] text-[#344339] dark:text-[#d3ded7] border border-[#dedad0] dark:border-[#2c3d33] hover:bg-[#e4e0d4]"
                title="Quick add 15 minutes"
              >
                +15m
              </button>
            </div>
            <div className="flex items-center bg-[#f7f6f0] dark:bg-[#1e2a22] rounded border border-[#dedad0] dark:border-[#2b3a31] px-2 py-0.5">
              <input
                type="number"
                min="0"
                max="240"
                value={data.projectMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ ...data, projectMinutes: val, projectCompleted: val >= 30 ? true : data.projectCompleted });
                }}
                className="w-12 text-center text-xs font-mono font-bold focus:outline-hidden bg-transparent text-[#1b2620] dark:text-[#edf0ec]"
              />
              <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275]">min</span>
            </div>
          </div>
        </div>

        {/* Block 3: GATE Revision */}
        <div
          className={`p-3.5 rounded-lg border transition-all ${
            data.gateCompleted 
              ? 'bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 border-[#2d5641]/30 dark:border-[#7fc09d]/30' 
              : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#e8e5dc] dark:border-[#26352c]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#3a586d] dark:text-[#7da5c2]" />
              <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                30m GATE / Core Subjects
              </span>
            </div>
            <input
              type="checkbox"
              id="chk-gate-completed"
              checked={data.gateCompleted}
              onChange={(e) => onChange({ ...data, gateCompleted: e.target.checked, gateMinutes: e.target.checked && data.gateMinutes < 30 ? 30 : data.gateMinutes })}
              className="w-4 h-4 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
            />
          </div>
          <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2] mt-1">
            Previous Year Questions (PYQs), formulas, or test series analysis.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#526357] dark:text-[#9bb0a2] text-xs">Minutes:</span>
              <button
                type="button"
                onClick={() => {
                  const newMins = data.gateMinutes + 15;
                  onChange({ ...data, gateMinutes: newMins, gateCompleted: newMins >= 20 ? true : data.gateCompleted });
                }}
                className="text-xs px-2 py-0.5 rounded bg-[#efece4] dark:bg-[#202d25] text-[#344339] dark:text-[#d3ded7] border border-[#dedad0] dark:border-[#2c3d33] hover:bg-[#e4e0d4]"
                title="Quick add 15 minutes"
              >
                +15m
              </button>
            </div>
            <div className="flex items-center bg-[#f7f6f0] dark:bg-[#1e2a22] rounded border border-[#dedad0] dark:border-[#2b3a31] px-2 py-0.5">
              <input
                type="number"
                min="0"
                max="240"
                value={data.gateMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ ...data, gateMinutes: val, gateCompleted: val >= 20 ? true : data.gateCompleted });
                }}
                className="w-12 text-center text-xs font-mono font-bold focus:outline-hidden bg-transparent text-[#1b2620] dark:text-[#edf0ec]"
              />
              <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275]">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Work Notes */}
      <div className="mt-3.5">
        <label className="block text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] uppercase tracking-wider mb-1">
          Evening Deep Work Notes / Accomplishments
        </label>
        <textarea
          rows={2}
          value={data.notes}
          onChange={(e) => onChange({ ...data, notes: e.target.value })}
          placeholder="e.g. Solved 3 DP Medium questions on LeetCode without peeking at solutions; tested Capstone payment endpoint."
          className="w-full text-xs p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] bg-[#f7f6f0] dark:bg-[#1e2a22] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:border-[#3a586d] dark:focus:border-[#7da5c2]"
        />
      </div>
    </section>
  );
};
