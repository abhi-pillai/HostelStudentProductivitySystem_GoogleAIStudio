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
      className={`bg-[#fcfbfa] dark:bg-[#18221d] border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-[#6b5b7b]/60 dark:border-[#ab9cc4]/50 ring-1 ring-[#6b5b7b]/15'
          : 'border-[#e4e1d6] dark:border-[#28362e]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6b5b7b]/10 dark:bg-[#ab9cc4]/15 text-[#544662] dark:text-[#bfb2d4] border border-[#6b5b7b]/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            L
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Lights Out Discipline (Sleep Anchor)
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-[#544662] dark:text-[#bfb2d4] px-2 py-0.5 rounded-md bg-[#6b5b7b]/10 border border-[#6b5b7b]/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mt-0.5">
              Protect sleep consistency. A stable circadian cycle directly commands tomorrow's cognitive horsepower.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#526357] dark:text-[#9bb0a2] bg-[#f5f3ec] dark:bg-[#1c2720] px-2.5 py-1 rounded-lg border border-[#dedad0] dark:border-[#2b3a31]">
          <Moon className="w-3.5 h-3.5 text-[#6b5b7b] dark:text-[#ab9cc4]" />
          <span>11:00 PM – 12:00 AM</span>
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-screens-off"
            checked={data.screensOffEarly}
            onChange={(e) => onChange({ ...data, screensOffEarly: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Stop screens 20 minutes before bed
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              No phone in hand while lying down. Let melatonin rise naturally.
            </p>
          </div>
        </label>

        {/* Item 2 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-tomorrow-top3"
            checked={data.tomorrowTop3Written}
            onChange={(e) => onChange({ ...data, tomorrowTop3Written: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Write tomorrow’s Top 3 priorities
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Clears psychological cognitive clutter so you sleep peacefully and wake up with predetermined direction.
            </p>
          </div>
        </label>

        {/* Item 3 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-sleep-window"
            checked={data.sleptBetween11And12}
            onChange={(e) => onChange({ ...data, sleptBetween11And12: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Sleep between 11:00 PM – 12:00 AM
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Ensures 7–8 hours of uninterrupted rest before morning hard start.
            </p>
          </div>
        </label>

        {/* Cardinal Hostel Rule */}
        <div className="p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#28382e]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="chk-bed-only-sleep"
              checked={data.bedOnlyForSleep}
              onChange={(e) => onChange({ ...data, bedOnlyForSleep: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
            />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                <ShieldAlert className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
                <span>Cardinal Rule: Bed is ONLY for Sleep</span>
              </div>
              <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-1 leading-relaxed">
                Never study in bed, never watch shows in bed, and never scroll in bed. Keep study at your desk and bed strictly for restorative sleep.
              </p>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
};
