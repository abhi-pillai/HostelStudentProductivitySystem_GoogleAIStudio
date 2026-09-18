import React from 'react';
import { OrganizeData, PriorityItem, PriorityCategory } from '../types';
import { Check, Plus, Trash2, Clock, Tag } from 'lucide-react';

interface OrganizeSectionProps {
  data: OrganizeData;
  onChange: (data: OrganizeData) => void;
  earned: boolean;
}

const CATEGORIES: PriorityCategory[] = ['Coding', 'Project', 'GATE', 'Placement', 'Academics', 'Other'];

export const OrganizeSection: React.FC<OrganizeSectionProps> = ({ data, onChange, earned }) => {
  const updatePriority = (id: string, updates: Partial<PriorityItem>) => {
    const updated = data.priorities.map((p) => (p.id === id ? { ...p, ...updates } : p));
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
      // Clear instead of removing if at or below 3 to keep 3 structure
      const updated = data.priorities.map((p) =>
        p.id === id ? { ...p, text: '', completed: false } : p
      );
      onChange({ ...data, priorities: updated });
      return;
    }
    onChange({ ...data, priorities: data.priorities.filter((p) => p.id !== id) });
  };

  return (
    <section
      id="section-organize"
      className={`bg-white dark:bg-stone-900 border rounded-xl p-5 mb-5 transition-all ${
        earned 
          ? 'border-emerald-200 dark:border-emerald-850 shadow-2xs' 
          : 'border-stone-200 dark:border-stone-800 shadow-2xs'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-base border border-blue-500/20 dark:border-blue-500/30 shrink-0">
            O
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Organize the Day (Top 3 Priorities)
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
              Lock in your 3 essential tasks and allocated time slots before stepping out of the hostel.
            </p>
          </div>
        </div>

        {data.priorities.length < 5 && (
          <button
            type="button"
            onClick={addPriority}
            className="text-xs font-semibold px-2 py-1 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-md transition-colors flex items-center gap-1 shrink-0 border border-stone-200/60 dark:border-stone-700/60"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slot</span>
          </button>
        )}
      </div>

      {/* Priorities List */}
      <div className="mt-4 space-y-3">
        {data.priorities.map((item, index) => (
          <div
            key={item.id}
            className={`p-3 rounded-lg border transition-all ${
              item.completed
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-stone-50/40 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-700/60 hover:bg-stone-50 dark:hover:bg-stone-800/60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`chk-priority-${item.id}`}
                  checked={item.completed}
                  onChange={(e) => updatePriority(item.id, { completed: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded border-stone-300 dark:border-stone-600 focus:ring-emerald-500 accent-emerald-600"
                  title="Mark task completed"
                />
                <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400 w-5">
                  #{index + 1}
                </span>
              </div>

              {/* Task Title */}
              <input
                type="text"
                value={item.text}
                onChange={(e) => updatePriority(item.id, { text: e.target.value })}
                placeholder={`Priority ${index + 1} (e.g. 1 hour LeetCode Tree problems, Capstone report)`}
                className={`flex-1 text-xs px-2.5 py-1.5 rounded-md border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/90 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 ${
                  item.completed ? 'line-through text-stone-400 dark:text-stone-500' : ''
                }`}
              />

              {/* Time Slot & Category */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-800 px-2 py-1 rounded border border-stone-200 dark:border-stone-700">
                  <Clock className="w-3 h-3 text-stone-400 dark:text-stone-500" />
                  <input
                    type="text"
                    value={item.timeSlot}
                    onChange={(e) => updatePriority(item.id, { timeSlot: e.target.value })}
                    placeholder="Time slot"
                    className="w-36 text-[11px] focus:outline-hidden bg-transparent text-stone-800 dark:text-stone-200"
                  />
                </div>

                <select
                  value={item.category}
                  onChange={(e) => updatePriority(item.id, { category: e.target.value as PriorityCategory })}
                  aria-label="Task category"
                  className="text-[11px] px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 focus:outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => removePriority(item.id)}
                  aria-label="Remove priority task"
                  className="text-stone-400 dark:text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resource preparation checklist */}
      <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800">
        <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition-colors">
          <input
            type="checkbox"
            id="chk-resources-prepared"
            checked={data.resourcesPrepared}
            onChange={(e) => onChange({ ...data, resourcesPrepared: e.target.checked })}
            className="w-4 h-4 mt-0.5 text-blue-600 rounded border-stone-300 dark:border-stone-600 focus:ring-blue-500 accent-blue-600"
          />
          <div className="text-xs">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Prepare necessary resources before college
            </span>
            <p className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Laptop charged, notes, PDFs, or code repo synced so you never lose time troubleshooting in the evening.
            </p>
          </div>
        </label>
      </div>
    </section>
  );
};
