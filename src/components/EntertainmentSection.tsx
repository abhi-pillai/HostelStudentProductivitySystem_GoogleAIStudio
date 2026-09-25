import React, { useState, useEffect, useRef } from 'react';
import { EntertainmentData } from '../types';
import { Check, Play, Pause, RotateCcw, Tv, AlertTriangle, ShieldCheck } from 'lucide-react';
import { playChime } from '../utils/sound';

interface EntertainmentSectionProps {
  data: EntertainmentData;
  onChange: (data: EntertainmentData) => void;
  earned: boolean;
}

export const EntertainmentSection: React.FC<EntertainmentSectionProps> = ({ data, onChange, earned }) => {
  // 30 minute entertainment timer
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playChime('success');
            onChange({
              ...data,
              actualDurationMins: 30,
              under30Mins: true,
            });
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
  }, [isRunning, data, onChange]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    playChime('reset');
    setTimeLeft(30 * 60);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <section
      id="section-entertainment"
      className={`bg-white dark:bg-stone-900 border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-rose-300/80 dark:border-rose-800/60 ring-1 ring-rose-400/15'
          : 'border-stone-200/90 dark:border-stone-800'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Entertainment with Limits
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-stone-400 dark:text-stone-500">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Hostels make binge watching tempting. Schedule leisure strictly after 9:30 PM with a hard 30-min cutoff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-850 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-750">
          <Tv className="w-3.5 h-3.5 text-stone-400" />
          <span>Max 30m</span>
        </div>
      </div>

      {/* Rules & Checkboxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Rule 1 */}
        <label className="p-3 rounded-lg border border-stone-150 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-850/40 cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-time"
            checked={data.startedAfter930}
            onChange={(e) => onChange({ ...data, startedAfter930: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Only after 9:30 PM
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Never consume passive entertainment during prime evening study hours.
            </p>
          </div>
        </label>

        {/* Rule 2 */}
        <label className="p-3 rounded-lg border border-stone-150 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-850/40 cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-cap"
            checked={data.under30Mins}
            onChange={(e) => onChange({ ...data, under30Mins: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Maximum 30 Minutes
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              One episode or short video. Hard stop when timer rings.
            </p>
          </div>
        </label>

        {/* Rule 3 */}
        <label className="p-3 rounded-lg border border-stone-150 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-850/40 cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-no-binge"
            checked={data.noWeekdayBinge}
            onChange={(e) => onChange({ ...data, noWeekdayBinge: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              No Weekday Bingeing
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Zero multi-hour movie/series marathons on college nights.
            </p>
          </div>
        </label>
      </div>

      {/* 30-min Entertainment Timer Widget */}
      <div className="mt-4 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-750 text-stone-700 dark:text-stone-300 flex items-center justify-center font-medium text-xs">
            30m
          </div>
          <div>
            <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
              Entertainment Guardrail Timer
            </div>
            <div className="text-[11px] text-stone-500 dark:text-stone-400">
              Set this timer before opening YouTube, Netflix, or social apps.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-semibold text-stone-900 dark:text-stone-100">
            {formatTime(timeLeft)}
          </span>

          <button
            type="button"
            onClick={toggleTimer}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isRunning 
                ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900' 
                : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900'
            }`}
          >
            {isRunning ? 'Pause' : 'Start 30m'}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-750"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
