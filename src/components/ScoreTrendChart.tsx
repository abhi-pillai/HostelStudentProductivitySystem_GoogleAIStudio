import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { DailyRecord } from '../types';
import { calculateScore } from '../utils/storage';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface ScoreTrendChartProps {
  records: Record<string, DailyRecord>;
  onSelectDate?: (date: string) => void;
}

interface DayTrendData {
  date: string;
  displayDay: string;
  fullDate: string;
  score: number;
  verdict: string;
  hasRecord: boolean;
  verdictColor: string;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  records,
  onSelectDate,
}) => {
  // Generate past 7 consecutive days ending today
  const trendData: DayTrendData[] = React.useMemo(() => {
    const list: DayTrendData[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateKey = `${yyyy}-${mm}-${dd}`;

      const rec = records[dateKey];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
      const displayDay = `${weekday} ${dayNum}`;

      if (rec) {
        const scoreBreakdown = calculateScore(rec);
        list.push({
          date: dateKey,
          displayDay,
          fullDate: d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          score: scoreBreakdown.totalScore,
          verdict: scoreBreakdown.verdict,
          verdictColor: scoreBreakdown.verdictColor,
          hasRecord: true,
        });
      } else {
        list.push({
          date: dateKey,
          displayDay,
          fullDate: d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          }),
          score: 0,
          verdict: 'Not Tracked',
          verdictColor: 'text-stone-400',
          hasRecord: false,
        });
      }
    }
    return list;
  }, [records]);

  // Compute 7-day average score for active days
  const activeDays = trendData.filter((d) => d.hasRecord);
  const averageScore =
    activeDays.length > 0
      ? (activeDays.reduce((acc, curr) => acc + curr.score, 0) / activeDays.length).toFixed(1)
      : '0.0';

  const highestScore = Math.max(...trendData.map((d) => d.score), 0);

  // Custom bar colors based on hostel scorecard standards
  const getBarColor = (score: number, hasRecord: boolean) => {
    if (!hasRecord) return '#e7e5e4'; // stone-200
    if (score >= 6) return '#10b981'; // emerald-500: Excellent
    if (score >= 5) return '#14b8a6'; // teal-500: Strong
    if (score >= 4) return '#f59e0b'; // amber-500: Acceptable
    return '#f43f5e'; // rose-500: Weak/Reset
  };

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayTrendData = payload[0].payload;
      return (
        <div className="bg-stone-900/95 text-white p-2.5 rounded-xl shadow-xl border border-stone-700 text-xs backdrop-blur-xs min-w-[140px]">
          <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-1 mb-1.5">
            <span className="font-semibold text-stone-300">{data.fullDate}</span>
            <span className="text-[10px] text-stone-400 font-mono">
              {data.hasRecord ? 'Recorded' : 'Unrecorded'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-amber-400">{data.score}</span>
            <span className="text-xs text-stone-400">/ 6 pts</span>
            <span className="ml-auto font-bold text-[11px] text-stone-200">{data.verdict}</span>
          </div>
          <div className="mt-1.5 text-[10px] text-stone-400 flex items-center justify-between">
            <span>H.O.S.T.E.L. Loop</span>
            <span className="font-semibold text-amber-400">
              {Math.round((data.score / 6) * 100)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="mt-4 p-4 rounded-xl bg-stone-50/70 dark:bg-stone-850/60 border border-stone-200 dark:border-stone-800"
      id="score-trend-chart-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              7-Day Execution Score Trend
            </h4>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              Daily H.O.S.T.E.L. total score out of 6 points
            </p>
          </div>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px] flex items-center gap-1.5 font-medium shadow-2xs">
            <span className="text-stone-400">7-Day Avg:</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">
              {averageScore} / 6
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-[11px] flex items-center gap-1.5 font-medium shadow-2xs">
            <Award className="w-3 h-3 text-emerald-500" />
            <span className="text-stone-400">Peak:</span>
            <span className="font-extrabold text-stone-900 dark:text-stone-100">
              {highestScore}/6
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={trendData}
            margin={{ top: 12, right: 8, left: -22, bottom: 0 }}
            onClick={(state: any) => {
              if (state && state.activePayload && state.activePayload.length && onSelectDate) {
                const clickedDate = state.activePayload[0].payload.date;
                onSelectDate(clickedDate);
              }
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#78716c"
              opacity={0.15}
            />
            <XAxis
              dataKey="displayDay"
              tickLine={false}
              axisLine={{ stroke: '#78716c', opacity: 0.2 }}
              tick={{ fontSize: 11, fill: '#a8a29e' }}
            />
            <YAxis
              domain={[0, 6]}
              ticks={[0, 2, 4, 6]}
              tickLine={false}
              axisLine={{ stroke: '#78716c', opacity: 0.2 }}
              tick={{ fontSize: 11, fill: '#a8a29e' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }} />
            <ReferenceLine
              y={4}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{
                value: 'Acceptable (4)',
                position: 'insideTopRight',
                fill: '#d97706',
                fontSize: 9,
                fontWeight: 600,
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 2, 2]} maxBarSize={38} className="cursor-pointer">
              {trendData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.score, entry.hasRecord)}
                  opacity={entry.hasRecord ? 1 : 0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend and Navigation Cue */}
      <div className="mt-2 pt-2.5 border-t border-stone-200/70 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span>6: Excellent</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-teal-500 inline-block" />
            <span>5: Strong</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
            <span>4: Acceptable</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            <span>0-3: Weak</span>
          </span>
        </div>

        <span className="text-[10px] text-stone-400 italic">
          Click any bar to jump to that day
        </span>
      </div>
    </div>
  );
};
