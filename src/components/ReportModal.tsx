import React, { useState, useMemo } from 'react';
import {
  X,
  FileDown,
  Printer,
  Calendar,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Coffee,
  Moon,
  Smartphone,
  BookOpen,
  Laptop,
  Tv,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ListChecks,
  AlertCircle,
  FileText,
  Target,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import { DailyRecord } from '../types';
import { useAuth } from '../contexts/AuthContext';
import {
  generateReportAnalysis,
  ReportTimeframe,
  DetailedReportAnalysis,
  PillarStat,
  ImprovementRecommendation,
} from '../utils/reportAnalysis';
import { exportReportToPDF } from '../utils/pdfExport';
import { formatDateDisplay } from '../utils/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: Record<string, DailyRecord>;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, records }) => {
  const { currentUser, isDevBypass } = useAuth();
  const [timeframe, setTimeframe] = useState<ReportTimeframe>('last7');
  const [activeTab, setActiveTab] = useState<'analysis' | 'improvements' | 'preview'>('analysis');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Generate analysis
  const analysis: DetailedReportAnalysis = useMemo(() => {
    return generateReportAnalysis(records, timeframe);
  }, [records, timeframe]);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    try {
      const studentLabel = currentUser?.displayName || 'Hostel_Scholar';
      const cleanStudentName = studentLabel.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Hostel_Productivity_Report_${cleanStudentName}_${timeframe}_${analysis.endDate}.pdf`;
      const success = await exportReportToPDF('printable-report-content', {
        filename,
        studentName: currentUser?.displayName || currentUser?.email || 'Hostel Student',
        reportTitle: 'Hostel Student Productivity & Improvement Report',
      });
      if (success) {
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3500);
      }
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const timeframeLabels: Record<ReportTimeframe, string> = {
    last7: 'Last 7 Days',
    last14: 'Last 14 Days',
    last30: 'Last 30 Days',
    all: 'All History',
  };

  const studentName = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'Hostel Scholar');
  const studentEmail = currentUser?.email || (isDevBypass ? 'dev.tester@hostelloop.test' : 'guest.student@hostelloop.test');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 bg-stone-50 dark:bg-stone-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Productivity Analysis & Improvement Report</span>
                <span className="text-[11px] font-normal text-stone-500 dark:text-stone-400">
                  · {formatDateDisplay(analysis.startDate)} – {formatDateDisplay(analysis.endDate)}
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Detailed diagnostic audit of your H.O.S.T.E.L execution with actionable remediation plans.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Download PDF Button */}
            <button
              type="button"
              id="btn-download-report-pdf"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
              title="Download analysis and improvement report as a crisp PDF document"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-stone-200 dark:border-stone-700"
              title="Print report or save via system printer dialog"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close report modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Sub-Nav Toolbar */}
        <div className="px-5 py-2.5 bg-stone-100/60 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Timeframe Tabs */}
          <div className="flex items-center gap-1 bg-stone-200/70 dark:bg-stone-850 p-1 rounded-xl">
            {(['last7', 'last14', 'last30', 'all'] as ReportTimeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                {timeframeLabels[tf]}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('analysis')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'analysis'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Diagnostic Analysis</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('improvements')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'improvements'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Ways to Improve ({analysis.recommendations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-800'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Print/PDF Preview</span>
            </button>
          </div>
        </div>

        {/* Success toast after export */}
        {exportSuccess && (
          <div className="mx-5 mt-3 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>PDF report downloaded successfully! Check your browser downloads folder.</span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* TAB 1: DIAGNOSTIC ANALYSIS */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-2xl p-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  
                  {/* Grade & Score */}
                  <div className="md:col-span-2 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-sm flex flex-col items-center justify-center shrink-0">
                      <span className={`text-3xl font-black ${analysis.productivityGrade.color}`}>
                        {analysis.productivityGrade.grade}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                        Grade
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-stone-900 dark:text-stone-100">
                          {analysis.averageScore}
                        </span>
                        <span className="text-sm font-bold text-stone-400">/ 6.0</span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          · {analysis.productivityGrade.description}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                        Evaluated across <strong className="text-stone-800 dark:text-stone-200">{analysis.daysLoggedCount}</strong> logged days in this {timeframeLabels[timeframe].toLowerCase()} period ({analysis.completionRate}% tracking continuity).
                      </p>
                    </div>
                  </div>

                  {/* Deep Work Hours */}
                  <div className="p-3.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Deep Focus Time</span>
                    </div>
                    <div className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {analysis.studyTimeMetrics.totalDeepWorkHours} hrs
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      ~{analysis.studyTimeMetrics.avgDailyCodingMinutes}m/day coding avg
                    </div>
                  </div>

                  {/* Sleep & Boundary Integrity */}
                  <div className="p-3.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-750 rounded-xl">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-semibold mb-1">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Boundary Adherence</span>
                    </div>
                    <div className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      {analysis.entertainmentMetrics.complianceRate}%
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      {analysis.sleepHygieneMetrics.bedOnlyForSleepRate}% bed-only-for-sleep
                    </div>
                  </div>
                </div>

                {/* Score Distribution Bar */}
                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mb-2">
                    <span className="font-semibold">Score Execution Distribution</span>
                    <span>
                      {analysis.scoreDistribution.perfect6} perfect (6/6) · {analysis.scoreDistribution.strong5} strong (5/6) · {analysis.scoreDistribution.acceptable4} pass (4/6) · {analysis.scoreDistribution.subparUnder4} off-days
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden flex">
                    {analysis.daysLoggedCount > 0 ? (
                      <>
                        <div
                          style={{ width: `${(analysis.scoreDistribution.perfect6 / analysis.daysLoggedCount) * 100}%` }}
                          className="bg-emerald-500 transition-all"
                          title="6/6 Perfect Days"
                        />
                        <div
                          style={{ width: `${(analysis.scoreDistribution.strong5 / analysis.daysLoggedCount) * 100}%` }}
                          className="bg-teal-500 transition-all"
                          title="5/6 Strong Days"
                        />
                        <div
                          style={{ width: `${(analysis.scoreDistribution.acceptable4 / analysis.daysLoggedCount) * 100}%` }}
                          className="bg-amber-500 transition-all"
                          title="4/6 Acceptable Days"
                        />
                        <div
                          style={{ width: `${(analysis.scoreDistribution.subparUnder4 / analysis.daysLoggedCount) * 100}%` }}
                          className="bg-rose-500 transition-all"
                          title="<4 Below Target"
                        />
                      </>
                    ) : (
                      <div className="w-full bg-stone-300 dark:bg-stone-700" />
                    )}
                  </div>
                </div>
              </div>

              {/* 6 H.O.S.T.E.L. Pillars Audit Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-amber-500" />
                  <span>The 6 H.O.S.T.E.L. Pillars Performance Breakdown</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {analysis.pillarStats.map((pillar) => {
                    const statusColor =
                      pillar.status === 'Mastered'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : pillar.status === 'Solid'
                        ? 'text-teal-700 dark:text-teal-400'
                        : pillar.status === 'Inconsistent'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-rose-700 dark:text-rose-400';

                    const barColor =
                      pillar.successRate >= 80
                        ? 'bg-emerald-500'
                        : pillar.successRate >= 65
                        ? 'bg-teal-500'
                        : pillar.successRate >= 45
                        ? 'bg-amber-500'
                        : 'bg-rose-500';

                    return (
                      <div
                        key={pillar.letter}
                        className="p-4 rounded-xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-all shadow-2xs"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold text-xs flex items-center justify-center">
                              {pillar.letter}
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                {pillar.title}
                              </h4>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                                {pillar.subtitle}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold ${statusColor}`}>
                            {pillar.successRate}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden my-2.5">
                          <div
                            className={`h-full rounded-full ${barColor} transition-all duration-300`}
                            style={{ width: `${pillar.successRate}%` }}
                          />
                        </div>

                        {/* Submetrics list */}
                        <div className="space-y-1 pt-1 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                          {pillar.subMetrics.map((sub, idx) => (
                            <div key={idx} className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                              <span>{sub.label}</span>
                              <span className="font-semibold text-stone-900 dark:text-stone-200">
                                {sub.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Critical Bottlenecks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Key System Strengths</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                    {analysis.topStrengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottlenecks */}
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Point Leakage Bottlenecks</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-stone-700 dark:text-stone-300">
                    {analysis.criticalBottlenecks.map((bot, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                        <span>{bot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Distraction Frequency Audit */}
              {analysis.distractionSummary.length > 0 && (
                <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Logged Hostel Distraction Triggers</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {analysis.distractionSummary.map((d, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                      >
                        <div className="text-xs font-semibold text-stone-800 dark:text-stone-200 truncate">
                          {d.name}
                        </div>
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                          {d.count} occurrences ({d.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WAYS TO IMPROVE (ACTIONABLE BLUEPRINT) */}
          {activeTab === 'improvements' && (
            <div className="space-y-6">
              {/* Executive Action Blueprint Header */}
              <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Personalized Remediation Plan
                    </span>
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      Next Week Focus: Target Score {analysis.actionBlueprint.weeklyTargetScore} / 6.0
                    </h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shrink-0">
                    Target: {analysis.actionBlueprint.weeklyTargetScore}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Primary Pillar to Fix</span>
                    <p className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {analysis.actionBlueprint.primaryFocusPillar}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-500/20">
                    <span className="text-[10px] font-bold text-stone-400 uppercase">Secondary Reinforcement</span>
                    <p className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {analysis.actionBlueprint.secondaryFocusPillar}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable Recommendations List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-2">
                  <ListChecks className="w-4 h-4 text-amber-500" />
                  <span>Custom Action Protocols Based on Your Data</span>
                </h4>

                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div>
                          <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                            {rec.title}
                          </h5>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">
                            {rec.category} · Priority: <strong className="text-amber-600 dark:text-amber-400">{rec.severity}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shrink-0">
                        {rec.expectedImpact}
                      </div>
                    </div>

                    {/* Why it matters */}
                    <div className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-900 p-3 rounded-xl border border-stone-100 dark:border-stone-800 leading-relaxed">
                      <strong className="text-stone-800 dark:text-stone-200">The Problem: </strong>
                      {rec.whyItMatters}
                    </div>

                    {/* Action steps */}
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Hostel Implementation Steps:
                      </span>
                      <div className="space-y-1.5">
                        {rec.concreteSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                            <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Daily Checklist Routine */}
              <div className="p-4 rounded-xl bg-stone-900 text-stone-200 border border-stone-800">
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>The Non-Negotiable Hostel Daily Loop</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {analysis.actionBlueprint.dailyChecklistReminder.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-stone-800/80 border border-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRINT / PDF PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>
                  This preview reflects the exact high-fidelity format that will be exported to your downloadable PDF.
                </span>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <FileDown className="w-3 h-3" />
                  <span>Export Now</span>
                </button>
              </div>

              {/* The printable document view */}
              <div className="bg-stone-200 dark:bg-stone-950 p-4 rounded-xl flex justify-center overflow-x-auto">
                <div className="w-[794px] min-h-[1123px] bg-white text-stone-900 p-8 shadow-xl border border-stone-300 text-left font-sans text-xs">
                  {/* Clean PDF content rendered inline for preview */}
                  <ReportPrintDocument analysis={analysis} studentName={studentName} studentEmail={studentEmail} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Reports are generated locally from your verified daily logs.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* OFF-SCREEN HIGH-FIDELITY PRINTABLE REPORT CONTAINER (USED BY HTML2CANVAS & PRINT) */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" aria-hidden="true">
        <div
          id="printable-report-content"
          className="w-[800px] bg-white text-stone-900 p-8 font-sans"
          style={{ width: '800px', backgroundColor: '#ffffff', color: '#1c1917' }}
        >
          <ReportPrintDocument analysis={analysis} studentName={studentName} studentEmail={studentEmail} />
        </div>
      </div>
    </div>
  );
};

/**
 * Dedicated Printable Document Component
 * Strictly styled with crisp high-contrast black/amber/emerald for standard A4 PDF printing
 */
interface ReportPrintDocProps {
  analysis: DetailedReportAnalysis;
  studentName: string;
  studentEmail: string;
}

const ReportPrintDocument: React.FC<ReportPrintDocProps> = ({ analysis, studentName, studentEmail }) => {
  return (
    <div className="space-y-6 bg-white text-stone-900">
      {/* Document Header */}
      <div className="border-b-2 border-stone-900 pb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-stone-900 text-white font-black text-sm flex items-center justify-center">
              HL
            </div>
            <h1 className="text-lg font-black tracking-tight text-stone-900 uppercase">
              Hostel Student Productivity System
            </h1>
          </div>
          <p className="text-xs font-medium text-stone-600 mt-1">
            Official Performance Audit & Engineering Action Blueprint
          </p>
        </div>

        <div className="text-right text-[11px] text-stone-600 space-y-0.5">
          <div><strong className="text-stone-900">Student:</strong> {studentName}</div>
          <div><strong className="text-stone-900">Email:</strong> {studentEmail}</div>
          <div><strong className="text-stone-900">Period:</strong> {formatDateDisplay(analysis.startDate)} – {formatDateDisplay(analysis.endDate)}</div>
          <div><strong className="text-stone-900">Generated:</strong> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      {/* Executive Summary Block */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white border border-stone-300 flex flex-col items-center justify-center shadow-xs">
              <span className="text-2xl font-black text-stone-900">{analysis.productivityGrade.grade}</span>
              <span className="text-[9px] uppercase font-bold text-stone-500">Grade</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-stone-900">{analysis.averageScore} / 6.0</span>
                <span className="text-xs font-bold text-stone-600">· {analysis.productivityGrade.description}</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Evaluated over {analysis.daysLoggedCount} logged days ({analysis.completionRate}% tracking continuity).
              </p>
            </div>
          </div>

          <div className="text-right text-xs space-y-1">
            <div><strong className="text-stone-900">Total Deep Work:</strong> {analysis.studyTimeMetrics.totalDeepWorkHours} hours</div>
            <div><strong className="text-stone-900">Coding Daily Avg:</strong> {analysis.studyTimeMetrics.avgDailyCodingMinutes} mins</div>
            <div><strong className="text-stone-900">Boundary Compliance:</strong> {analysis.entertainmentMetrics.complianceRate}%</div>
          </div>
        </div>
      </div>

      {/* 6 Pillars Breakdown Table */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-2 border-b border-stone-300 pb-1">
          1. The 6 H.O.S.T.E.L. Execution Pillars
        </h3>
        <table className="w-full text-left text-xs border border-stone-200">
          <thead className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
            <tr>
              <th className="py-2 px-3">Pillar</th>
              <th className="py-2 px-3">Dimension</th>
              <th className="py-2 px-3 text-center">Score</th>
              <th className="py-2 px-3">Key Sub-Metrics</th>
              <th className="py-2 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {analysis.pillarStats.map((p) => (
              <tr key={p.letter} className="hover:bg-stone-50">
                <td className="py-2 px-3 font-bold text-stone-900">
                  <span className="inline-block w-4 h-4 bg-stone-900 text-white rounded text-[10px] text-center leading-4 mr-1">
                    {p.letter}
                  </span>
                  {p.title}
                </td>
                <td className="py-2 px-3 text-stone-600 text-[11px]">{p.subtitle}</td>
                <td className="py-2 px-3 font-bold text-center">{p.successRate}%</td>
                <td className="py-2 px-3 text-[11px] text-stone-600">
                  {p.subMetrics.map((m) => `${m.label}: ${m.value}`).join(' · ')}
                </td>
                <td className="py-2 px-3 text-right font-semibold text-[11px] text-stone-800">
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diagnostics: Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
            Key System Strengths
          </h4>
          <ul className="space-y-1 text-[11px] text-stone-700">
            {analysis.topStrengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>

        <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide mb-1.5">
            Critical Bottlenecks
          </h4>
          <ul className="space-y-1 text-[11px] text-stone-700">
            {analysis.criticalBottlenecks.map((b, i) => (
              <li key={i}>• {b}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Priority Ways to Improve Section */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-2 border-b border-stone-300 pb-1">
          2. Actionable Remediation Protocols (Ways to Improve)
        </h3>

        <div className="space-y-3">
          {analysis.recommendations.map((rec, idx) => (
            <div key={rec.id} className="p-3 rounded-lg border border-stone-300 bg-white">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-stone-900">
                  {idx + 1}. {rec.title} ({rec.category})
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700">
                  Impact: {rec.expectedImpact}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mb-2">
                <strong>Diagnosis:</strong> {rec.whyItMatters}
              </p>
              <div className="space-y-1 text-[11px] text-stone-800 pl-2 border-l-2 border-amber-500">
                {rec.concreteSteps.map((step, sIdx) => (
                  <div key={sIdx}>
                    <strong>Step {sIdx + 1}:</strong> {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Hostel Golden Law Footer */}
      <div className="pt-3 border-t-2 border-stone-900 flex items-start justify-between gap-4 text-[10px] text-stone-600">
        <div>
          <strong className="text-stone-900">Hostel Student Cardinal Law: </strong>
          Your bed is strictly for sleep. Never study, code, or watch shows under the sheets. Consistent daily execution of the loop beats occasional heroic all-nighters.
        </div>
        <div className="text-right shrink-0">
          Page 1 of 1 · Hostel Loop Productivity System
        </div>
      </div>
    </div>
  );
};
