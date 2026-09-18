import React, { useState } from 'react';
import { SmallSessionsData } from '../types';
import { CS_CONCEPTS_LIST, CSConceptCard } from '../data/csConcepts';
import { Check, BookOpen, Code2, Cpu, ChevronRight, HelpCircle } from 'lucide-react';

interface SmallSessionsSectionProps {
  data: SmallSessionsData;
  onChange: (data: SmallSessionsData) => void;
  earned: boolean;
}

export const SmallSessionsSection: React.FC<SmallSessionsSectionProps> = ({ data, onChange, earned }) => {
  const [showCSDeck, setShowCSDeck] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<'ALL' | 'OS' | 'DBMS' | 'OOP' | 'CN'>('ALL');
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);

  const filteredConcepts = selectedSubject === 'ALL' 
    ? CS_CONCEPTS_LIST 
    : CS_CONCEPTS_LIST.filter(c => c.subject === selectedSubject);

  const currentConcept: CSConceptCard | undefined = filteredConcepts[activeConceptIndex % filteredConcepts.length];

  return (
    <section
      id="section-small-sessions"
      className={`bg-white dark:bg-stone-900 border rounded-xl p-5 mb-5 transition-all ${
        earned 
          ? 'border-emerald-200 dark:border-emerald-850 shadow-2xs' 
          : 'border-stone-200 dark:border-stone-800 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-base border border-emerald-500/20 dark:border-emerald-500/30 shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Small Sessions During College (Micro-Learning)
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
              Turn wasted 20–30 minute college breaks and free periods into compound learning.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCSDeck(!showCSDeck)}
          className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          <span>{showCSDeck ? 'Hide CS Cards' : 'Review CS Concepts'}</span>
        </button>
      </div>

      {/* College Micro-Session Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1: Aptitude during break */}
        <div className="p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="chk-break-aptitude"
                checked={data.aptitudeBreakDone}
                onChange={(e) => onChange({ 
                  ...data, 
                  aptitudeBreakDone: e.target.checked,
                  aptitudeBreakCount: e.target.checked && data.aptitudeBreakCount === 0 ? 10 : data.aptitudeBreakCount 
                })}
                className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-stone-300 dark:border-stone-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  Solve 10 aptitude questions during college break
                </span>
                <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                  Takes just 15 minutes between classes to keep placement aptitude sharp.
                </p>
              </div>
            </label>

            <div className="flex items-center gap-2 self-end sm:self-center pl-7 sm:pl-0">
              <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">Count:</span>
              <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-md border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, aptitudeBreakCount: Math.max(0, data.aptitudeBreakCount - 1) })}
                  className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-stone-800 dark:text-stone-200">
                  {data.aptitudeBreakCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ 
                    ...data, 
                    aptitudeBreakCount: data.aptitudeBreakCount + 1,
                    aptitudeBreakDone: true 
                  })}
                  className="px-2 py-0.5 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Item 2: Read one coding problem */}
        <div className="p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="chk-read-coding-problem"
              checked={data.codingProblemRead}
              onChange={(e) => onChange({ ...data, codingProblemRead: e.target.checked })}
              className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-stone-300 dark:border-stone-600 focus:ring-emerald-500 accent-emerald-600"
            />
            <div className="text-xs flex-1">
              <span className="font-semibold text-stone-800 dark:text-stone-200">
                Read and mentally break down one coding problem
              </span>
              <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                Read problem statement on LeetCode/GeeksForGeeks, analyze edge cases & optimal time complexity.
              </p>
              <input
                type="text"
                value={data.codingProblemTitle}
                onChange={(e) => onChange({ ...data, codingProblemTitle: e.target.value, codingProblemRead: true })}
                placeholder="Problem name (e.g. Valid Anagram, 2-Sum, Trapping Rainwater)"
                className="mt-2 w-full text-xs px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </label>
        </div>

        {/* Item 3: Revise Core CS Concept */}
        <div className="p-3 rounded-lg border border-stone-100 dark:border-stone-800/80 hover:bg-stone-50/60 dark:hover:bg-stone-800/40 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="chk-revise-cs-concept"
                checked={data.csConceptRevised}
                onChange={(e) => onChange({ ...data, csConceptRevised: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-stone-300 dark:border-stone-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  Revise one Core CS concept (OS, DBMS, OOP, CN)
                </span>
                <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                  Consistent micro-revision beats cramming for placements and competitive exams.
                </p>
              </div>
            </label>

            <div className="flex items-center gap-2 pl-7 sm:pl-0">
              <select
                value={data.csSubject}
                onChange={(e) => onChange({ ...data, csSubject: e.target.value as any, csConceptRevised: true })}
                aria-label="CS Subject revised"
                className="text-[11px] px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-medium"
              >
                <option value="OS" className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">Operating Systems</option>
                <option value="DBMS" className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">DBMS & SQL</option>
                <option value="OOP" className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">OOP & System Design</option>
                <option value="CN" className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">Computer Networks</option>
                <option value="General" className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">Other CS Theory</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            value={data.csNotes}
            onChange={(e) => onChange({ ...data, csNotes: e.target.value, csConceptRevised: true })}
            placeholder="Quick summary note (e.g. Revised Page Replacement algorithms & Belady's Anomaly)"
            className="mt-2 w-full text-xs px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* CS Concepts Flash Deck */}
      {showCSDeck && currentConcept && (
        <div className="mt-4 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-stone-200 dark:border-stone-700">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'OS', 'DBMS', 'OOP', 'CN'] as const).map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(subject);
                    setActiveConceptIndex(0);
                  }}
                  className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                    selectedSubject === subject
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveConceptIndex((prev) => prev + 1)}
              className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-950 dark:hover:text-emerald-100 flex items-center gap-1"
            >
              Next Concept <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white dark:bg-stone-800 p-3.5 rounded-lg border border-stone-200 dark:border-stone-700 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                {currentConcept.subject}
              </span>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {currentConcept.title}
              </h4>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 mb-2.5">
              {currentConcept.summary}
            </p>

            <ul className="space-y-1.5 mb-3">
              {currentConcept.keyPoints.map((point, i) => (
                <li key={i} className="text-[11px] text-stone-700 dark:text-stone-300 flex items-start gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="p-2.5 rounded bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 text-[11px] text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Interview Question: </span>
                {currentConcept.frequentInterviewQuestion}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onChange({
                  ...data,
                  csConceptRevised: true,
                  csSubject: currentConcept.subject as any,
                  csNotes: `Revised ${currentConcept.title}`,
                });
              }}
              className="mt-3 text-[11px] font-semibold px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Mark As Revised Today
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
