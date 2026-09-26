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
import { TrendingUp, Award } from 'lucide-react';

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
          verdictColor: 'text-[#798b7f]',
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

  // Bar colors with nature tones
  const getBarColor = (score: number, hasRecord: boolean) => {
    if (!hasRecord) return '#dedad0'; // unrecorded lichen beige
    if (score >= 6) return '#deb16d'; // warm golden ochre
    if (score >= 5) return '#2d5641'; // forest pine
    if (score >= 4) return '#4e8568'; // moss sage
    return '#c06541'; // terracotta amber
  };

  // Custom Tooltip component for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DayTrendData = payload[0].payload;
      return (
        <div className="bg-[#151d18]/95 text-[#edf0ec] p-2.5 rounded-xl shadow-xl border border-[#28362e] text-xs backdrop-blur-xs min-w-[140px]">
          <div className="flex items-center justify-between gap-2 border-b border-[#28362e] pb-1 mb-1.5">
            <span className="font-semibold text-[#edf0ec]">{data.fullDate}</span>
            <span className="text-[10px] text-[#7fc09d] font-mono">
              {data.hasRecord ? 'Recorded' : 'Unrecorded'}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white font-mono">{data.score}</span>
            <span className="text-xs text-[#9cb0a2]">/ 6 pts</span>
            <span className="ml-auto font-medium text-[11px] text-[#deb16d]">{data.verdict}</span>
          </div>
          <div className="mt-1.5 text-[10px] text-[#9cb0a2] flex items-center justify-between">
            <span>H.O.S.T.E.L. Loop</span>
            <span className="font-semibold text-white">
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
      className="mt-4 p-4 rounded-xl bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33]"
      id="score-trend-chart-card"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2d5641]/10 text-[#244b36] dark:bg-[#7fc09d]/15 dark:text-[#88d2af] flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] uppercase tracking-wider">
              7-Day Execution Score Trend
            </h4>
            <p className="text-[11px] text-[#526357] dark:text-[#9bb0a2]">
              Daily H.O.S.T.E.L. total score out of 6 points
            </p>
          </div>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-2.5 py-1 rounded-lg bg-[#fcfbfa] dark:bg-[#18221d] border border-[#dedad0] dark:border-[#2b3a31] text-[#344339] dark:text-[#d3ded7] text-[11px] flex items-center gap-1.5 font-medium shadow-2xs">
            <span className="text-[#798b7f] dark:text-[#6e8275]">7-Day Avg:</span>
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec] font-mono">
              {averageScore} / 6
            </span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[#fcfbfa] dark:bg-[#18221d] border border-[#dedad0] dark:border-[#2b3a31] text-[#344339] dark:text-[#d3ded7] text-[11px] flex items-center gap-1.5 font-medium shadow-2xs">
            <Award className="w-3 h-3 text-[#deb16d]" />
            <span className="text-[#798b7f] dark:text-[#6e8275]">Peak:</span>
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec] font-mono">
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
              stroke="#526357"
              opacity={0.15}
            />
            <XAxis
              dataKey="displayDay"
              tickLine={false}
              axisLine={{ stroke: '#526357', opacity: 0.25 }}
              tick={{ fontSize: 11, fill: '#798b7f' }}
            />
            <YAxis
              domain={[0, 6]}
              ticks={[0, 2, 4, 6]}
              tickLine={false}
              axisLine={{ stroke: '#526357', opacity: 0.25 }}
              tick={{ fontSize: 11, fill: '#798b7f' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(45, 86, 65, 0.08)' }} />
            <ReferenceLine
              y={4}
              stroke="#2d5641"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
              label={{
                value: 'Pass Target (4)',
                position: 'insideTopRight',
                fill: '#2d5641',
                fontSize: 9,
                fontWeight: 600,
              }}
            />
            <Bar dataKey="score" radius={[4, 4, 1, 1]} maxBarSize={38} className="cursor-pointer">
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
      <div className="mt-2 pt-2.5 border-t border-[#dedad0] dark:border-[#28382e] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#526357] dark:text-[#9bb0a2]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#deb16d] inline-block" />
            <span>6: Perfect</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#2d5641] dark:bg-[#7fc09d] inline-block" />
            <span>5: Strong</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#4e8568] inline-block" />
            <span>4: Acceptable</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#c06541] inline-block" />
            <span>0-3: Below</span>
          </span>
        </div>

        <span className="text-[10px] text-[#798b7f] dark:text-[#6e8275]">
          Click any bar to jump to that day
        </span>
      </div>
    </div>
  );
};
