import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  AlertTriangle,
  Monitor,
  Users,
  ExternalLink,
  Pause,
  Play,
  UserX,
  Eye,
  Clock,
  TrendingUp,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Hard-coded sample data                                             */
/* ------------------------------------------------------------------ */

interface Threat {
  id: number;
  platform: 'Roblox' | 'Discord' | 'Instagram' | 'TikTok' | 'Snapchat';
  title: string;
  description: string;
  severity: 'critical' | 'caution' | 'safe';
  time: string;
}

const THREATS: Threat[] = [
  {
    id: 1,
    platform: 'Roblox',
    title: "Suspicious user 'ShadowLad' in Roblox Adopt Me",
    description:
      'A user named ShadowLad has been repeatedly messaging minors in Adopt Me, requesting private conversations and sharing external links. Multiple community reports have been filed.',
    severity: 'critical',
    time: '2 hours ago',
  },
  {
    id: 2,
    platform: 'Discord',
    title: 'Grooming pattern detected on Discord',
    description:
      'AI-assisted pattern analysis flagged a series of DMs from an adult user to a minor showing classic grooming behavior: gift offers, isolation tactics, and requests to keep conversations secret.',
    severity: 'critical',
    time: '4 hours ago',
  },
  {
    id: 3,
    platform: 'Instagram',
    title: 'Inappropriate content shared on Instagram',
    description:
      'A public story post contained explicit content visible to followers under 18. The account has been reported to Instagram and is pending review.',
    severity: 'caution',
    time: '6 hours ago',
  },
  {
    id: 4,
    platform: 'TikTok',
    title: 'Cyberbullying in TikTok comments',
    description:
      'Coordinated bullying comments targeting a minor were identified on a TikTok video. The comments include derogatory language and threats of physical harm.',
    severity: 'caution',
    time: '8 hours ago',
  },
];

const PLATFORM_COLORS: Record<string, string> = {
  Roblox: 'bg-red-500',
  Discord: 'bg-indigo-500',
  Instagram: 'bg-pink-500',
  TikTok: 'bg-gray-800',
  Snapchat: 'bg-yellow-400',
};

const SEVERITY_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  caution: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  safe: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

/* Activity-summary data for the past 7 days */
interface DayActivity {
  day: string;
  safe: number;
  caution: number;
  critical: number;
}

const ACTIVITY: DayActivity[] = [
  { day: 'Mon', safe: 8, caution: 2, critical: 1 },
  { day: 'Tue', safe: 10, caution: 1, critical: 0 },
  { day: 'Wed', safe: 6, caution: 3, critical: 2 },
  { day: 'Thu', safe: 9, caution: 2, critical: 1 },
  { day: 'Fri', safe: 7, caution: 4, critical: 2 },
  { day: 'Sat', safe: 5, caution: 3, critical: 3 },
  { day: 'Sun', safe: 11, caution: 1, critical: 0 },
];

/* ------------------------------------------------------------------ */
/*  Circular progress component                                        */
/* ------------------------------------------------------------------ */

