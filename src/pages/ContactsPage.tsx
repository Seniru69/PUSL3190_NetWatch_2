import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  AlertTriangle,
  Shield,
  ExternalLink,
  CheckCircle,
  Eye,
  X,
  Link2,
  MessageCircle,
  Clock,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type RiskLevel = 'high' | 'medium' | 'low';
type Platform = 'Roblox' | 'Instagram' | 'Discord' | 'TikTok' | 'YouTube';

interface Contact {
  id: string;
  username: string;
  platform: Platform;
  risk: RiskLevel;
  notes: string;
  crossPlatformMatch?: { username: string; platform: Platform };
  reportUrl: string;
  isKnown: boolean;
  activityHistory?: ActivityItem[];
  flaggedContent?: string[];
}

interface ActivityItem {
  id: string;
  type: 'message' | 'request' | 'connection';
  description: string;
  time: string;
}

interface CrossPlatformMatch {
  id: string;
  contact1: { username: string; platform: Platform };
  contact2: { username: string; platform: Platform };
  combinedRisk: RiskLevel;
}

/* ------------------------------------------------------------------ */
/*  Hard-coded sample data                                             */
/* ------------------------------------------------------------------ */

const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    username: 'GamerBro99',
    platform: 'Roblox',
    risk: 'high',
    notes: 'Sent 18 private messages after 11 PM asking for photos',
    crossPlatformMatch: { username: 'CoolTeen2008', platform: 'Instagram' },
    reportUrl: 'https://www.roblox.com/support',
    isKnown: false,
    activityHistory: [
      { id: 'a1', type: 'message', description: 'Sent 5 private messages at 11:32 PM', time: '2 hours ago' },
      { id: 'a2', type: 'request', description: 'Requested personal photos', time: '2 hours ago' },
      { id: 'a3', type: 'message', description: 'Sent 8 private messages at 11:45 PM', time: '3 hours ago' },
      { id: 'a4', type: 'request', description: 'Asked for phone number', time: '5 hours ago' },
    ],
    flaggedContent: [
      '"send me a pic, it\'s just between us"',
      '"what\'s your real name? I won\'t tell anyone"',
      '"let\'s talk on another app"',
    ],
  },
  {
    id: '2',
    username: 'CoolTeen2008',
    platform: 'Instagram',
    risk: 'high',
    notes: 'Adult-sounding account, repeatedly requesting personal information',
    crossPlatformMatch: { username: 'GamerBro99', platform: 'Roblox' },
    reportUrl: 'https://help.instagram.com/192435014247952',
    isKnown: false,
    activityHistory: [
      { id: 'b1', type: 'message', description: 'Sent DM asking for home address', time: '1 hour ago' },
      { id: 'b2', type: 'request', description: 'Requested personal information repeatedly', time: '1 hour ago' },
      { id: 'b3', type: 'message', description: 'Commented on multiple posts asking to meet up', time: '4 hours ago' },
      { id: 'b4', type: 'connection', description: 'Attempted to follow private account', time: '6 hours ago' },
    ],
    flaggedContent: [
      '"where do you live? I want to send you something"',
      '"don\'t tell your parents about our chat"',
      '"what school do you go to?"',
    ],
  },
  {
    id: '3',
    username: 'DiscordMod_Alex',
    platform: 'Discord',
    risk: 'high',
    notes: 'Impersonating moderator, requesting login credentials',
    reportUrl: 'https://support.discord.com',
    isKnown: false,
    activityHistory: [
      { id: 'c1', type: 'request', description: 'Requested login credentials claiming to be admin', time: '30 min ago' },
      { id: 'c2', type: 'message', description: 'Sent DM pretending to be Discord staff', time: '30 min ago' },
      { id: 'c3', type: 'request', description: 'Asked for password "for verification"', time: '1 hour ago' },
      { id: 'c4', type: 'connection', description: 'Joined multiple child-oriented servers', time: '3 hours ago' },
    ],
    flaggedContent: [
      '"I need your password to verify your account"',
      '"I\'m a Discord admin, your account will be banned if you don\'t comply"',
      '"send me your login details, this is an official check"',
    ],
  },
  {
    id: '4',
    username: 'SchoolFriend_Maya',
    platform: 'Instagram',
    risk: 'low',
    notes: 'Classmate, known contact',
    reportUrl: 'https://help.instagram.com/192435014247952',
    isKnown: true,
    activityHistory: [
      { id: 'd1', type: 'message', description: 'Shared a school project photo', time: '1 day ago' },
      { id: 'd2', type: 'message', description: 'Replied to story post', time: '2 days ago' },
      { id: 'd3', type: 'connection', description: 'Followed back on Instagram', time: '1 week ago' },
    ],
    flaggedContent: [],
  },
  {
    id: '5',
    username: 'RobloxPlayer_22',
    platform: 'Roblox',
    risk: 'medium',
    notes: 'New friend, no suspicious activity yet',
    reportUrl: 'https://www.roblox.com/support',
    isKnown: false,
    activityHistory: [
      { id: 'e1', type: 'connection', description: 'Added as friend in Roblox', time: '2 days ago' },
      { id: 'e2', type: 'message', description: 'Sent a friendly greeting message', time: '2 days ago' },
      { id: 'e3', type: 'message', description: 'Invited to play a game together', time: '3 days ago' },
    ],
    flaggedContent: [],
  },
  {
    id: '6',
    username: 'TikTokFan_K',
    platform: 'TikTok',
    risk: 'low',
    notes: 'Mutual friend connection',
    reportUrl: 'https://www.tiktok.com/community-guidelines',
    isKnown: false,
    activityHistory: [
      { id: 'f1', type: 'connection', description: 'Followed through mutual friend', time: '3 days ago' },
      { id: 'f2', type: 'message', description: 'Liked a shared video', time: '4 days ago' },
    ],
    flaggedContent: [],
  },
];

