import React from 'react';
import { X, Shield, Target, Award, Lightbulb } from 'lucide-react';

interface RulesCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesCard: React.FC<RulesCardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121815]/70 backdrop-blur-xs">
      <div 
        className="bg-[#fcfbfa] dark:bg-[#18221d] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-[#e4e1d6] dark:border-[#28362e]"
        id="rules-modal"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
          <div>
            <h3 className="text-lg font-bold text-[#1b2620] dark:text-[#edf0ec]">
              The H.O.S.T.E.L. System Blueprint
            </h3>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2]">
              High Output Student Time Execution Loop
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#798b7f] dark:text-[#6e8275] hover:text-[#1b2620] dark:hover:text-[#edf0ec] p-1.5 rounded-lg hover:bg-[#edeae0] dark:hover:bg-[#223128] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs leading-relaxed text-[#344339] dark:text-[#d3ded7]">
          {/* Core premise */}
          <div className="p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <h4 className="font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center gap-1.5 mb-1">
              <Target className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
              Core Philosophy
            </h4>
            <p className="text-[#526357] dark:text-[#9bb0a2]">
              Productivity does not come from motivation. It comes from <strong>daily behavioral systems</strong>. Instead of managing dozens of tasks, H.O.S.T.E.L. structures the flow of your day so productive work happens consistently.
            </p>
          </div>

          {/* 6 Behaviors */}
          <div>
            <h4 className="font-semibold text-[#1b2620] dark:text-[#edf0ec] text-sm mb-2">
              The 6 Managed Behaviors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720]">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">1. H — Hard Start:</span> Start day with 15–20 aptitude questions before touching phone.
              </div>
              <div className="p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720]">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">2. O — Organize:</span> Lock in Top 3 essential priorities before leaving for college.
              </div>
              <div className="p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720]">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">3. S — Small Sessions:</span> Turn 20–30 min college breaks into coding or CS concept review.
              </div>
              <div className="p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720]">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">4. T — Targeted Evening:</span> Deep work block (1 hr coding, 45 min project, 30 min GATE/prep).
              </div>
              <div className="p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720]">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">5. E — Entertainment Limits:</span> Leisure only after 9:30 PM, strictly capped at 30 minutes.
              </div>
              <div className="p-2.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720]">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">6. L — Lights Out:</span> Screen cutoff 20m before bed, sleep 11:00–12:00, bed only for sleep.
              </div>
            </div>
          </div>

          {/* Scoring rubric */}
          <div>
            <h4 className="font-semibold text-[#1b2620] dark:text-[#edf0ec] text-sm mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
              Daily Score System (Max: 6)
            </h4>
            <div className="space-y-1 text-[#526357] dark:text-[#9bb0a2] bg-[#f5f3ec] dark:bg-[#1c2720] p-3 rounded-lg border border-[#dedad0] dark:border-[#2c3d33]">
              <p><strong className="text-[#1b2620] dark:text-[#edf0ec] font-mono">6:</strong> Excellent execution</p>
              <p><strong className="text-[#2d5641] dark:text-[#7fc09d] font-mono">5:</strong> Strong day</p>
              <p><strong className="text-[#344339] dark:text-[#d3ded7] font-mono">4:</strong> Acceptable progress (Passing baseline)</p>
              <p><strong className="text-[#798b7f] dark:text-[#6e8275] font-mono">3:</strong> Weak execution</p>
              <p><strong className="text-[#c06541] dark:text-[#e88d6a] font-mono">0–2:</strong> System reset required</p>
            </div>
          </div>

          {/* Cardinal Hostel Rule */}
          <div className="p-3.5 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]">
            <h4 className="font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center gap-1.5 mb-1">
              <Shield className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
              Important Rule for Hostel Students
            </h4>
            <p className="text-[#526357] dark:text-[#9bb0a2]">
              Your <strong>bed should only be used for sleep</strong>. Avoid watching shows in bed, scrolling social media in bed, or studying in bed. This trains your brain to associate the bed with sleep only, preventing insomnia and irregular sleep cycles.
            </p>
          </div>

          {/* Final Principle */}
          <div className="p-3.5 rounded-xl bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 border border-[#2d5641]/25 dark:border-[#7fc09d]/30">
            <h4 className="font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d]" />
              Final Principle
            </h4>
            <p className="text-[#2a382f] dark:text-[#d7e2da]">
              Do not aim for perfect days. Aim for <strong>consistent execution of the loop</strong>. Small daily progress compounds into major academic and placement outcomes over time.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#e5e1d7] dark:border-[#28382e] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Got It, Back to Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
