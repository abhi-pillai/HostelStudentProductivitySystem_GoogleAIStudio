import React, { useState, useEffect, useRef } from 'react';
import { TargetedWorkData } from '../types';
import { Check, Play, Pause, RotateCcw, Clock, Code, BookMarked, GraduationCap } from 'lucide-react';
import { playChime } from '../utils/sound';

interface TargetedWorkSectionProps {
  data: TargetedWorkData;
  onChange: (data: TargetedWorkData) => void;
  earned: boolean;
}

type TimerMode = 'coding' | 'project' | 'gate' | 'custom';

export const TargetedWorkSection: React.FC<TargetedWorkSectionProps> = ({ data, onChange, earned }) => {
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
      className={`bg-white border rounded-xl p-5 mb-5 transition-all ${
        earned ? 'border-emerald-200 shadow-2xs' : 'border-stone-200 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-700 flex items-center justify-center font-mono font-bold text-base border border-indigo-500/20 shrink-0">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">
                Targeted Evening Work (Deep Focus Block)
              </h2>
              {earned ? (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 1 Point Earned
                </span>
              ) : (
                <span className="text-[11px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                  Pending (1 Pt)
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              The golden hostel study block. Strict deep work with zero multitasking or social interruptions.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono font-semibold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
          {data.codingMinutes + data.projectMinutes + data.gateMinutes} mins logged
        </div>
      </div>

      {/* Built-in Deep Work Timer */}
      <div className="mt-4 p-4 rounded-xl bg-stone-900 text-stone-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
            Active Focus Sprint
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-mono text-3xl font-extrabold tracking-wider text-amber-400">
              {formatTime(timeLeftSeconds)}
            </span>
            <span className="text-xs text-stone-400 capitalize">({timerMode})</span>
          </div>
        </div>

        {/* Mode switcher pills */}
        <div className="flex items-center bg-stone-800 p-1 rounded-lg text-xs gap-1">
          <button
            type="button"
            onClick={() => setMode('coding')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timerMode === 'coding' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Coding (60m)
          </button>
          <button
            type="button"
            onClick={() => setMode('project')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timerMode === 'project' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Project (45m)
          </button>
          <button
            type="button"
            onClick={() => setMode('gate')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              timerMode === 'gate' ? 'bg-amber-600 text-white font-semibold' : 'text-stone-400 hover:text-white'
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
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
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
            data.codingCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-stone-50/50 border-stone-200/80'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-stone-900">
                1 Hour Coding Practice
              </span>
            </div>
            <input
              type="checkbox"
              id="chk-coding-completed"
              checked={data.codingCompleted}
              onChange={(e) => onChange({ ...data, codingCompleted: e.target.checked, codingMinutes: e.target.checked && data.codingMinutes < 60 ? 60 : data.codingMinutes })}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 accent-emerald-600"
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            DSA, algorithmic patterns, or contest problem solving.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">Minutes:</span>
            <div className="flex items-center bg-white rounded border border-stone-200 px-2 py-0.5">
              <input
                type="number"
                min="0"
                max="240"
                value={data.codingMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ ...data, codingMinutes: val, codingCompleted: val >= 45 ? true : data.codingCompleted });
                }}
                className="w-12 text-center text-xs font-mono font-bold focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-400">min</span>
            </div>
          </div>
        </div>

        {/* Block 2: Academic Project */}
        <div
          className={`p-3.5 rounded-lg border transition-all ${
            data.projectCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-stone-50/50 border-stone-200/80'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-stone-900">
                45 Min Academic Project
              </span>
            </div>
            <input
              type="checkbox"
              id="chk-project-completed"
              checked={data.projectCompleted}
              onChange={(e) => onChange({ ...data, projectCompleted: e.target.checked, projectMinutes: e.target.checked && data.projectMinutes < 45 ? 45 : data.projectMinutes })}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 accent-emerald-600"
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Capstone project, repo commits, or lab assignments.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">Minutes:</span>
            <div className="flex items-center bg-white rounded border border-stone-200 px-2 py-0.5">
              <input
                type="number"
                min="0"
                max="240"
                value={data.projectMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ ...data, projectMinutes: val, projectCompleted: val >= 30 ? true : data.projectCompleted });
                }}
                className="w-12 text-center text-xs font-mono font-bold focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-400">min</span>
            </div>
          </div>
        </div>

        {/* Block 3: GATE / Competitive Exam */}
        <div
          className={`p-3.5 rounded-lg border transition-all ${
            data.gateCompleted ? 'bg-emerald-50/50 border-emerald-200' : 'bg-stone-50/50 border-stone-200/80'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-stone-900">
                30 Min GATE / Exam Prep
              </span>
            </div>
            <input
              type="checkbox"
              id="chk-gate-completed"
              checked={data.gateCompleted}
              onChange={(e) => onChange({ ...data, gateCompleted: e.target.checked, gateMinutes: e.target.checked && data.gateMinutes < 30 ? 30 : data.gateMinutes })}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500 accent-emerald-600"
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Previous year questions (PYQs) or standard mock tests.
          </p>
          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className="text-stone-500 text-[11px]">Minutes:</span>
            <div className="flex items-center bg-white rounded border border-stone-200 px-2 py-0.5">
              <input
                type="number"
                min="0"
                max="240"
                value={data.gateMinutes}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onChange({ ...data, gateMinutes: val, gateCompleted: val >= 20 ? true : data.gateCompleted });
                }}
                className="w-12 text-center text-xs font-mono font-bold focus:outline-hidden"
              />
              <span className="text-[10px] text-stone-400">min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
