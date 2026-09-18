import React, { useState } from 'react';
import { HardStartData } from '../types';
import { APTITUDE_BANK, AptitudeQuestion } from '../data/aptitudeQuestions';
import { Sun, Check, Sparkles, BookOpen, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { playChime } from '../utils/sound';

interface HardStartSectionProps {
  data: HardStartData;
  onChange: (data: HardStartData) => void;
  earned: boolean;
}

export const HardStartSection: React.FC<HardStartSectionProps> = ({ data, onChange, earned }) => {
  const [showPractice, setShowPractice] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQ: AptitudeQuestion = APTITUDE_BANK[currentQIndex % APTITUDE_BANK.length];

  const handleOptionSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);

    if (index === currentQ.correctIndex) {
      playChime('success');
      const newCount = data.aptitudeCount + 1;
      onChange({
        ...data,
        aptitudeCount: newCount,
        aptitudeDone: newCount >= 15 ? true : data.aptitudeDone
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setCurrentQIndex((prev) => (prev + 1) % APTITUDE_BANK.length);
  };

  return (
    <section 
      id="section-hard-start" 
      className={`bg-white dark:bg-stone-900 border rounded-xl p-5 mb-5 transition-all ${
        earned 
          ? 'border-emerald-200 dark:border-emerald-850 shadow-2xs' 
          : 'border-stone-200 dark:border-stone-800 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-mono font-bold text-base border border-amber-500/20 dark:border-amber-500/30 shrink-0">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Hard Start (Morning Anchor)
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
              Activate problem-solving momentum before touching high-dopamine social apps.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPractice(!showPractice)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>{showPractice ? 'Hide Practice Deck' : 'Solve Questions Here'}</span>
        </button>
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-wake-no-phone"
            checked={data.wakeNoPhone}
            onChange={(e) => onChange({ ...data, wakeNoPhone: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 dark:border-stone-600 focus:ring-amber-500 accent-amber-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Wake up without checking phone
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Avoid early dopamine leaks (Instagram, YouTube, messaging). Leave phone on desk.
            </p>
          </div>
        </label>

        {/* Item 2 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-water-freshen"
            checked={data.waterFreshen}
            onChange={(e) => onChange({ ...data, waterFreshen: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 dark:border-stone-600 focus:ring-amber-500 accent-amber-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Drink water and freshen up
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Hydrate immediately to wake up cognitive alertness.
            </p>
          </div>
        </label>

        {/* Item 3 */}
        <div className="p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="chk-aptitude-done"
                checked={data.aptitudeDone || data.aptitudeCount >= 15}
                onChange={(e) => onChange({ 
                  ...data, 
                  aptitudeDone: e.target.checked,
                  aptitudeCount: e.target.checked && data.aptitudeCount < 15 ? 15 : data.aptitudeCount
                })}
                className="w-4 h-4 mt-0.5 text-amber-600 rounded border-stone-300 dark:border-stone-600 focus:ring-amber-500 accent-amber-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  Solve 15–20 aptitude questions
                </span>
                <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                  Engage cognitive faculties immediately. Target: 15–20 questions.
                </p>
              </div>
            </label>

            {/* Quick Count Stepper */}
            <div className="flex items-center gap-2 self-end sm:self-center pl-7 sm:pl-0">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Solved:</span>
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, aptitudeCount: Math.max(0, data.aptitudeCount - 1) })}
                  className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                  {data.aptitudeCount}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const newCount = data.aptitudeCount + 1;
                    onChange({
                      ...data,
                      aptitudeCount: newCount,
                      aptitudeDone: newCount >= 15 ? true : data.aptitudeDone
                    });
                  }}
                  className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newCount = data.aptitudeCount + 5;
                  onChange({
                    ...data,
                    aptitudeCount: newCount,
                    aptitudeDone: newCount >= 15 ? true : data.aptitudeDone
                  });
                }}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700"
              >
                +5
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Aptitude Practice Deck */}
      {showPractice && (
        <div className="mt-4 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
          <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-amber-200/70 dark:border-amber-800/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                Question {currentQIndex + 1} of {APTITUDE_BANK.length}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold">
                {currentQ.category}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextQuestion}
              className="text-xs font-medium text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 flex items-center gap-1"
            >
              Skip / Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-relaxed mb-3">
            {currentQ.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-amber-50/40 dark:hover:bg-amber-950/30';

              if (showAnswer) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200 line-through';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  disabled={showAnswer}
                  className={`text-xs p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {showAnswer && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className="p-3 rounded-lg bg-white dark:bg-stone-800 border border-amber-200 dark:border-amber-800/60 text-xs text-stone-700 dark:text-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-stone-900 dark:text-stone-100">Explanation: </span>
                {currentQ.explanation}
              </div>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-3 py-1 rounded-md bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors shrink-0 self-end sm:self-auto"
              >
                Next Problem
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
