import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Activity,
  Moon,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Sun,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Hard-coded sample data                                             */
/* ------------------------------------------------------------------ */

interface AppUsage {
  name: string;
  percentage: number;
  time: string;
  status: 'overused' | 'moderate' | 'balanced';
  color: string;
}

const APP_USAGE: AppUsage[] = [
  { name: 'Roblox', percentage: 35, time: '2h 6min', status: 'overused', color: 'bg-red-500' },
  { name: 'TikTok', percentage: 25, time: '1h 30min', status: 'moderate', color: 'bg-amber-400' },
  { name: 'Discord', percentage: 20, time: '1h 12min', status: 'balanced', color: 'bg-emerald-500' },
  { name: 'Instagram', percentage: 12, time: '43min', status: 'balanced', color: 'bg-emerald-500' },
  { name: 'Snapchat', percentage: 8, time: '28min', status: 'balanced', color: 'bg-emerald-500' },
];

interface SleepDay {
  day: string;
  hours: number;
}

const SLEEP_DATA: SleepDay[] = [
  { day: 'Mon', hours: 7.5 },
  { day: 'Tue', hours: 6.8 },
  { day: 'Wed', hours: 7.0 },
  { day: 'Thu', hours: 6.5 },
  { day: 'Fri', hours: 8.0 },
  { day: 'Sat', hours: 8.5 },
  { day: 'Sun', hours: 7.2 },
];

interface ScreenDay {
  day: string;
  time: string;
  minutes: number;
}

const SCREEN_DATA: ScreenDay[] = [
  { day: 'Mon', time: '5h 30min', minutes: 330 },
  { day: 'Tue', time: '6h 15min', minutes: 375 },
  { day: 'Wed', time: '5h 45min', minutes: 345 },
  { day: 'Thu', time: '6h 30min', minutes: 390 },
  { day: 'Fri', time: '5h 00min', minutes: 300 },
  { day: 'Sat', time: '7h 00min', minutes: 420 },
  { day: 'Sun', time: '4h 30min', minutes: 270 },
];

interface PlatformBreakdown {
  name: string;
  time: string;
  minutes: number;
  color: string;
}

const PLATFORM_BREAKDOWN: PlatformBreakdown[] = [
  { name: 'Roblox', time: '2h 6min', minutes: 126, color: 'bg-teal-500' },
  { name: 'TikTok', time: '1h 30min', minutes: 90, color: 'bg-teal-400' },
  { name: 'Discord', time: '1h 12min', minutes: 72, color: 'bg-teal-300' },
  { name: 'Instagram', time: '43min', minutes: 43, color: 'bg-teal-200' },
  { name: 'Snapchat', time: '28min', minutes: 28, color: 'bg-teal-100' },
  { name: 'Other', time: '20min', minutes: 20, color: 'bg-slate-200' },
];

interface PeakUsage {
  period: string;
  label: string;
  level: 'Low' | 'Medium' | 'High' | 'Medium-High';
  concerning: boolean;
}

const PEAK_USAGE: PeakUsage[] = [
  { period: '8-10 AM', label: 'Morning', level: 'Low', concerning: false },
  { period: '2-5 PM', label: 'Afternoon', level: 'Medium', concerning: false },
  { period: '7-9 PM', label: 'Evening', level: 'High', concerning: false },
  { period: '10 PM+', label: 'Late Night', level: 'Medium-High', concerning: true },
];

const CHILDREN = [
  { id: 'alex', name: 'Alex (12)' },
  { id: 'emma', name: 'Emma (9)' },
];

const DIVERSITY_RECOMMENDATIONS = [
  'Consider reducing Roblox time - it accounts for over a third of total screen time',
  'Try introducing educational apps like Duolingo or Khan Academy',
  'A balanced app portfolio helps develop diverse digital skills',
];

const SLEEP_ALERTS = [
  'Device used past 11 PM on Tuesday (Discord active until 12:30 AM)',
  'Device used past 11 PM on Thursday (TikTok active until 11:45 PM)',
];

const SLEEP_RECOMMENDATIONS = [
  'Set a device curfew at 9:30 PM',
  'Late-night screen time affects sleep quality significantly',
  'Consider enabling night mode after 9 PM',
];