function CircularProgress({ value, max, size = 96, strokeWidth = 8 }: { value: number; max: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = value / max;
  const offset = circumference - percent * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      {/* progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#0d9488"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700 ease-out"
      />
      {/* label */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-teal-700 font-bold"
        style={{ fontSize: size * 0.22, transform: 'rotate(90deg)', transformOrigin: 'center' }}
      >
        {value}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity bar segment                                               */
/* ------------------------------------------------------------------ */

function ActivityBar({ day }: { day: DayActivity }) {
  const total = day.safe + day.caution + day.critical;
  const maxVal = 16; // max possible for scaling
  const height = (total / maxVal) * 100;

  return (
    <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
      <div className="relative w-full flex justify-center" style={{ height: 120 }}>
        <div
          className="w-6 rounded-t-md flex flex-col-reverse overflow-hidden transition-all duration-500"
          style={{ height: `${height}%` }}
        >
          <div className="bg-emerald-400 w-full transition-all duration-500" style={{ flex: day.safe }} />
          <div className="bg-amber-400 w-full transition-all duration-500" style={{ flex: day.caution }} />
          <div className="bg-red-400 w-full transition-all duration-500" style={{ flex: day.critical }} />
        </div>
      </div>
      <span className="text-xs font-medium text-slate-500">{day.day}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Modal component                                                    */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      {/* content */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-8 animate-in fade-in">
        {children}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DashboardPage                                                      */
/* ================================================================== */

export default function DashboardPage({ onNavigate }: { onNavigate?: (page: any) => void }) {
  const { t, profile, language, monitoringPaused, setMonitoringPaused } = useApp();
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePauseClick = () => {
    if (monitoringPaused) {
      setMonitoringPaused(false);
    } else {
      setShowPauseModal(true);
    }
  };

  const handleConfirmPause = () => {
    setMonitoringPaused(true);
    setShowPauseModal(false);
  };

  const handleReportContact = () => {
    onNavigate?.('contacts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {t('dashboard')}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {t('welcomeBack')}, {profile?.full_name || 'Parent'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            {currentDate.toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Top Stats Row                                                */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Safety Score */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 p-6 text-white shadow-lg shadow-teal-500/20 transition-transform hover:scale-[1.02]">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">{t('safetyScore') || 'Safety Score'}</p>
                <p className="mt-2 text-3xl font-bold">78<span className="text-lg font-normal text-teal-200">/100</span></p>
              </div>
              <CircularProgress value={78} max={100} size={80} strokeWidth={7} />
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs text-teal-200">
              <TrendingUp className="w-3.5 h-3.5" />
              +3 from last week
            </div>
          </div>

          {/* Active Alerts */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-6 text-white shadow-lg shadow-slate-700/20 transition-transform hover:scale-[1.02]">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium">{t('activeAlerts') || 'Active Alerts'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">3</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-xs font-bold animate-pulse">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Monitored Platforms */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 p-6 text-white shadow-lg shadow-teal-600/20 transition-transform hover:scale-[1.02]">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            <p className="text-teal-100 text-sm font-medium">{t('monitoredPlatforms') || 'Monitored Platforms'}</p>
            <p className="mt-2 text-3xl font-bold">5</p>
            <div className="mt-3 flex items-center gap-1.5">
              {['Roblox', 'Discord', 'Instagram', 'TikTok', 'Snapchat'].map((p) => (
                <span
                  key={p}
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${PLATFORM_COLORS[p]} text-white text-[10px] font-bold shadow-sm`}
                >
                  {p[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Children Protected */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 p-6 text-white shadow-lg shadow-slate-600/20 transition-transform hover:scale-[1.02]">
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/5" />
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/20">
                <Users className="w-6 h-6 text-teal-300" />
              </div>
              <div>
                <p className="text-slate-300 text-sm font-medium">{t('childrenProtected') || 'Children Protected'}</p>
                <p className="mt-1 text-3xl font-bold">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Quick Actions Bar                                            */}
        {/* ============================================================ */}
        <div className="flex flex-wrap gap-4">
          {/* Report to SLCERT */}
          <a
            href="https://www.cert.gov.lk/report_incident"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all hover:shadow-lg hover:shadow-teal-600/30 hover:from-teal-500 hover:to-teal-600 active:scale-[0.98]"
          >
            <Shield className="w-4 h-4" />
            {t('reportToSLCERT') || 'Report to SLCERT'}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Pause Monitoring */}
          <button
            onClick={handlePauseClick}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-md transition-all active:scale-[0.98] ${
              monitoringPaused
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/25 hover:shadow-emerald-500/30'
                : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-slate-600/25 hover:shadow-slate-600/30'
            }`}
          >
            {monitoringPaused ? (
              <>
                <Play className="w-4 h-4" />
                {t('resumeMonitoring') || 'Resume Monitoring'}
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                {t('pauseMonitoring') || 'Pause Monitoring'}
              </>
            )}
          </button>

          {/* Report Contact */}
          <button
            onClick={handleReportContact}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-slate-600/25 transition-all hover:shadow-lg hover:shadow-slate-600/30 hover:from-slate-500 hover:to-slate-600 active:scale-[0.98]"
          >
            <UserX className="w-4 h-4" />
            {t('reportContact') || 'Report Contact'}
          </button>
        </div>

        {/* ============================================================ */}
        {/*  Main content grid: Threats + Activity                       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---- Recent Community Threats ---- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
                {t('recentCommunityThreats') || 'Recent Community Threats'}
              </h2>
              <span className="text-xs text-slate-400 font-medium">{THREATS.length} reports</span>
            </div>

            <div className="space-y-3">
              {THREATS.map((threat) => {
                const sev = SEVERITY_STYLE[threat.severity];
                return (
                  <div
                    key={threat.id}
                    className={`rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300 ${sev.bg}/40`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Platform badge */}
                        <span
                          className={`mt-0.5 inline-flex items-center justify-center w-9 h-9 rounded-lg ${PLATFORM_COLORS[threat.platform]} text-white text-xs font-bold shrink-0 shadow-sm`}
                        >
                          {threat.platform.slice(0, 2)}
                        </span>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">
                              {threat.title}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${sev.bg} ${sev.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                              {threat.severity === 'critical'
                                ? t('critical')
                                : threat.severity === 'caution'
                                  ? t('caution')
                                  : t('safe')}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500 line-clamp-1">{threat.description}</p>
                          <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            {threat.time}
                          </div>
                        </div>
                      </div>

                      {/* View button */}
                      <button
                        onClick={() => setSelectedThreat(threat)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 active:bg-teal-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {t('view') || 'View'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---- Activity Summary ---- */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              {t('activitySummary')}
            </h2>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <p className="text-xs text-slate-400 mb-1 font-medium">{t('past7Days')}</p>

              {/* Bar chart */}
              <div className="flex items-end gap-2 mt-4" style={{ height: 140 }}>
                {ACTIVITY.map((d) => (
                  <ActivityBar key={d.day} day={d} />
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center gap-5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-400" />
                  {t('safe')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-400" />
                  {t('caution')}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-red-400" />
                  {t('critical')}
                </span>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center justify-center rounded-lg bg-emerald-50 p-3">
                  <p className="text-lg font-bold text-emerald-600">
                    {ACTIVITY.reduce((s, d) => s + d.safe, 0)}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium mt-0.5">{t('safe')}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-amber-50 p-3">
                  <p className="text-lg font-bold text-amber-600">
                    {ACTIVITY.reduce((s, d) => s + d.caution, 0)}
                  </p>
                  <p className="text-[10px] text-amber-600 font-medium mt-0.5">{t('caution')}</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-3">
                  <p className="text-lg font-bold text-red-600">
                    {ACTIVITY.reduce((s, d) => s + d.critical, 0)}
                  </p>
                  <p className="text-[10px] text-red-600 font-medium mt-0.5">{t('critical')}</p>
                </div>
              </div>
            </div>

            {/* Monitoring status card */}
            <div
              className={`rounded-2xl border p-5 transition-colors ${
                monitoringPaused
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-teal-200 bg-teal-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                    monitoringPaused ? 'bg-amber-100' : 'bg-teal-100'
                  }`}
                >
                  <Monitor
                    className={`w-5 h-5 ${monitoringPaused ? 'text-amber-600' : 'text-teal-600'}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {monitoringPaused
                      ? (t('monitoringPaused'))
                      : (t('activeMonitoring'))}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {monitoringPaused
                      ? (t('monitoringPausedDesc'))
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Threat Detail Modal                                         */}
      {/* ============================================================ */}
      <Modal open={!!selectedThreat} onClose={() => setSelectedThreat(null)}>
        {selectedThreat && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${PLATFORM_COLORS[selectedThreat.platform]} text-white text-sm font-bold shadow-sm`}
                >
                  {selectedThreat.platform.slice(0, 2)}
                </span>
                <div>
                  <h3 className="font-bold text-slate-800">{selectedThreat.platform}</h3>
                  <p className="text-xs text-slate-400">{selectedThreat.time}</p>
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_STYLE[selectedThreat.severity].bg} ${SEVERITY_STYLE[selectedThreat.severity].text}`}
              >
                <span className={`w-2 h-2 rounded-full ${SEVERITY_STYLE[selectedThreat.severity].dot}`} />
                {selectedThreat.severity === 'critical'
                  ? t('critical')
                  : selectedThreat.severity === 'caution'
                    ? t('caution')
                    : t('safe')}
              </span>
            </div>

            <h4 className="text-base font-semibold text-slate-800 leading-snug">
              {selectedThreat.title}
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedThreat.description}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedThreat(null)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
              >
                {t('close') || 'Close'}
              </button>
              <a
                href="https://www.cert.gov.lk/report_incident"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600"
              >
                <Shield className="w-4 h-4" />
                {t('reportToSLCERT') || 'Report to SLCERT'}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </Modal>

      {/* ============================================================ */}
      {/*  Pause Monitoring Modal                                      */}
      {/* ============================================================ */}
      <Modal open={showPauseModal} onClose={() => setShowPauseModal(false)}>
        <div className="space-y-5 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-amber-100">
            <Pause className="w-8 h-8 text-amber-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {t('pauseMonitoringTitle') || 'Pause Monitoring?'}
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              {t('pauseMonitoringMessage') ||
                'The monitoring page is currently paused. Your children\'s activities are not being tracked at this time.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPauseModal(false)}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              onClick={handleConfirmPause}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            >
              <Pause className="w-4 h-4" />
              {t('confirmPause') || 'Confirm Pause'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