const CROSS_PLATFORM_MATCHES: CrossPlatformMatch[] = [
  {
    id: 'cp1',
    contact1: { username: 'GamerBro99', platform: 'Roblox' },
    contact2: { username: 'CoolTeen2008', platform: 'Instagram' },
    combinedRisk: 'high',
  },
  {
    id: 'cp2',
    contact1: { username: 'DiscordMod_Alex', platform: 'Discord' },
    contact2: { username: 'Alex_Gaming_YT', platform: 'YouTube' },
    combinedRisk: 'medium',
  },
];

/* ------------------------------------------------------------------ */
/*  Style helpers                                                      */
/* ------------------------------------------------------------------ */

const PLATFORM_COLORS: Record<Platform, string> = {
  Roblox: 'bg-red-500',
  Instagram: 'bg-pink-500',
  Discord: 'bg-slate-600',
  TikTok: 'bg-slate-800',
  YouTube: 'bg-red-600',
};

const RISK_STYLES: Record<RiskLevel, { border: string; bg: string; text: string; dot: string; badge: string }> = {
  high: {
    border: 'border-l-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
  },
  medium: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  low: {
    border: 'border-l-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
};

const ACTIVITY_ICONS: Record<string, typeof MessageCircle> = {
  message: MessageCircle,
  request: AlertTriangle,
  connection: Link2,
};

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type TabKey = 'all' | 'highRisk' | 'crossPlatform';

/* ================================================================== */
/*  ContactsPage                                                       */
/* ================================================================== */

export default function ContactsPage() {
  const { t, language } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  /* ---- Derived data ---- */
  const highRiskContacts = contacts.filter((c) => c.risk === 'high');
  const highRiskCount = highRiskContacts.length;
  const crossPlatformCount = CROSS_PLATFORM_MATCHES.length;

  /* ---- Handlers ---- */
  const handleMarkAsKnown = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId ? { ...c, isKnown: !c.isKnown } : c
      )
    );
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedContact(null);
  };

  const getEffectiveRisk = (contact: Contact): RiskLevel => {
    if (contact.isKnown) return 'low';
    return contact.risk;
  };

  const getReportUrl = (contact: Contact): string => {
    return contact.reportUrl || 'https://www.iwf.org.uk/report/';
  };

  /* ---- Tab config ---- */
  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'all', label: t('allContacts') || 'All Contacts' },
    { key: 'highRisk', label: t('highRisk') || 'High Risk', count: highRiskCount },
    { key: 'crossPlatform', label: t('crossPlatformMatches') || 'Cross-Platform Matches', count: crossPlatformCount },
  ];

  const displayedContacts = activeTab === 'highRisk' ? highRiskContacts : contacts;
  void displayedContacts;

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              <Users className="w-7 h-7 text-teal-600" />
              {t('contacts') || 'Contacts'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            {new Date().toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* ---- Summary Cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-5 text-white shadow-lg shadow-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-xs font-medium">{t('highRiskContacts') || 'High Risk Contacts'}</p>
                <p className="mt-1 text-3xl font-bold">{highRiskCount}</p>
              </div>
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="mt-2 text-xs text-red-100">Requires immediate attention</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-5 text-white shadow-lg shadow-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-xs font-medium">{t('mediumRiskContacts') || 'Medium Risk Contacts'}</p>
                <p className="mt-1 text-3xl font-bold">{contacts.filter((c) => c.risk === 'medium' && !c.isKnown).length}</p>
              </div>
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="mt-2 text-xs text-amber-100">Monitor closely</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 p-5 text-white shadow-lg shadow-teal-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-xs font-medium">{t('crossPlatformMatches') || 'Cross-Platform Matches'}</p>
                <p className="mt-1 text-3xl font-bold">{crossPlatformCount}</p>
              </div>
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20">
                <Link2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="mt-2 text-xs text-teal-100">Same person, different platforms</p>
          </div>
        </div>

        {/* ---- Tab Bar ---- */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-1 -mb-px overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative whitespace-nowrap px-5 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-2 inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-xs font-bold ${
                      activeTab === tab.key
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* ---- Tab Content ---- */}
        {activeTab === 'all' && (
          <AllContactsTab
            contacts={contacts}
            onMarkAsKnown={handleMarkAsKnown}
            onViewDetails={handleViewDetails}
            getEffectiveRisk={getEffectiveRisk}
            getReportUrl={getReportUrl}
            t={t}
          />
        )}

        {activeTab === 'highRisk' && (
          <HighRiskTab
            contacts={highRiskContacts}
            onMarkAsKnown={handleMarkAsKnown}
            onViewDetails={handleViewDetails}
            getEffectiveRisk={getEffectiveRisk}
            getReportUrl={getReportUrl}
            t={t}
          />
        )}

        {activeTab === 'crossPlatform' && (
          <CrossPlatformTab
            matches={CROSS_PLATFORM_MATCHES}
            contacts={contacts}
            onMarkAsKnown={handleMarkAsKnown}
            onViewDetails={handleViewDetails}
            t={t}
          />
        )}
      </div>

      {/* ---- Detail Panel (sidebar on desktop, modal on mobile) ---- */}
      {detailOpen && selectedContact && (
        <ContactDetailPanel
          contact={selectedContact}
          onClose={handleCloseDetail}
          onMarkAsKnown={handleMarkAsKnown}
          getReportUrl={getReportUrl}
          t={t}
        />
      )}
    </div>
  );
}

/* ================================================================== */
/*  All Contacts Tab                                                   */
/* ================================================================== */

function AllContactsTab({
  contacts,
  onMarkAsKnown,
  onViewDetails,
  getEffectiveRisk,
  getReportUrl,
  t,
}: {
  contacts: Contact[];
  onMarkAsKnown: (id: string) => void;
  onViewDetails: (c: Contact) => void;
  getEffectiveRisk: (c: Contact) => RiskLevel;
  getReportUrl: (c: Contact) => string;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-400 font-medium">
        {contacts.length} {t('contacts') || 'contacts'}
      </p>
      {contacts.map((contact) => {
        const effectiveRisk = getEffectiveRisk(contact);
        const style = RISK_STYLES[effectiveRisk];
        return (
          <div
            key={contact.id}
            className={`rounded-xl border border-slate-200/80 bg-white shadow-sm border-l-4 ${style.border} transition-all hover:shadow-md hover:border-slate-300`}
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Platform badge */}
                  <span
                    className={`mt-0.5 inline-flex items-center justify-center w-10 h-10 rounded-lg ${PLATFORM_COLORS[contact.platform]} text-white text-xs font-bold shrink-0 shadow-sm`}
                  >
                    {contact.platform.slice(0, 2)}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800 text-sm">
                        {contact.username}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {contact.platform}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        {effectiveRisk === 'high'
                          ? (t('highRisk') || 'HIGH RISK')
                          : effectiveRisk === 'medium'
                            ? (t('mediumRisk') || 'MEDIUM RISK')
                            : contact.isKnown
                              ? (t('known') || 'KNOWN')
                              : (t('lowRisk') || 'LOW RISK')}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{contact.notes}</p>

                    {contact.crossPlatformMatch && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 rounded-md px-2 py-1 inline-flex">
                        <Link2 className="w-3.5 h-3.5" />
                        <span>
                          Same user as{' '}
                          <span className="font-semibold">{contact.crossPlatformMatch.username}</span> on{' '}
                          {contact.crossPlatformMatch.platform}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onViewDetails(contact)}
                    className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
                  >
                    <Eye className="w-3 h-3" />
                    {t('viewDetails') || 'View'}
                  </button>
                  <a
                    href={getReportUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 active:bg-slate-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('reportContact') || 'Report Contact'}
                  </a>
                  <button
                    onClick={() => onMarkAsKnown(contact.id)}
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      contact.isKnown
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {contact.isKnown ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        {t('known') || 'Known'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        {t('markAsKnown') || 'Mark as Known'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  High Risk Tab                                                      */
/* ================================================================== */

function HighRiskTab({
  contacts,
  onMarkAsKnown,
  onViewDetails,
  getEffectiveRisk,
  getReportUrl,
  t,
}: {
  contacts: Contact[];
  onMarkAsKnown: (id: string) => void;
  onViewDetails: (c: Contact) => void;
  getEffectiveRisk: (c: Contact) => RiskLevel;
  getReportUrl: (c: Contact) => string;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-4">
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
        <p className="text-sm text-red-700 font-medium">
          {contacts.length} {t('highRiskContactsWarning')}
        </p>
      </div>

      {contacts.map((contact) => {
        const effectiveRisk = getEffectiveRisk(contact);
        const style = RISK_STYLES[effectiveRisk];
        return (
          <div
            key={contact.id}
            className={`rounded-xl border border-slate-200/80 bg-white shadow-sm border-l-4 ${style.border} transition-all hover:shadow-md`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Platform badge */}
                  <span
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${PLATFORM_COLORS[contact.platform]} text-white text-sm font-bold shrink-0 shadow-md`}
                  >
                    {contact.platform.slice(0, 2)}
                  </span>

                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-base">
                        {contact.username}
                      </h3>
                      <span className="text-sm text-slate-400 font-medium">
                        {contact.platform}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${style.badge}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        {effectiveRisk === 'high'
                          ? (t('highRisk') || 'HIGH RISK')
                          : (t('known') || 'KNOWN')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{contact.notes}</p>

                    {contact.crossPlatformMatch && (
                      <div className="flex items-center gap-1.5 text-sm text-teal-700 bg-teal-50 rounded-lg px-3 py-1.5 inline-flex">
                        <Link2 className="w-4 h-4" />
                        <span>
                          Same user as{' '}
                          <span className="font-semibold">{contact.crossPlatformMatch.username}</span> on{' '}
                          {contact.crossPlatformMatch.platform}
                        </span>
                      </div>
                    )}

                    {/* Recent activity preview */}
                    {contact.activityHistory && contact.activityHistory.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          {t('recentActivity') || 'Recent Activity'}
                        </p>
                        {contact.activityHistory.slice(0, 2).map((activity) => {
                          const Icon = ACTIVITY_ICONS[activity.type] || MessageCircle;
                          return (
                            <div key={activity.id} className="flex items-center gap-2 text-xs text-slate-500">
                              <Icon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{activity.description}</span>
                              <span className="text-slate-400 ml-auto shrink-0">{activity.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col items-stretch gap-2 shrink-0">
                  <a
                    href={getReportUrl(contact)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 active:bg-red-200 border border-red-200"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t('reportContact') || 'Report Contact'}
                  </a>
                  <button
                    onClick={() => onMarkAsKnown(contact.id)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                      contact.isKnown
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {contact.isKnown ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t('known') || 'Known'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t('markAsKnown') || 'Mark as Known'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onViewDetails(contact)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-700 active:bg-teal-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t('viewDetails') || 'View Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  Cross-Platform Matches Tab                                         */
/* ================================================================== */

function CrossPlatformTab({
  matches,
  contacts,
  onMarkAsKnown: _onMarkAsKnown,
  onViewDetails: _onViewDetails,
  t,
}: {
  matches: CrossPlatformMatch[];
  contacts: Contact[];
  onMarkAsKnown: (id: string) => void;
  onViewDetails: (c: Contact) => void;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl bg-teal-50 border border-teal-200 p-4">
        <Link2 className="w-5 h-5 text-teal-600 shrink-0" />
        <p className="text-sm text-teal-700 font-medium">
          {t('crossPlatformInfo')}
        </p>
      </div>

      {matches.map((match) => {
        const riskStyle = RISK_STYLES[match.combinedRisk];
        const contact1 = contacts.find((c) => c.username === match.contact1.username);
        const contact2 = contacts.find((c) => c.username === match.contact2.username);

        return (
          <div
            key={match.id}
            className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md"
          >
            <div className="p-6">
              {/* Match header */}
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-teal-600" />
                  {t('crossPlatformMatch') || 'Cross-Platform Match'}
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${riskStyle.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${riskStyle.dot}`} />
                  Combined Risk:{' '}
                  {match.combinedRisk === 'high'
                    ? (t('highRisk') || 'HIGH')
                    : match.combinedRisk === 'medium'
                      ? (t('mediumRisk') || 'MEDIUM')
                      : (t('lowRisk') || 'LOW')}
                </span>
              </div>

              {/* Visual connection between two accounts */}
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                {/* Account 1 */}
                <div className={`flex-1 rounded-xl border-l-4 ${riskStyle.border} bg-slate-50 p-4 border border-slate-200`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${PLATFORM_COLORS[match.contact1.platform]} text-white text-xs font-bold shrink-0 shadow-sm`}
                    >
                      {match.contact1.platform.slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{match.contact1.username}</p>
                      <p className="text-xs text-slate-400">{match.contact1.platform}</p>
                    </div>
                  </div>
                  {contact1 && (
                    <p className="mt-2 text-xs text-slate-500">{contact1.notes}</p>
                  )}
                </div>

                {/* Connection line */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="w-12 sm:w-16 h-0.5 bg-teal-400 relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white shadow-sm" />
                  </div>
                  <span className="text-[10px] text-teal-600 font-semibold">{t('samePerson') || 'SAME PERSON'}</span>
                </div>

                {/* Account 2 */}
                <div className={`flex-1 rounded-xl border-l-4 ${riskStyle.border} bg-slate-50 p-4 border border-slate-200`}>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${PLATFORM_COLORS[match.contact2.platform]} text-white text-xs font-bold shrink-0 shadow-sm`}
                    >
                      {match.contact2.platform.slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{match.contact2.username}</p>
                      <p className="text-xs text-slate-400">{match.contact2.platform}</p>
                    </div>
                  </div>
                  {contact2 && (
                    <p className="mt-2 text-xs text-slate-500">{contact2.notes}</p>
                  )}
                </div>
              </div>

              {/* View Details button */}
              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => {
                    const contact = contact1 || contact2;
                    if (contact) _onViewDetails(contact);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 active:bg-teal-800"
                >
                  <Eye className="w-4 h-4" />
                  {t('viewDetails') || 'View Details'}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  Contact Detail Panel                                                */
/* ================================================================== */

function ContactDetailPanel({
  contact,
  onClose,
  onMarkAsKnown,
  getReportUrl,
  t,
}: {
  contact: Contact;
  onClose: () => void;
  onMarkAsKnown: (id: string) => void;
  getReportUrl: (c: Contact) => string;
  t: (key: string) => string;
}) {
  const effectiveRisk: RiskLevel = contact.isKnown ? 'low' : contact.risk;
  const style = RISK_STYLES[effectiveRisk];

  return (
    <>
      {/* Mobile: overlay backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
        onClick={onClose}
      />

      {/* Desktop: side panel | Mobile: bottom sheet */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl overflow-y-auto lg:rounded-l-2xl lg:my-4 lg:mr-4 lg:max-h-[calc(100vh-2rem)]">
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              {t('contactDetails') || 'Contact Details'}
            </h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact identity */}
          <div className={`rounded-xl border-l-4 ${style.border} bg-slate-50 p-5 border border-slate-200`}>
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${PLATFORM_COLORS[contact.platform]} text-white text-lg font-bold shadow-md`}
              >
                {contact.platform.slice(0, 2)}
              </span>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{contact.username}</h3>
                <p className="text-sm text-slate-500">{contact.platform}</p>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold mt-1 ${style.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                  {effectiveRisk === 'high'
                    ? (t('highRisk') || 'HIGH RISK')
                    : effectiveRisk === 'medium'
                      ? (t('mediumRisk') || 'MEDIUM RISK')
                      : contact.isKnown
                        ? (t('known') || 'KNOWN')
                        : (t('lowRisk') || 'LOW RISK')}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{contact.notes}</p>
          </div>

          {/* Cross-platform connections */}
          {contact.crossPlatformMatch && (
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-4">
              <h4 className="text-sm font-semibold text-teal-800 flex items-center gap-2 mb-3">
                <Link2 className="w-4 h-4 text-teal-600" />
                {t('crossPlatformConnections') || 'Cross-Platform Connections'}
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${PLATFORM_COLORS[contact.platform]} text-white text-xs font-bold`}
                  >
                    {contact.platform.slice(0, 2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{contact.username}</span>
                </div>
                <div className="flex items-center gap-1 text-teal-600">
                  <div className="w-6 h-0.5 bg-teal-400" />
                  <Link2 className="w-4 h-4" />
                  <div className="w-6 h-0.5 bg-teal-400" />
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${PLATFORM_COLORS[contact.crossPlatformMatch.platform]} text-white text-xs font-bold`}
                  >
                    {contact.crossPlatformMatch.platform.slice(0, 2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{contact.crossPlatformMatch.username}</span>
                </div>
              </div>
            </div>
          )}

          {/* Activity history */}
          {contact.activityHistory && contact.activityHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-teal-600" />
                {t('activityHistory') || 'Activity History'}
              </h4>
              <div className="space-y-2">
                {contact.activityHistory.map((activity) => {
                  const Icon = ACTIVITY_ICONS[activity.type] || MessageCircle;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 border border-slate-100"
                    >
                      <div className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-md bg-slate-200 shrink-0">
                        <Icon className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700">{activity.description}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Flagged content */}
          {contact.flaggedContent && contact.flaggedContent.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                {t('flaggedContent') || 'Flagged Content'}
              </h4>
              <div className="space-y-2">
                {contact.flaggedContent.map((content, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 rounded-lg bg-red-50 p-3 border border-red-100"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 italic">{content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
            <a
              href={getReportUrl(contact)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-red-500/25 transition-all hover:shadow-lg hover:from-red-600 hover:to-red-700 active:scale-[0.98]"
            >
              <Shield className="w-4 h-4" />
              {t('reportContact') || 'Report Contact'}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => onMarkAsKnown(contact.id)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                contact.isKnown
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200'
                  : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md shadow-slate-600/25 hover:shadow-lg hover:from-slate-500 hover:to-slate-600'
              }`}
            >
              {contact.isKnown ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t('known') || 'Known'}
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {t('markAsKnown') || 'Mark as Known'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
