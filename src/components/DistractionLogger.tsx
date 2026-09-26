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
    <div className="mt-4 pt-4 border-t border-[#e4e1d6] dark:border-[#28362e]" id="distraction-logger">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#344339] dark:text-[#d3ded7]">
          <AlertCircle className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d] shrink-0" />
          <span>Distraction Logger</span>
          <span className="text-xs text-[#798b7f] dark:text-[#6e8275] font-normal ml-1">
            (Identify focus leaks)
          </span>
        </div>

        {/* Pattern Analytics Toggle */}
        <button
          type="button"
          id="btn-toggle-patterns"
          onClick={() => setShowPatterns(!showPatterns)}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border ${
            showPatterns
              ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] border-[#2d5641] dark:border-[#7fc09d]'
              : 'border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720] text-[#344339] dark:text-[#d3ded7] hover:text-[#1b2620] dark:hover:text-[#edf0ec] hover:bg-[#eae6db] dark:hover:bg-[#233229]'
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
                  ? 'bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15] border-[#2d5641] dark:border-[#7fc09d] font-medium shadow-2xs'
                  : 'bg-[#fcfbfa] dark:bg-[#18221d] border-[#dedad0] dark:border-[#2b3a31] text-[#344339] dark:text-[#d3ded7] hover:bg-[#edeae0] dark:hover:bg-[#223128]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white dark:text-[#0f1d15]' : 'text-[#798b7f] dark:text-[#6e8275]'}`} />
              <span>{item.label}</span>
              {isSelected && <Check className="w-3 h-3 text-white dark:text-[#0f1d15] stroke-[2.5]" />}
            </button>
          );
        })}
      </div>

      {/* Custom Tag Inputs & Custom Active Chips */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {customSelectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#2d5641] text-white dark:bg-[#7fc09d] dark:text-[#0f1d15]"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => removeDistraction(tag)}
              className="text-[#a8d3bc] dark:text-[#234533] hover:text-white dark:hover:text-black p-0.5 rounded"
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
            className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-[#c5c1b4] dark:border-[#3d5044] bg-transparent text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:border-[#2d5641] dark:focus:border-[#7fc09d] w-44"
          />
          {customInput.trim() && (
            <button
              type="submit"
              className="p-1 rounded-lg bg-[#2d5641] dark:bg-[#7fc09d] text-white dark:text-[#0f1d15] text-xs font-semibold hover:opacity-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Pattern Tracking Panel */}
      {showPatterns && (
        <div
          className="mt-3 p-3.5 bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] rounded-xl animate-in fade-in"
          id="distraction-patterns-panel"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec]">
              <BarChart2 className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
              <span>Hostel Distraction Patterns (All Time)</span>
            </div>
            <span className="text-xs text-[#526357] dark:text-[#9bb0a2]">
              {patternStats.totalLogs} days with tracked triggers
            </span>
          </div>

          {patternStats.sorted.length === 0 ? (
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2] py-2">
              No distractions logged yet across your history. As you tag triggers, frequent hostel culprits will appear here to help you adjust your environment.
            </p>
          ) : (
            <div className="space-y-2 mt-2">
              {patternStats.sorted.slice(0, 5).map((item, idx) => (
                <div key={item.name} className="text-xs">
                  <div className="flex items-center justify-between text-[#344339] dark:text-[#d3ded7] mb-0.5">
                    <span className="font-medium flex items-center gap-1">
                      <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275] font-mono">#{idx + 1}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="text-xs text-[#526357] dark:text-[#9bb0a2]">
                      {item.count} {item.count === 1 ? 'day' : 'days'} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#eae7dd] dark:bg-[#223027] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#2d5641] dark:bg-[#7fc09d] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(item.percentage, 8)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Hostel Action Tip */}
          <div className="mt-3 pt-2.5 border-t border-[#dedad0] dark:border-[#2c3d33] text-xs text-[#526357] dark:text-[#9bb0a2] flex items-start gap-1.5">
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec] shrink-0">Hostel Pro-Tip:</span>
            <span>
              If "Roommates" or "Noise" tops your chart, schedule deep Targeted Work at the library or use noise-dampening earphones with a study timer.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
