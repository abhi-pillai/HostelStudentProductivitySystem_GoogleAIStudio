import React from 'react';
import { LightsOutData } from '../types';
import { Check, Moon, ShieldAlert } from 'lucide-react';

interface LightsOutSectionProps {
  data: LightsOutData;
  onChange: (data: LightsOutData) => void;
  earned: boolean;
}

export const LightsOutSection: React.FC<LightsOutSectionProps> = ({ data, onChange, earned }) => {
  return (
    <section
      id="section-lights-out"
      className={`bg-white dark:bg-stone-900 border rounded-xl p-5 mb-5 transition-all ${
        earned 
          ? 'border-emerald-200 dark:border-emerald-850 shadow-2xs' 
          : 'border-stone-200 dark:border-stone-800 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 flex items-center justify-center font-mono font-bold text-base border border-purple-500/20 dark:border-purple-500/30 shrink-0">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Lights Out Discipline (Sleep Anchor)
              </h2>
              {earned ? (
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 1 Point Earned
                </span>
              ) : (
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                  Pending (1 Pt)
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Protect sleep consistency. A stable circadian cycle directly commands tomorrow's cognitive horsepower.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-md border border-stone-200/60 dark:border-stone-700/60">
          <Moon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>11:00 PM – 12:00 AM</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-screens-off"
            checked={data.screensOffEarly}
            onChange={(e) => onChange({ ...data, screensOffEarly: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-purple-600 rounded border-stone-300 dark:border-stone-600 focus:ring-purple-500 accent-purple-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Stop screens 20 minutes before bed
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              No phone in hand while lying down. Let melatonin rise naturally.
            </p>
          </div>
        </label>

        {/* Item 2 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-tomorrow-top3"
            checked={data.tomorrowTop3Written}
            onChange={(e) => onChange({ ...data, tomorrowTop3Written: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-purple-600 rounded border-stone-300 dark:border-stone-600 focus:ring-purple-500 accent-purple-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Write tomorrow’s Top 3 priorities
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Clears psychological cognitive clutter so you sleep peacefully and wake up with predetermined direction.
            </p>
          </div>
        </label>

        {/* Item 3 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-sleep-window"
            checked={data.sleptBetween11And12}
            onChange={(e) => onChange({ ...data, sleptBetween11And12: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-purple-600 rounded border-stone-300 dark:border-stone-600 focus:ring-purple-500 accent-purple-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Sleep between 11:00 PM – 12:00 AM
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Ensures 7–8 hours of uninterrupted rest before morning hard start.
            </p>
          </div>
        </label>

        {/* Cardinal Hostel Rule */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 dark:border-amber-500/30">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="chk-bed-only-sleep"
              checked={data.bedOnlyForSleep}
              onChange={(e) => onChange({ ...data, bedOnlyForSleep: e.target.checked })}
              className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 dark:border-stone-600 focus:ring-amber-500 accent-amber-600"
            />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Cardinal Rule: Bed is ONLY for Sleep</span>
              </div>
              <p className="text-amber-900/80 dark:text-amber-300/80 text-[11px] mt-1 leading-relaxed">
                Never study in bed, never watch shows in bed, and never scroll in bed. Keep study at your desk and bed strictly for restorative sleep.
              </p>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};
