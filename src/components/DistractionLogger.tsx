import React, { useState, useMemo } from 'react';
import { DailyRecord } from '../types';
import {
  AlertCircle,
  Users,
  Volume2,
  Smartphone,
  Gamepad2,
  Utensils,
  BedDouble,
  Coffee,
  HelpCircle,
  Plus,
  X,
  TrendingUp,
  BarChart2,
  Check,
} from 'lucide-react';

export interface DistractionOption {
  id: string;
  label: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const COMMON_DISTRACTIONS: DistractionOption[] = [
  { id: 'Roommates', label: 'Roommates', category: 'Social', icon: Users },
  { id: 'Noise', label: 'Noise / Corridor', category: 'Environment', icon: Volume2 },
  { id: 'Phone', label: 'Phone / Social Media', category: 'Digital', icon: Smartphone },
  { id: 'Gaming', label: 'Gaming / Streamers', category: 'Digital', icon: Gamepad2 },
  { id: 'Late Snacks', label: 'Late Snacks / Canteen', category: 'Routine', icon: Utensils },
  { id: 'Bed Fatigue', label: 'Studying on Bed / Sloth', category: 'Discipline', icon: BedDouble },
  { id: 'Hostel Gossip', label: 'Chai / Corridor Talks', category: 'Social', icon: Coffee },
];

interface DistractionLoggerProps {
  selectedDistractions: string[];
  onChange: (distractions: string[]) => void;
  allRecords?: Record<string, DailyRecord>;
}

export const DistractionLogger: React.FC<DistractionLoggerProps> = ({
  selectedDistractions = [],
  onChange,
  allRecords = {},
}) => {
  const [customInput, setCustomInput] = useState('');
  const [showPatterns, setShowPatterns] = useState(false);

  const toggleDistraction = (id: string) => {
    if (selectedDistractions.includes(id)) {
      onChange(selectedDistractions.filter((item) => item !== id));
    } else {
      onChange([...selectedDistractions, id]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedDistractions.includes(trimmed)) {
      onChange([...selectedDistractions, trimmed]);
    }
    setCustomInput('');
  };

  const removeDistraction = (id: string) => {
    onChange(selectedDistractions.filter((item) => item !== id));
  };

  // Calculate pattern frequencies across all records
  const patternStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalLogs = 0;

    Object.values(allRecords).forEach((rec) => {
      if (Array.isArray(rec.distractions) && rec.distractions.length > 0) {
        totalLogs++;
        rec.distractions.forEach((d) => {
          counts[d] = (counts[d] || 0) + 1;
        });
      }
    });

    const sorted = Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { sorted, totalLogs };
  }, [allRecords]);

  // Check if current selection has custom tags not in COMMON_DISTRACTIONS
  const customSelectedTags = selectedDistractions.filter(
    (id) => !COMMON_DISTRACTIONS.some((c) => c.id === id)
  );

  return (
    <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800" id="distraction-logger">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Distraction Logger</span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 font-normal ml-1">
            (Select what triggered loss of focus)
          </span>
        </div>

        {/* Pattern Analytics Toggle */}
        <button
          type="button"
          id="btn-toggle-patterns"
          onClick={() => setShowPatterns(!showPatterns)}
          className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors ${
            showPatterns
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          <TrendingUp className="w-3 h-3" />
          <span>{showPatterns ? 'Hide Patterns' : 'Pattern Insights'}</span>
        </button>
      </div>

      {/* Quick Distraction Chips Grid */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {COMMON_DISTRACTIONS.map((item) => {
          const isSelected = selectedDistractions.includes(item.id);
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              id={`distraction-chip-${item.id.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => toggleDistraction(item.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 border-amber-500 font-semibold shadow-2xs'
                  : 'bg-stone-50 dark:bg-stone-800/80 border-stone-200 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-stone-950' : 'text-stone-400 dark:text-stone-400'}`} />
              <span>{item.label}</span>
              {isSelected && <Check className="w-3 h-3 text-stone-950 stroke-[2.5]" />}
            </button>
          );
        })}
      </div>

      {/* Custom Tag Inputs & Custom Active Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {customSelectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/20 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-400/40 dark:border-amber-700/60"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeDistraction(tag)}
              className="text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-white p-0.5 rounded"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        <form onSubmit={handleAddCustom} className="flex items-center gap-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="+ Add specific trigger..."
            className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-stone-300 dark:border-stone-700 bg-transparent text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-amber-500 w-44"
          />
          {customInput.trim() && (
            <button
              type="submit"
              className="p-1 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Pattern Tracking Panel */}
      {showPatterns && (
        <div
          className="mt-3 p-3.5 bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 rounded-xl animate-in fade-in"
          id="distraction-patterns-panel"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
              <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Hostel Distraction Patterns (All Time)</span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              {patternStats.totalLogs} days with tracked triggers
            </span>
          </div>

          {patternStats.sorted.length === 0 ? (
            <p className="text-xs text-stone-500 dark:text-stone-400 py-2">
              No distractions logged yet across your history. As you tag triggers, frequent hostel culprits will appear here to help you adjust your environment.
            </p>
          ) : (
            <div className="space-y-2 mt-2">
              {patternStats.sorted.slice(0, 5).map((item, idx) => (
                <div key={item.name} className="text-xs">
                  <div className="flex items-center justify-between text-stone-700 dark:text-stone-300 mb-0.5">
                    <span className="font-semibold flex items-center gap-1">
                      <span className="text-[10px] text-stone-400 font-mono">#{idx + 1}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                      {item.count} {item.count === 1 ? 'day' : 'days'} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Hostel Action Tip */}
          <div className="mt-3 pt-2.5 border-t border-stone-200 dark:border-stone-750 text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-1.5">
            <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">Hostel Pro-Tip:</span>
            <span>
              If "Roommates" or "Noise" tops your chart, schedule deep Targeted Work at the library or use noise-dampening earphones with a study timer.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
