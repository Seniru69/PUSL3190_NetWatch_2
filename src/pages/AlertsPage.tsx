import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  AlertTriangle,
  Shield,
  ExternalLink,
  FileText,
  Eye,
  EyeOff,
  Clock,
  MessageCircle,
  User,
  Filter,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Hard-coded sample alert data                                       */
/* ------------------------------------------------------------------ */

type AlertSeverity = 'critical' | 'caution';
type AlertCategory = 'Grooming' | 'Cyberbullying' | 'Harmful Content' | 'Suspicious Contact';
type Platform = 'Roblox' | 'Instagram' | 'Discord' | 'TikTok' | 'Snapchat';
type FilterOption = 'All' | 'Grooming' | 'Cyberbullying' | 'Harmful Content' | 'Suspicious Contact';

interface AlertItem {
  id: number;
  severity: AlertSeverity;
  category: AlertCategory;
  title: string;
  description: string;
  excerpt?: string;
  platform: Platform;
  time: string;
  contact: string;
}

const ALERTS: AlertItem[] = [
  {
    id: 1,
    severity: 'critical',
    category: 'Grooming',
    title: "Suspicious private messages from 'GamerBro99' on Roblox",
    description:
      "Your child received 18 private messages from an adult-sounding user in Roblox after 11 PM asking for photos. The user repeatedly asked to meet outside the game and requested personal photos.",
    excerpt:
      "hey sweetie, can you send me a pic? nobody has to know... let's meet up at the park tomorrow",
    platform: 'Roblox',
    time: '2 hours ago',
    contact: 'GamerBro99',
  },
  {
    id: 2,
    severity: 'critical',
    category: 'Grooming',
    title: "Adult user 'CoolTeen2008' on Instagram requesting personal info",
    description:
      "An adult-sounding account has been sending direct messages to your child on Instagram, asking for personal information including phone number and home address.",
    excerpt:
      "what's your number? I can pick you up after school... don't tell your parents about me",
    platform: 'Instagram',
    time: '4 hours ago',
    contact: 'CoolTeen2008',
  },
  {
    id: 3,
    severity: 'critical',
    category: 'Suspicious Contact',
    title: "Fake moderator 'DiscordMod_Alex' requesting login credentials on Discord",
    description:
      "A user impersonating a Discord moderator has been messaging your child, requesting their login credentials and personal information under the guise of account verification.",
    excerpt:
      'This is Discord support. We need to verify your account. Please share your password and email to confirm your identity.',
    platform: 'Discord',
    time: '5 hours ago',
    contact: 'DiscordMod_Alex',
  },
  {
    id: 4,
    severity: 'caution',
    category: 'Cyberbullying',
    title: 'Bullying behavior detected in TikTok comments',
    description:
      "Multiple negative comments targeting your child have been detected on their recent TikTok posts. The comments include derogatory language and threats.",
    excerpt: "nobody likes your videos, just delete your account... you're so ugly lol",
    platform: 'TikTok',
    time: '8 hours ago',
    contact: 'Unknown',
  },
  {
    id: 5,
    severity: 'caution',
    category: 'Harmful Content',
    title: 'Inappropriate content shared in Snapchat group',
    description:
      "An unknown user shared explicit content in a Snapchat group that your child is part of. The content has been flagged as inappropriate for minors.",
    platform: 'Snapchat',
    time: '12 hours ago',
    contact: 'Unknown',
  },
];