const SCREEN_RECOMMENDATIONS = [
  'Total screen time exceeds recommended 2 hours for entertainment',
  'Consider scheduling outdoor activities during peak usage hours',
  'Evening screen time should be reduced for better sleep',
];

/* ------------------------------------------------------------------ */
/*  Helper: score color gradient                                       */
/* ------------------------------------------------------------------ */

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

function getScoreStroke(score: number): string {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
}

function _getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-50';
  if (score >= 60) return 'bg-amber-50';
  return 'bg-red-50';
}
void _getScoreBg;

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Moderate';
  return 'Needs Attention';
}

function getSleepBarColor(hours: number): string {
  if (hours >= 8) return 'bg-emerald-500';
  if (hours >= 7) return 'bg-amber-400';
  return 'bg-red-500';
}

function getPeakLevelColor(level: string, concerning: boolean): { bg: string; text: string } {
  if (concerning) return { bg: 'bg-red-50', text: 'text-red-700' };
  if (level === 'High') return { bg: 'bg-amber-50', text: 'text-amber-700' };
  if (level === 'Medium') return { bg: 'bg-teal-50', text: 'text-teal-700' };
  return { bg: 'bg-emerald-50', text: 'text-emerald-700' };
}

/* ------------------------------------------------------------------ */
/*  Circular progress component                                        */
/* ------------------------------------------------------------------ */

