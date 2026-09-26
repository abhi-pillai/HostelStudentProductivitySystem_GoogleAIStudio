import React, { useState, useEffect, useRef } from 'react';
import { EntertainmentData } from '../types';
import { Check, RotateCcw, Tv } from 'lucide-react';
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
      className={`bg-[#fcfbfa] dark:bg-[#18221d] border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-[#b25555]/60 dark:border-[#e07a7a]/50 ring-1 ring-[#b25555]/15'
          : 'border-[#e4e1d6] dark:border-[#28362e]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#b25555]/10 dark:bg-[#e07a7a]/15 text-[#964242] dark:text-[#efa1a1] border border-[#b25555]/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            E
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Entertainment with Limits
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-[#964242] dark:text-[#efa1a1] px-2 py-0.5 rounded-md bg-[#b25555]/10 border border-[#b25555]/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mt-0.5">
              Hostels make binge watching tempting. Schedule leisure strictly after 9:30 PM with a hard 30-min cutoff.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#526357] dark:text-[#9bb0a2] bg-[#f5f3ec] dark:bg-[#1c2720] px-2.5 py-1 rounded-lg border border-[#dedad0] dark:border-[#2b3a31]">
          <Tv className="w-3.5 h-3.5 text-[#b25555] dark:text-[#e07a7a]" />
          <span>Max 30m</span>
        </div>
      </div>

      {/* Rules & Checkboxes */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Rule 1 */}
        <label className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-time"
            checked={data.startedAfter930}
            onChange={(e) => onChange({ ...data, startedAfter930: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Only after 9:30 PM
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Never consume passive entertainment during prime evening study hours.
            </p>
          </div>
        </label>

        {/* Rule 2 */}
        <label className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-cap"
            checked={data.under30Mins}
            onChange={(e) => onChange({ ...data, under30Mins: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Maximum 30 Minutes
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              One episode or short video. Hard stop when timer rings.
            </p>
          </div>
        </label>

        {/* Rule 3 */}
        <label className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors flex items-start gap-3">
          <input
            type="checkbox"
            id="chk-entertainment-no-binge"
            checked={data.noWeekdayBinge}
            onChange={(e) => onChange({ ...data, noWeekdayBinge: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              No Weekday Bingeing
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Zero multi-hour movie/series marathons on college nights.
            </p>
          </div>
        </label>
      </div>

      {/* 30-min Entertainment Timer Widget */}
      <div className="mt-4 p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#28382e] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#b25555]/10 dark:bg-[#e07a7a]/15 text-[#964242] dark:text-[#efa1a1] flex items-center justify-center font-medium text-xs">
            30m
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Entertainment Guardrail Timer
            </div>
            <div className="text-[11px] text-[#526357] dark:text-[#9bb0a2]">
              Set this timer before opening YouTube, Netflix, or social apps.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xl font-semibold text-[#1b2620] dark:text-[#edf0ec]">
            {formatTime(timeLeft)}
          </span>

          <button
            type="button"
            onClick={toggleTimer}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              isRunning 
                ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15]' 
                : 'bg-[#2d5641] hover:bg-[#224433] text-white dark:bg-[#7fc09d] dark:hover:bg-[#91d1b0] dark:text-[#0f1d15]'
            }`}
          >
            {isRunning ? 'Pause' : 'Start 30m'}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            className="p-1.5 text-[#798b7f] hover:text-[#1b2620] dark:text-[#6e8275] dark:hover:text-[#edf0ec] rounded-lg hover:bg-[#eae6db] dark:hover:bg-[#25362c] transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