const PLATFORM_COLORS: Record<Platform, { bg: string; text: string }> = {
  Roblox: { bg: 'bg-red-100', text: 'text-red-700' },
  Instagram: { bg: 'bg-pink-100', text: 'text-pink-700' },
  Discord: { bg: 'bg-slate-100', text: 'text-slate-700' },
  TikTok: { bg: 'bg-gray-100', text: 'text-gray-700' },
  Snapchat: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

const PLATFORM_DOT: Record<Platform, string> = {
  Roblox: 'bg-red-500',
  Instagram: 'bg-pink-500',
  Discord: 'bg-slate-600',
  TikTok: 'bg-gray-800',
  Snapchat: 'bg-yellow-400',
};

const SEVERITY_STYLES: Record<
  AlertSeverity,
  { border: string; bg: string; badge: string; badgeText: string; dot: string }
> = {
  critical: {
    border: 'border-l-4 border-l-red-500',
    bg: 'bg-red-50/60',
    badge: 'bg-red-100',
    badgeText: 'text-red-700',
    dot: 'bg-red-500',
  },
  caution: {
    border: 'border-l-4 border-l-amber-500',
    bg: 'bg-amber-50/60',
    badge: 'bg-amber-100',
    badgeText: 'text-amber-700',
    dot: 'bg-amber-500',
  },
};

const FILTER_OPTIONS: FilterOption[] = [
  'All',
  'Grooming',
  'Cyberbullying',
  'Harmful Content',
  'Suspicious Contact',
];

/* ================================================================== */
/*  AlertCard component                                                */
/* ================================================================== */

function AlertCard({ alert }: { alert: AlertItem }) {
  const { t } = useApp();
  const [showExcerpt, setShowExcerpt] = useState(false);
  const sev = SEVERITY_STYLES[alert.severity];
  const plat = PLATFORM_COLORS[alert.platform];

  return (
    <div
      className={`rounded-xl border border-slate-200/80 ${sev.border} ${sev.bg} shadow-sm transition-all duration-300 hover:shadow-md`}
    >
      <div className="p-5">
        {/* Top row: badges */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Severity badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${sev.badge} ${sev.badgeText}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
              {alert.severity === 'critical'
                ? (t('critical') || 'Critical')
                : (t('caution') || 'Caution')}
            </span>

            {/* Category badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600">
              <AlertTriangle className="w-3 h-3" />
              {alert.category}
            </span>

            {/* Platform badge */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${plat.bg} ${plat.text}`}
            >
              <span className={`w-2 h-2 rounded-full ${PLATFORM_DOT[alert.platform]}`} />
              {alert.platform}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {alert.time}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1.5">
          {alert.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          {alert.description}
        </p>

        {/* Contact info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
          <User className="w-3.5 h-3.5" />
          <span className="font-medium">{t('contact') || 'Contact'}:</span>
          <span className="text-slate-700 font-semibold">{alert.contact}</span>
        </div>

        {/* Excerpt section - toggleable */}
        {alert.excerpt && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showExcerpt ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-lg bg-slate-100/80 border border-slate-200/60 p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <MessageCircle className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {t('excerpt') || 'Excerpt'}
                </span>
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "{alert.excerpt}"
              </p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-200/60">
          {/* Report to SLCERT */}
          <a
            href="https://www.cert.gov.lk/report_incident"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600 active:scale-[0.98]"
          >
            <Shield className="w-3.5 h-3.5" />
            {t('reportToSLCERT') || 'Report to SLCERT'}
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Generate Police Report */}
          <a
            href="https://www.police.lk/?page_id=1879"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-slate-600 to-slate-700 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-slate-500 hover:to-slate-600 active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5" />
            {t('generatePoliceReport') || 'Generate Police Report'}
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* View Excerpt toggle */}
          {alert.excerpt && (
            <button
              onClick={() => setShowExcerpt(!showExcerpt)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-300"
            >
              {showExcerpt ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  {t('hideExcerpt')}
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  View
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  AlertsPage                                                         */
/* ================================================================== */

export default function AlertsPage() {
  const { t } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');

  const filteredAlerts =
    activeFilter === 'All'
      ? ALERTS
      : ALERTS.filter((a) => a.category === activeFilter);

  const criticalCount = filteredAlerts.filter((a) => a.severity === 'critical').length;
  const cautionCount = filteredAlerts.filter((a) => a.severity === 'caution').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ---- Header ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {t('alerts') || 'Alerts'}
            </h1>
          </div>

          {/* Alert count summary */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {criticalCount} {t('critical') || 'Critical'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {cautionCount} {t('caution') || 'Caution'}
            </span>
          </div>
        </div>

        {/* ---- Filter bar ---- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-slate-500 mr-1 shrink-0">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">
              {t('filter') || 'Filter'}
            </span>
          </div>
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => setActiveFilter(option)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeFilter === option
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {option === 'All'
                ? (t('all') || 'All')
                : option === 'Grooming'
                  ? (t('grooming') || 'Grooming')
                  : option === 'Cyberbullying'
                    ? (t('cyberbullying') || 'Cyberbullying')
                    : option === 'Harmful Content'
                      ? (t('harmfulContent') || 'Harmful Content')
                      : (t('suspiciousContact') || 'Suspicious Contact')}
            </button>
          ))}
        </div>

        {/* ---- Alert cards ---- */}
        <div className="space-y-4">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">
                {t('noAlertsFound') || 'No alerts found'}
              </h3>
              <p className="text-sm text-slate-400 max-w-sm">
                {t('noAlertsForCategory') ||
                  'No alerts match the selected filter. Try selecting a different category.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
