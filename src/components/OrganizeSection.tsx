import React, { useState } from 'react';
import { OrganizeData, PriorityItem, PriorityCategory } from '../types';
import { Check, Plus, Trash2, Clock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { playChime } from '../utils/sound';

interface OrganizeSectionProps {
  data: OrganizeData;
  onChange: (data: OrganizeData) => void;
  earned: boolean;
}

const CATEGORIES: PriorityCategory[] = ['Coding', 'Project', 'GATE', 'Placement', 'Academics', 'Other'];

const QUICK_TEMPLATES: { text: string; category: PriorityCategory; slot: string }[] = [
  { text: 'Solve 3 LeetCode Mediums (Trees / Graphs)', category: 'Coding', slot: '07:30 PM - 08:30 PM' },
  { text: 'Implement REST API endpoints & tests', category: 'Project', slot: '08:30 PM - 09:30 PM' },
  { text: 'Revise OS Virtual Memory & Paging formulas', category: 'GATE', slot: '05:30 PM - 06:30 PM' },
  { text: 'Practice 20 quantitative aptitude speed drills', category: 'Placement', slot: '04:30 PM - 05:15 PM' },
  { text: 'Complete Lab manual assignment submission', category: 'Academics', slot: '06:30 PM - 07:15 PM' },
];

export const OrganizeSection: React.FC<OrganizeSectionProps> = ({ data, onChange, earned }) => {
  const [showTemplates, setShowTemplates] = useState(false);

  const completedCount = data.priorities.filter(p => p.completed && p.text.trim().length > 0).length;
  const activeCount = data.priorities.filter(p => p.text.trim().length > 0).length;

  const updatePriority = (id: string, updates: Partial<PriorityItem>) => {
    const updated = data.priorities.map((p) => {
      if (p.id === id) {
        if (updates.completed && !p.completed) {
          playChime('success');
        }
        return { ...p, ...updates };
      }
      return p;
    });
    onChange({ ...data, priorities: updated });
  };

  const addPriority = () => {
    if (data.priorities.length >= 5) return;
    const newItem: PriorityItem = {
      id: Date.now().toString(),
      text: '',
      timeSlot: '08:00 PM - 09:00 PM',
      category: 'Coding',
      completed: false,
    };
    onChange({ ...data, priorities: [...data.priorities, newItem] });
  };

  const removePriority = (id: string) => {
    if (data.priorities.length <= 3) {
      const updated = data.priorities.map((p) =>
        p.id === id ? { ...p, text: '', completed: false } : p
      );
      onChange({ ...data, priorities: updated });
      return;
    }
    onChange({ ...data, priorities: data.priorities.filter((p) => p.id !== id) });
  };

  const applyTemplate = (template: typeof QUICK_TEMPLATES[0]) => {
    const emptyIndex = data.priorities.findIndex(p => !p.text.trim());
    if (emptyIndex !== -1) {
      const updated = [...data.priorities];
      updated[emptyIndex] = {
        ...updated[emptyIndex],
        text: template.text,
        category: template.category,
        timeSlot: template.slot,
      };
      onChange({ ...data, priorities: updated });
    } else if (data.priorities.length < 5) {
      const newItem: PriorityItem = {
        id: Date.now().toString(),
        text: template.text,
        timeSlot: template.slot,
        category: template.category,
        completed: false,
      };
      onChange({ ...data, priorities: [...data.priorities, newItem] });
    }
  };

  return (
    <section
      id="section-organize"
      className={`bg-[#fcfbfa] dark:bg-[#18221d] border rounded-xl p-5 mb-5 shadow-2xs transition-all ${
        earned
          ? 'border-[#376d75]/60 dark:border-[#6db5c0]/50 ring-1 ring-[#376d75]/15'
          : 'border-[#e4e1d6] dark:border-[#28362e]'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#376d75]/10 dark:bg-[#6db5c0]/15 text-[#29565d] dark:text-[#7fc4cf] border border-[#376d75]/25 flex items-center justify-center font-mono font-bold text-sm shrink-0">
            O
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                Organize the Day (Top 3 Priorities)
              </h2>
              {earned ? (
                <span className="text-xs font-semibold text-[#29565d] dark:text-[#7fc4cf] px-2 py-0.5 rounded-md bg-[#376d75]/10 border border-[#376d75]/25 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" /> 1/1 pt Earned
                </span>
              ) : (
                <span className="text-xs font-normal text-[#798b7f] dark:text-[#6e8275]">
                  Pending · 0/1 pt
                </span>
              )}
            </div>
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] mt-0.5">
              Lock in your 3 essential tasks and allocated time slots before stepping out of the hostel.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-xs font-medium px-2.5 py-1 text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-[#edf0ec] bg-[#f5f3ec] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#233229] rounded-lg transition-colors flex items-center gap-1 border border-[#dedad0] dark:border-[#2b3a31]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#376d75] dark:text-[#6db5c0]" />
            <span>Templates</span>
            {showTemplates ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {data.priorities.length < 5 && (
            <button
              type="button"
              onClick={addPriority}
              className="text-xs font-medium px-2 py-1 text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-white bg-[#f5f3ec] dark:bg-[#1c2720] hover:bg-[#eae6db] dark:hover:bg-[#233229] rounded-lg transition-colors flex items-center gap-1 border border-[#dedad0] dark:border-[#2b3a31]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Task Templates Drawer */}
      {showTemplates && (
        <div className="mt-3 p-3 bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#28382e] rounded-lg animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#376d75] dark:text-[#6db5c0]" />
            <span>Quick Hostel Task Presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_TEMPLATES.map((tpl, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="text-left text-xs px-2.5 py-1 rounded-md bg-[#fcfbfa] dark:bg-[#18221d] border border-[#dedad0] dark:border-[#2c3d33] hover:border-[#376d75]/50 text-[#344339] dark:text-[#d3ded7] flex items-center gap-1.5 transition-all"
              >
                <span className="font-mono text-[#376d75] dark:text-[#6db5c0] text-[10px]">[{tpl.category}]</span>
                <span>{tpl.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Task Completion Mini Banner */}
      {activeCount > 0 && (
        <div className="mt-3 flex items-center justify-between text-xs text-[#526357] dark:text-[#9bb0a2] bg-[#f5f3ec] dark:bg-[#1c2720] px-3 py-1.5 rounded-lg border border-[#e4e1d6] dark:border-[#28362e]">
          <span>Priority Tasks Completion:</span>
          <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
            {completedCount} of {activeCount} tasks completed ({Math.round((completedCount / activeCount) * 100)}%)
          </span>
        </div>
      )}

      {/* Priorities List */}
      <div className="mt-4 space-y-2.5">
        {data.priorities.map((item, index) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border transition-all ${
              item.completed
                ? 'bg-[#f5f3ec]/60 dark:bg-[#1c2720]/60 border-[#e8e5dc] dark:border-[#26352c]'
                : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#e8e5dc] dark:border-[#26352c] hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`chk-priority-${item.id}`}
                  checked={item.completed}
                  onChange={(e) => updatePriority(item.id, { completed: e.target.checked })}
                  className="w-4 h-4 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
                  title="Mark task completed"
                />
                <span className="text-xs font-mono font-medium text-[#798b7f] dark:text-[#6e8275] w-5">
                  #{index + 1}
                </span>
              </div>

              {/* Task Title */}
              <input
                type="text"
                value={item.text}
                onChange={(e) => updatePriority(item.id, { text: e.target.value })}
                placeholder={`Priority ${index + 1} (e.g. 1 hour LeetCode Tree problems, Capstone report)`}
                className={`flex-1 text-xs px-2.5 py-1.5 rounded-md border border-[#dedad0] dark:border-[#2b3a31] bg-[#f7f6f0] dark:bg-[#1e2a22] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:border-[#376d75] dark:focus:border-[#6db5c0] ${
                  item.completed ? 'line-through text-[#798b7f] dark:text-[#6e8275]' : ''
                }`}
              />

              {/* Time Slot & Category */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="flex items-center gap-1 text-xs text-[#344339] dark:text-[#d3ded7] bg-[#efece4] dark:bg-[#202d25] px-2 py-1 rounded border border-[#dedad0] dark:border-[#2c3d33]">
                  <Clock className="w-3 h-3 text-[#5f7467] dark:text-[#8fa395]" />
                  <input
                    type="text"
                    value={item.timeSlot}
                    onChange={(e) => updatePriority(item.id, { timeSlot: e.target.value })}
                    placeholder="Time slot"
                    className="w-36 text-xs focus:outline-hidden bg-transparent text-[#1b2620] dark:text-[#edf0ec]"
                  />
                </div>

                <select
                  value={item.category}
                  onChange={(e) => updatePriority(item.id, { category: e.target.value as PriorityCategory })}
                  aria-label="Task category"
                  className="text-xs px-2 py-1 rounded border border-[#dedad0] dark:border-[#2c3d33] bg-[#efece4] dark:bg-[#202d25] text-[#1b2620] dark:text-[#edf0ec] focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-[#fcfbfa] dark:bg-[#18221d] text-[#1b2620] dark:text-[#edf0ec]">
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => removePriority(item.id)}
                  aria-label="Remove priority task"
                  className="text-[#798b7f] dark:text-[#6e8275] hover:text-[#c06541] dark:hover:text-[#e88d6a] p-1 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource preparation checklist */}
      <div className="mt-4 pt-3 border-t border-[#e5e1d7] dark:border-[#28382e]">
        <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-[#f7f5ee] dark:hover:bg-[#1c2720] cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-resources-prepared"
            checked={data.resourcesPrepared}
            onChange={(e) => onChange({ ...data, resourcesPrepared: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-[#c5c1b4] dark:border-[#3d5044] accent-[#2d5641] dark:accent-[#7fc09d]"
          />
          <div className="text-xs">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              Prepare necessary resources before college
            </span>
            <p className="text-[#526357] dark:text-[#9bb0a2] text-[11px] mt-0.5">
              Laptop charged, notes, PDFs, or code repo synced so you never lose time troubleshooting in the evening.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
};