function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  strokeColor,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = value / max;
  const offset = circumference - percent * circumference;
  const color = strokeColor || getScoreStroke(value);

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
      <text
        x="50%"
        y="45%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-slate-800 font-bold"
        style={{ fontSize: size * 0.22, transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {value}
      </text>
      <text
        x="50%"
        y="65%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-slate-400"
        style={{ fontSize: size * 0.1, transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        /{max}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type TabKey = 'diversity' | 'sleep' | 'screentime';

/* ================================================================== */
/*  WellnessPage                                                       */
/* ================================================================== */

export default function WellnessPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('diversity');
  const [selectedChild, setSelectedChild] = useState('alex');

  const safetyScore = 78;
  const diversityScore = 72;
  const sleepScore = 65;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'diversity', label: t('appDiversity'), icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'sleep', label: t('sleepScore'), icon: <Moon className="w-4 h-4" /> },
    { key: 'screentime', label: t('screenTime'), icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ============================================================ */}
        {/*  Header                                                       */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {t('wellness')}
            </h1>
          </div>
          <div className="relative">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-teal-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            >
              {CHILDREN.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Weekly Safety Score Card                                     */}
        {/* ============================================================ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 p-6 sm:p-8 text-white shadow-lg shadow-teal-600/20">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/5" />

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            {/* Circular Progress */}
            <CircularProgress value={safetyScore} max={100} size={140} strokeWidth={12} strokeColor="#5eead4" />

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg font-semibold text-teal-100">
                {t('weeklySafetyScore')}
              </h2>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                <span className={`text-4xl font-bold ${getScoreColor(safetyScore)}`} style={{ color: '#fff' }}>
                  {safetyScore}
                  <span className="text-lg font-normal text-teal-200">/100</span>
                </span>
              </div>
              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <TrendingUp className="w-4 h-4 text-teal-200" />
                <span className="text-sm text-teal-200">
                  +5 From last week
                </span>
              </div>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-teal-100">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  {getScoreLabel(safetyScore)}
                </span>
              </div>
            </div>

            {/* Color gradient legend */}
            <div className="hidden lg:flex flex-col items-end gap-1">
              <span className="text-[10px] text-teal-200 font-medium uppercase tracking-wider">Score Range</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-red-300">0</span>
                <div className="w-32 h-2 rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500" />
                <span className="text-[10px] text-emerald-300">100</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Tab Navigation                                               */}
        {/* ============================================================ */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  Tab Content                                                  */}
        {/* ============================================================ */}
        <div className="transition-all duration-300">
          {activeTab === 'diversity' && <DiversityTab diversityScore={diversityScore} />}
          {activeTab === 'sleep' && <SleepTab sleepScore={sleepScore} />}
          {activeTab === 'screentime' && <ScreenTimeTab />}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  App Diversity Tab                                                   */
/* ================================================================== */

function DiversityTab({ diversityScore }: { diversityScore: number }) {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      {/* Diversity Score Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <CircularProgress
              value={diversityScore}
              max={100}
              size={140}
              strokeWidth={12}
            />
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Diversity Score
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  diversityScore >= 80
                    ? 'bg-emerald-50 text-emerald-700'
                    : diversityScore >= 60
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    diversityScore >= 80
                      ? 'bg-emerald-500'
                      : diversityScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                />
                {getScoreLabel(diversityScore)}
              </span>
            </div>
          </div>
        </div>

        {/* Time Distribution Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Time Distribution
            </h3>
          </div>

          <div className="space-y-4">
            {APP_USAGE.map((app) => (
              <div key={app.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        app.status === 'overused'
                          ? 'bg-red-500'
                          : app.status === 'moderate'
                            ? 'bg-amber-400'
                            : 'bg-emerald-500'
                      }`}
                    />
                    <span className="text-sm font-medium text-slate-700">{app.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{app.time}</span>
                    <span
                      className={`text-xs font-semibold min-w-[3rem] text-right ${
                        app.status === 'overused'
                          ? 'text-red-600'
                          : app.status === 'moderate'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                      }`}
                    >
                      {app.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      app.status === 'overused'
                        ? 'bg-gradient-to-r from-red-400 to-red-500'
                        : app.status === 'moderate'
                          ? 'bg-gradient-to-r from-amber-300 to-amber-400'
                          : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    }`}
                    style={{ width: `${app.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Stacked bar overview */}
          <div className="mt-6">
            <p className="text-xs text-slate-400 mb-2 font-medium">
              Overall Distribution
            </p>
            <div className="flex h-5 rounded-full overflow-hidden">
              {APP_USAGE.map((app) => (
                <div
                  key={app.name}
                  className={`transition-all duration-700 ${
                    app.status === 'overused'
                      ? 'bg-red-500'
                      : app.status === 'moderate'
                        ? 'bg-amber-400'
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${app.percentage}%` }}
                  title={`${app.name}: ${app.percentage}%`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-teal-600" />
          {t('suggestions')}
        </h3>
        <div className="space-y-3">
          {DIVERSITY_RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-teal-50/50 p-4 border border-teal-100">
              <div className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 shrink-0">
                <span className="text-xs font-bold text-teal-700">{i + 1}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Sleep Score Tab                                                     */
/* ================================================================== */

function SleepTab({ sleepScore }: { sleepScore: number }) {
  const { t } = useApp();
  const maxSleep = 10;

  return (
    <div className="space-y-6">
      {/* Top Row: Score + Bedtime Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sleep Score */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <CircularProgress
              value={sleepScore}
              max={100}
              size={140}
              strokeWidth={12}
            />
            <h3 className="mt-4 text-lg font-bold text-slate-800">
              Overall Sleep Score
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  sleepScore >= 80
                    ? 'bg-emerald-50 text-emerald-700'
                    : sleepScore >= 60
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-red-50 text-red-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    sleepScore >= 80
                      ? 'bg-emerald-500'
                      : sleepScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                />
                {getScoreLabel(sleepScore)}
              </span>
            </div>
          </div>

          {/* Sleep Duration */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Sleep Duration</span>
              <span className="text-sm font-semibold text-slate-800">7.2 hours</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Recommended</span>
              <span className="text-xs text-slate-500">8-10 hours for age group</span>
            </div>
            <div className="mt-2 w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                style={{ width: `${(7.2 / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bedtime Analysis */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
            <Moon className="w-5 h-5 text-teal-600" />
            Bedtime Analysis
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Average Bedtime */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-medium">Average Bedtime</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-red-600">11:30 PM</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs text-amber-600">
                  Recommended Bedtime: 9:00-10:00 PM
                </span>
              </div>
            </div>

            {/* Average Wake Time */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs text-slate-400 font-medium">Average Wake Time</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-700">6:45 AM</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-teal-500" />
                <span className="text-xs text-teal-600">
                  Consistent Wake Time
                </span>
              </div>
            </div>
          </div>

          {/* Late-night alerts */}
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Late Night Alerts
            </h4>
            <div className="space-y-2">
              {SLEEP_ALERTS.map((alert, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-100 p-3">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <p className="text-sm text-red-700">{alert}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Sleep Chart */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-teal-600" />
          Weekly Trend
        </h3>

        <div className="flex items-end gap-4" style={{ height: 180 }}>
          {SLEEP_DATA.map((d) => {
            const heightPercent = (d.hours / maxSleep) * 100;
            return (
              <div key={d.day} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs font-semibold text-slate-600">{d.hours}h</span>
                <div className="relative w-full flex justify-center" style={{ height: 140 }}>
                  <div
                    className={`w-10 rounded-t-lg transition-all duration-700 ease-out ${getSleepBarColor(d.hours)}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{d.day}</span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            8h+ Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-400" />
            7-8h Moderate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-red-500" />
            &lt;7h Concerning
          </span>
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-teal-600" />
          {t('suggestions')}
        </h3>
        <div className="space-y-3">
          {SLEEP_RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-teal-50/50 p-4 border border-teal-100">
              <div className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 shrink-0">
                <span className="text-xs font-bold text-teal-700">{i + 1}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Screen Time Tab                                                     */
/* ================================================================== */

function ScreenTimeTab() {
  const { t } = useApp();
  const maxMinutes = 420; // 7h for scaling

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-100">
              <Smartphone className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Today Total</p>
              <p className="text-xl font-bold text-slate-800">6h 19min</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100">
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Weekly Average</p>
              <p className="text-xl font-bold text-slate-800">5h 45min</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-100">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Recommended Max</p>
              <p className="text-xl font-bold text-amber-600">2h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Trend + Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-teal-600" />
            Weekly Trend
          </h3>

          <div className="flex items-end gap-2" style={{ height: 180 }}>
            {SCREEN_DATA.map((d) => {
              const heightPercent = (d.minutes / maxMinutes) * 100;
              const isOver = d.minutes >= 360;
              return (
                <div key={d.day} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-600 truncate w-full text-center">{d.time}</span>
                  <div className="relative w-full flex justify-center" style={{ height: 140 }}>
                    <div
                      className={`w-6 rounded-t-lg transition-all duration-700 ease-out ${
                        isOver
                          ? 'bg-gradient-to-t from-teal-600 to-teal-400'
                          : 'bg-gradient-to-t from-teal-500 to-teal-300'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    {/* Threshold line at 2h (120min) */}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-teal-600" />
            Platform Breakdown
          </h3>

          <div className="space-y-3">
            {PLATFORM_BREAKDOWN.map((platform) => {
              const totalMinutes = PLATFORM_BREAKDOWN.reduce((sum, p) => sum + p.minutes, 0);
              const widthPercent = (platform.minutes / totalMinutes) * 100;
              return (
                <div key={platform.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{platform.name}</span>
                    <span className="text-sm text-slate-500">{platform.time}</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out ${platform.color}`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Total</span>
            <span className="text-sm font-bold text-teal-700">6h 19min</span>
          </div>
        </div>
      </div>

      {/* Peak Usage Times */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-5">
          <Clock className="w-5 h-5 text-teal-600" />
          Peak Usage Times
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PEAK_USAGE.map((peak) => {
            const levelStyle = getPeakLevelColor(peak.level, peak.concerning);
            return (
              <div
                key={peak.label}
                className={`rounded-xl border p-4 ${peak.concerning ? 'border-red-200' : 'border-slate-100'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">{peak.label}</p>
                  {peak.concerning && <AlertTriangle className="w-4 h-4 text-red-500" />}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{peak.period}</p>
                <div className="mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${levelStyle.bg} ${levelStyle.text}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        peak.concerning
                          ? 'bg-red-500'
                          : peak.level === 'High'
                            ? 'bg-amber-500'
                            : peak.level === 'Medium'
                              ? 'bg-teal-500'
                              : 'bg-emerald-500'
                      }`}
                    />
                    {peak.level}
                  </span>
                </div>
                {peak.concerning && (
                  <p className="mt-2 text-xs text-red-600 font-medium">
                    Concerning
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-teal-600" />
          {t('suggestions')}
        </h3>
        <div className="space-y-3">
          {SCREEN_RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-teal-50/50 p-4 border border-teal-100">
              <div className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-teal-100 shrink-0">
                <span className="text-xs font-bold text-teal-700">{i + 1}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}