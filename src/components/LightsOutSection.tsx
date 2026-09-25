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
      className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 mb-5 shadow-2xs transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 flex items-center justify-center font-mono font-bold text-sm border border-stone-200 dark:border-stone-700 shrink-0">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Lights Out Discipline (Sleep Anchor)
              </h2>
              {earned ? (
                <span className="text-xs font-medium text-stone-600 dark:text-stone-300 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" /> Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-stone-400 dark:text-stone-500">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Protect sleep consistency. A stable circadian cycle directly commands tomorrow's cognitive horsepower.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-850 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-750">
          <Moon className="w-3.5 h-3.5 text-stone-400" />
          <span>11:00 PM – 12:00 AM</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-150 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-850/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-screens-off"
            checked={data.screensOffEarly}
            onChange={(e) => onChange({ ...data, screensOffEarly: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
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
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-150 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-850/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-tomorrow-top3"
            checked={data.tomorrowTop3Written}
            onChange={(e) => onChange({ ...data, tomorrowTop3Written: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
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
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-150 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-850/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-sleep-window"
            checked={data.sleptBetween11And12}
            onChange={(e) => onChange({ ...data, sleptBetween11And12: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
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
        <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="chk-bed-only-sleep"
              checked={data.bedOnlyForSleep}
              onChange={(e) => onChange({ ...data, bedOnlyForSleep: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-stone-300 dark:border-stone-600 accent-stone-900 dark:accent-stone-100"
            />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                <ShieldAlert className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                <span>Cardinal Rule: Bed is ONLY for Sleep</span>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-1 leading-relaxed">
                Never study in bed, never watch shows in bed, and never scroll in bed. Keep study at your desk and bed strictly for restorative sleep.
              </p>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};
