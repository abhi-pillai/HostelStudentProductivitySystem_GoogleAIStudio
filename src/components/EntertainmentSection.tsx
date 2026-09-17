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
      className={`bg-white border rounded-xl p-5 mb-5 transition-all ${
        earned ? 'border-emerald-200 shadow-2xs' : 'border-stone-200 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-700 flex items-center justify-center font-mono font-bold text-base border border-rose-500/20 shrink-0">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">
                Entertainment with Limits
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
              Hostels make binge watching tempting. Schedule leisure strictly after 9:30 PM with a hard 30-min cutoff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
          <Tv className="w-3.5 h-3.5 text-stone-500" />
          <span>Max 30m</span>
        </div>
      </div>

      {/* Rules & Checkboxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Rule 1 */}
        <label className="p-3 rounded-lg border border-stone-100 hover:bg-stone-50/60 cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-time"
            checked={data.startedAfter930}
            onChange={(e) => onChange({ ...data, startedAfter930: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-rose-600 rounded border-stone-300 focus:ring-rose-500 accent-rose-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800">
              Only after 9:30 PM
            </span>
            <p className="text-stone-500 text-[11px] mt-0.5">
              Never consume passive entertainment during prime evening study hours.
            </p>
          </div>
        </label>

        {/* Rule 2 */}
        <label className="p-3 rounded-lg border border-stone-100 hover:bg-stone-50/60 cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-cap"
            checked={data.under30Mins}
            onChange={(e) => onChange({ ...data, under30Mins: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-rose-600 rounded border-stone-300 focus:ring-rose-500 accent-rose-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800">
              Maximum 30 Minutes
            </span>
            <p className="text-stone-500 text-[11px] mt-0.5">
              One episode or short video. Hard stop when timer rings.
            </p>
          </div>
        </label>

        {/* Rule 3 */}
        <label className="p-3 rounded-lg border border-stone-100 hover:bg-stone-50/60 cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-no-binge"
            checked={data.noWeekdayBinge}
            onChange={(e) => onChange({ ...data, noWeekdayBinge: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-rose-600 rounded border-stone-300 focus:ring-rose-500 accent-rose-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800">
              No Weekday Bingeing
            </span>
            <p className="text-stone-500 text-[11px] mt-0.5">
              Zero multi-hour movie/series marathons on college nights.
            </p>
          </div>
        </label>
      </div>

      {/* 30-min Entertainment Timer Widget */}
      <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            ⏱
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900">
              30-Minute Entertainment Guardrail
            </div>
            <div className="text-[11px] text-stone-500">
              Set this timer before opening YouTube, Netflix, or anime.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-bold text-rose-700">
            {formatTime(timeLeft)}
          </span>

          <button
            type="button"
            onClick={toggleTimer}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              isRunning ? 'bg-amber-600 text-white' : 'bg-stone-800 text-white hover:bg-stone-900'
            }`}
          >
            {isRunning ? 'Pause' : 'Start 30m'}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1 text-stone-400 hover:text-stone-600"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
