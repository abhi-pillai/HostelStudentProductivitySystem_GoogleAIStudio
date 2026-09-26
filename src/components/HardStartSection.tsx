import React, { useState } from 'react';
import { HardStartData } from '../types';
import { APTITUDE_BANK, AptitudeQuestion } from '../data/aptitudeQuestions';
import { Check, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';
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
      className={`bg-[#fcfbfa] dark:bg-[#18221d] border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-[#c06541]/60 dark:border-[#e88d6a]/50 ring-1 ring-[#c06541]/15'
          : 'border-[#e4e1d6] dark:border-[#28362e]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c06541]/10 dark:bg-[#e88d6a]/15 text-[#b25735] dark:text-[#f09a79] border border-[#c06541]/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            H
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Hard Start (Morning Anchor)
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-[#b25735] dark:text-[#f09a79] px-2 py-0.5 rounded-md bg-[#c06541]/10 border border-[#c06541]/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mt-0.5">
              Activate problem-solving momentum before touching high-dopamine social apps.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPractice(!showPractice)}
          className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] bg-[#f5f3ec] dark:bg-[#1c2720] text-[#344339] dark:text-[#d3ded7] hover:bg-[#eae6db] dark:hover:bg-[#233229] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
          <span>{showPractice ? 'Hide Practice' : 'Practice Questions'}</span>
        </button>
      </div>

      {/* Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-wake-no-phone"
            checked={data.wakeNoPhone}
            onChange={(e) => onChange({ ...data, wakeNoPhone: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Wake up without checking phone
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Avoid early dopamine leaks (Instagram, YouTube, messaging). Leave phone on desk.
            </p>
          </div>
        </label>

        {/* Item 2 */}
        <label className="flex items-start gap-3 p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-water-freshen"
            checked={data.waterFreshen}
            onChange={(e) => onChange({ ...data, waterFreshen: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Drink water and freshen up
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Hydrate immediately to wake up cognitive alertness.
            </p>
          </div>
        </label>

        {/* Item 3 */}
        <div className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] transition-colors">
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
                className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                  Solve 15–20 aptitude questions
                </span>
                <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
                  Engage cognitive faculties immediately. Target: 15–20 questions.
                </p>
              </div>
            </label>

            {/* Quick Count Stepper */}
            <div className="flex items-center gap-2 self-end sm:self-center pl-7 sm:pl-0">
              <span className="text-xs text-[#526357] dark:text-[#9bb0a2] font-normal">Solved:</span>
              <div className="flex items-center bg-[#efece4] dark:bg-[#202d25] rounded-md border border-[#dedad0] dark:border-[#2c3d33]">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, aptitudeCount: Math.max(0, data.aptitudeCount - 1) })}
                  className="px-2 py-0.5 text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white text-xs font-bold"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-[#1b2620] dark:text-[#edf0ec]">
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
                  className="px-2 py-0.5 text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white text-xs font-bold"
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
                className="text-xs font-medium px-2 py-1 rounded bg-[#efece4] dark:bg-[#202d25] text-[#344339] dark:text-[#d3ded7] hover:bg-[#e4e0d4] dark:hover:bg-[#28382f] border border-[#dedad0] dark:border-[#2c3d33]"
              >
                +5
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Aptitude Practice Deck */}
      {showPractice && (
        <div className="mt-4 p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#28382e]">
          <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-[#dedad0] dark:border-[#28382e]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] uppercase tracking-wider">
                Question {currentQIndex + 1} of {APTITUDE_BANK.length}
              </span>
              <span className="text-[11px] text-[#526357] dark:text-[#9bb0a2] font-mono">
                · {currentQ.category}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextQuestion}
              className="text-xs font-medium text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] flex items-center gap-1"
            >
              Skip / Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs font-medium text-[#1b2620] dark:text-[#edf0ec] leading-relaxed mb-3">
            {currentQ.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;
              let btnStyle = 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#dedad0] dark:border-[#2c3d33] text-[#344339] dark:text-[#d3ded7] hover:bg-[#eae6db] dark:hover:bg-[#223128]';

              if (showAnswer) {
                if (isCorrect) {
                  btnStyle = 'bg-[#2d5641]/15 dark:bg-[#7fc09d]/20 border-[#2d5641]/40 dark:border-[#7fc09d]/50 text-[#1b2620] dark:text-[#edf0ec] font-semibold';
                } else if (isSelected) {
                  btnStyle = 'bg-[#c06541]/10 dark:bg-[#e88d6a]/15 border-[#c06541]/30 text-[#b25735] dark:text-[#f09a79] line-through';
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
                  {showAnswer && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d] shrink-0" />}
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className="p-3 rounded-lg bg-[#fcfbfa] dark:bg-[#18221d] border border-[#dedad0] dark:border-[#2c3d33] text-xs text-[#344339] dark:text-[#d3ded7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">Explanation: </span>
                {currentQ.explanation}
              </div>
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-3 py-1.5 rounded-md bg-[#2d5641] hover:bg-[#234534] text-white dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] dark:text-[#0f1d15] font-medium text-xs transition-colors shrink-0 self-end sm:self-auto"
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
