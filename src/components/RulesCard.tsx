import React from 'react';
import { X, CheckCircle2, Shield, Target, Award, Lightbulb } from 'lucide-react';

interface RulesCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesCard: React.FC<RulesCardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div 
        className="bg-white dark:bg-stone-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-stone-200 dark:border-stone-800"
        id="rules-modal"
      >
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              The H.O.S.T.E.L. System Blueprint
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              High Output Student Time Execution Loop
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs leading-relaxed text-stone-700 dark:text-stone-300">
          {/* Core premise */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/60">
            <h4 className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5 mb-1">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Core Philosophy
            </h4>
            <p className="text-amber-900 dark:text-amber-200/90">
              Productivity does not come from motivation. It comes from <strong>daily behavioral systems</strong>. Instead of managing dozens of tasks, H.O.S.T.E.L. structures the flow of your day so productive work happens consistently.
            </p>
          </div>

          {/* 6 Behaviors */}
          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-2">
              The 6 Managed Behaviors
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <span className="font-bold text-stone-900 dark:text-stone-100">1. H — Hard Start:</span> Start day with 15–20 aptitude questions before touching phone.
              </div>
              <div className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <span className="font-bold text-stone-900 dark:text-stone-100">2. O — Organize:</span> Lock in Top 3 essential priorities before leaving for college.
              </div>
              <div className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <span className="font-bold text-stone-900 dark:text-stone-100">3. S — Small Sessions:</span> Turn 20–30 min college breaks into coding or CS concept review.
              </div>
              <div className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <span className="font-bold text-stone-900 dark:text-stone-100">4. T — Targeted Evening:</span> Deep work block (1 hr coding, 45 min project, 30 min GATE/prep).
              </div>
              <div className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <span className="font-bold text-stone-900 dark:text-stone-100">5. E — Entertainment Limits:</span> Leisure only after 9:30 PM, strictly capped at 30 minutes.
              </div>
              <div className="p-2.5 rounded-lg border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <span className="font-bold text-stone-900 dark:text-stone-100">6. L — Lights Out:</span> Screen cutoff 20m before bed, sleep 11:00–12:00, bed only for sleep.
              </div>
            </div>
          </div>

          {/* Scoring rubric */}
          <div>
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Daily Score System (Max: 6)
            </h4>
            <div className="space-y-1 text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-stone-800/50 p-3 rounded-lg border border-stone-100 dark:border-stone-800">
              <p><strong className="text-emerald-700 dark:text-emerald-400">6:</strong> Excellent execution</p>
              <p><strong className="text-teal-700 dark:text-teal-400">5:</strong> Strong day</p>
              <p><strong className="text-amber-700 dark:text-amber-400">4:</strong> Acceptable progress</p>
              <p><strong className="text-orange-700 dark:text-orange-400">3:</strong> Weak execution</p>
              <p><strong className="text-rose-700 dark:text-rose-400">0–2:</strong> System reset required</p>
            </div>
          </div>

          {/* Cardinal Hostel Rule */}
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/60">
            <h4 className="font-bold text-rose-950 dark:text-rose-300 flex items-center gap-1.5 mb-1">
              <Shield className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Important Rule for Hostel Students
            </h4>
            <p className="text-rose-900 dark:text-rose-200/90">
              Your <strong>bed should only be used for sleep</strong>. Avoid watching shows in bed, scrolling social media in bed, or studying in bed. This trains your brain to associate the bed with sleep only, preventing insomnia and irregular sleep cycles.
            </p>
          </div>

          {/* Final Principle */}
          <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 mb-1">
              <Lightbulb className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              Final Principle
            </h4>
            <p className="text-stone-700 dark:text-stone-300">
              Do not aim for perfect days. Aim for <strong>consistent execution of the loop</strong>. Small daily progress compounds into major academic and placement outcomes over time.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-lg text-xs font-semibold transition-colors"
          >
            Got It, Back to Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
