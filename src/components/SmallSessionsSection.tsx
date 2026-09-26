import React, { useState } from 'react';
import { SmallSessionsData } from '../types';
import { CS_CONCEPTS_LIST, CSConceptCard } from '../data/csConcepts';
import { Check, Cpu, ChevronRight, HelpCircle } from 'lucide-react';

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
      className={`bg-[#fcfbfa] dark:bg-[#18221d] border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-[#2d5641]/60 dark:border-[#7fc09d]/50 ring-1 ring-[#2d5641]/15'
          : 'border-[#e4e1d6] dark:border-[#28362e]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 text-[#244b37] dark:text-[#88d2af] border border-[#2d5641]/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Small Sessions During College (Micro-Learning)
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-[#244b37] dark:text-[#88d2af] px-2 py-0.5 rounded-md bg-[#2d5641]/10 border border-[#2d5641]/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mt-0.5">
              Turn wasted 20–30 minute college breaks and free periods into compound learning.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCSDeck(!showCSDeck)}
          className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[#dedad0] dark:border-[#2b3a31] bg-[#f5f3ec] dark:bg-[#1c2720] text-[#344339] dark:text-[#d3ded7] hover:bg-[#eae6db] dark:hover:bg-[#233229] transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Cpu className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395]" />
          <span>{showCSDeck ? 'Hide CS Cards' : 'Review CS Concepts'}</span>
        </button>
      </div>

      {/* College Micro-Session Checklist */}
      <div className="mt-4 space-y-2.5">
        {/* Item 1: Aptitude during break */}
        <div className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] transition-colors">
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
                className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                  Solve 10 aptitude questions during college break
                </span>
                <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
                  Takes just 15 minutes between classes to keep placement aptitude sharp.
                </p>
              </div>
            </label>

            <div className="flex items-center gap-2 self-end sm:self-center pl-7 sm:pl-0">
              <span className="text-xs text-[#526357] dark:text-[#9bb0a2] font-normal">Count:</span>
              <div className="flex items-center bg-[#efece4] dark:bg-[#202d25] rounded-md border border-[#dedad0] dark:border-[#2c3d33]">
                <button
                  type="button"
                  onClick={() => onChange({ ...data, aptitudeBreakCount: Math.max(0, data.aptitudeBreakCount - 1) })}
                  className="px-2 py-0.5 text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white text-xs font-bold"
                >
                  -
                </button>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-[#1b2620] dark:text-[#edf0ec]">
                  {data.aptitudeBreakCount}
                </span>
                <button
                  type="button"
                  onClick={() => onChange({ 
                    ...data, 
                    aptitudeBreakCount: data.aptitudeBreakCount + 1,
                    aptitudeBreakDone: true 
                  })}
                  className="px-2 py-0.5 text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Item 2: Read one coding problem */}
        <div className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] transition-colors">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="chk-read-coding-problem"
              checked={data.codingProblemRead}
              onChange={(e) => onChange({ ...data, codingProblemRead: e.target.checked })}
              className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
            />
            <div className="text-xs flex-1">
              <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                Read and mentally break down one coding problem
              </span>
              <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
                Read problem statement on LeetCode/GeeksForGeeks, analyze edge cases & optimal time complexity.
              </p>
              <input
                type="text"
                value={data.codingProblemTitle}
                onChange={(e) => onChange({ ...data, codingProblemTitle: e.target.value, codingProblemRead: true })}
                placeholder="Problem name (e.g. Valid Anagram, 2-Sum, Trapping Rainwater)"
                className="mt-2 w-full text-xs px-2.5 py-1.5 rounded-md border border-[#dedad0] dark:border-[#2b3a31] bg-[#f7f6f0] dark:bg-[#1e2a22] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:border-[#2d5641] dark:focus:border-[#7fc09d]"
              />
            </div>
          </label>
        </div>

        {/* Item 3: Revise Core CS Concept */}
        <div className="p-3 rounded-lg border border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="chk-revise-cs-concept"
                checked={data.csConceptRevised}
                onChange={(e) => onChange({ ...data, csConceptRevised: e.target.checked })}
                className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                  Revise one Core CS concept (OS, DBMS, OOP, CN)
                </span>
                <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
                  Consistent micro-revision beats cramming for placements and competitive exams.
                </p>
              </div>
            </label>

            <div className="flex items-center gap-2 pl-7 sm:pl-0">
              <select
                value={data.csSubject}
                onChange={(e) => onChange({ ...data, csSubject: e.target.value as any, csConceptRevised: true })}
                aria-label="CS Subject revised"
                className="text-xs px-2 py-1 rounded border border-[#dedad0] dark:border-[#2c3d33] bg-[#efece4] dark:bg-[#202d25] text-[#1b2620] dark:text-[#edf0ec] font-medium"
              >
                <option value="OS" className="bg-[#fcfbfa] dark:bg-[#18221d] text-[#1b2620] dark:text-[#edf0ec]">Operating Systems</option>
                <option value="DBMS" className="bg-[#fcfbfa] dark:bg-[#18221d] text-[#1b2620] dark:text-[#edf0ec]">DBMS & SQL</option>
                <option value="OOP" className="bg-[#fcfbfa] dark:bg-[#18221d] text-[#1b2620] dark:text-[#edf0ec]">OOP & System Design</option>
                <option value="CN" className="bg-[#fcfbfa] dark:bg-[#18221d] text-[#1b2620] dark:text-[#edf0ec]">Computer Networks</option>
                <option value="General" className="bg-[#fcfbfa] dark:bg-[#18221d] text-[#1b2620] dark:text-[#edf0ec]">Other CS Theory</option>
              </select>
            </div>
          </div>

          <input
            type="text"
            value={data.csNotes}
            onChange={(e) => onChange({ ...data, csNotes: e.target.value, csConceptRevised: true })}
            placeholder="Quick summary note (e.g. Revised Page Replacement algorithms & Belady's Anomaly)"
            className="mt-2 w-full text-xs px-2.5 py-1.5 rounded-md border border-[#dedad0] dark:border-[#2b3a31] bg-[#f7f6f0] dark:bg-[#1e2a22] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:border-[#2d5641] dark:focus:border-[#7fc09d]"
          />
        </div>
      </div>

      {/* CS Concepts Flash Deck */}
      {showCSDeck && currentConcept && (
        <div className="mt-4 p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#28382e]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-3 border-b border-[#dedad0] dark:border-[#28382e]">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'OS', 'DBMS', 'OOP', 'CN'] as const).map((subject) => (
                <button
                  key={subject}
                  type="button"
                  onClick={() => {
                    setSelectedSubject(subject);
                    setActiveConceptIndex(0);
                  }}
                  className={`text-[10px] font-mono font-medium px-2 py-1 rounded transition-colors ${
                    selectedSubject === subject
                      ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15]'
                      : 'bg-[#fcfbfa] dark:bg-[#18221d] text-[#344339] dark:text-[#d3ded7] hover:bg-[#edeae0] dark:hover:bg-[#233229] border border-[#dedad0] dark:border-[#2c3d33]'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveConceptIndex((prev) => prev + 1)}
              className="text-xs font-medium text-[#526357] dark:text-[#9bb0a2] hover:text-[#1b2620] dark:hover:text-[#edf0ec] flex items-center gap-1"
            >
              Next Concept <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[#fcfbfa] dark:bg-[#18221d] p-3.5 rounded-lg border border-[#dedad0] dark:border-[#2c3d33]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 text-[#244b37] dark:text-[#88d2af]">
                {currentConcept.subject}
              </span>
              <h4 className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
                {currentConcept.title}
              </h4>
            </div>

            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mb-2.5">
              {currentConcept.summary}
            </p>

            <ul className="space-y-1.5 mb-3">
              {currentConcept.keyPoints.map((point, i) => (
                <li key={i} className="text-xs text-[#344339] dark:text-[#d3ded7] flex items-start gap-1.5">
                  <span className="text-[#2d5641] dark:text-[#7fc09d] font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="p-2.5 rounded bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2b3a31] text-xs text-[#344339] dark:text-[#d3ded7] flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-[#5f7467] dark:text-[#8fa395] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">Interview Question: </span>
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
              className="mt-3 text-xs font-medium px-3 py-1.5 rounded-md bg-[#2d5641] hover:bg-[#224433] text-white dark:bg-[#7fc09d] dark:hover:bg-[#91d1b0] dark:text-[#0f1d15] transition-colors"
            >
              Mark As Revised Today
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
