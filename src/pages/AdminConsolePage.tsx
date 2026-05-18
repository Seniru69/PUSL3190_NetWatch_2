import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  Shield,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreVertical,
  Bell,
  User,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  MapPin,
  Send,
  X,
  Plus,
  Trash2,
  Database,
  Wifi,
  HardDrive,
  RefreshCw,
  Monitor,
  Globe,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AdminTab = 'dashboard' | 'reports' | 'moderation' | 'community' | 'settings';

type ReportStatus = 'Pending' | 'Reviewed' | 'Actioned' | 'Dismissed';
type ReportFilter = 'all' | 'Pending' | 'Reviewed' | 'Actioned' | 'Dismissed';
type ReportType = 'Post Report' | 'User Report' | 'Content Review';

type Verification = 'verified' | 'under_review' | 'pending' | 'false_info';
type Platform = 'Roblox' | 'Discord' | 'Instagram' | 'TikTok' | 'Snapchat' | 'Other';
type Category = 'Grooming' | 'Cyberbullying' | 'Harmful Content' | 'Scam' | 'Other';
type VoteState = 'none' | 'up' | 'down';
type AlertFrequency = 'Immediate' | 'Hourly' | 'Daily';

interface Report {
  id: number;
  reportNumber: number;
  target: string;
  targetType: 'Post' | 'User';
  reporter: string;
  status: ReportStatus;
  type: ReportType;
  time: string;
  description: string;
}

interface ModerationItem {
  id: number;
  title: string;
  author: string;
  platform: Platform;
  time: string;
  status: Verification;
  description: string;
  image: string | null;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

interface CommunityPost {
  id: number;
  author: string;
  verification: Verification;
  title: string;
  description: string;
  platform: Platform;
  category: Category;
  location: string;
  image: string | null;
  upvotes: number;
  downvotes: number;
  time: string;
  comments: Comment[];
}

interface Moderator {
  id: number;
  name: string;
  email: string;
  status: 'Active' | 'Inactive';
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: { key: AdminTab; labelKey: string; Icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', labelKey: 'dashboard', Icon: LayoutDashboard },
  { key: 'reports', labelKey: 'reports', Icon: FileText },
  { key: 'moderation', labelKey: 'moderationQueue', Icon: Shield },
  { key: 'community', labelKey: 'community', Icon: Users },
  { key: 'settings', labelKey: 'adminSettings', Icon: Settings },
];

const REPORT_STATUS_CONFIG: Record<ReportStatus, { bg: string; text: string; dot: string }> = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Reviewed: { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-500' },
  Actioned: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Dismissed: { bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400' },
};

const VERIFICATION_CONFIG: Record<Verification, { bg: string; text: string; labelKey: string; Icon: typeof CheckCircle }> = {
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', labelKey: 'safe', Icon: CheckCircle },
  under_review: { bg: 'bg-amber-100', text: 'text-amber-700', labelKey: 'markUnderReview', Icon: Clock },
  pending: { bg: 'bg-slate-100', text: 'text-slate-500', labelKey: 'pendingVerifications', Icon: Clock },
  false_info: { bg: 'bg-red-100', text: 'text-red-700', labelKey: 'markFalseInfo', Icon: XCircle },
};

const PLATFORM_COLORS: Record<Platform, { bg: string; text: string }> = {
  Roblox: { bg: 'bg-red-100', text: 'text-red-700' },
  Discord: { bg: 'bg-sky-100', text: 'text-sky-700' },
  Instagram: { bg: 'bg-pink-100', text: 'text-pink-700' },
  TikTok: { bg: 'bg-slate-100', text: 'text-slate-700' },
  Snapchat: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  Other: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const PLATFORM_ACCENT: Record<Platform, string> = {
  Roblox: 'bg-red-500',
  Discord: 'bg-sky-500',
  Instagram: 'bg-pink-500',
  TikTok: 'bg-slate-800',
  Snapchat: 'bg-yellow-400',
  Other: 'bg-gray-500',
};

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  Grooming: { bg: 'bg-red-50', text: 'text-red-700' },
  Cyberbullying: { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Harmful Content': { bg: 'bg-rose-50', text: 'text-rose-700' },
  Scam: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-700' },
};

/* ------------------------------------------------------------------ */
/*  Sample Data                                                        */
/* ------------------------------------------------------------------ */

const INITIAL_REPORTS: Report[] = [
  {
    id: 1,
    reportNumber: 1042,
    target: "Suspicious user in Roblox",
    targetType: 'Post',
    reporter: 'Nimal Perera',
    status: 'Pending',
    type: 'Post Report',
    time: '5 min ago',
    description: "A user has been approaching children in the Roblox Adopt Me server, asking them to switch to private messages and share personal photos. They claim to be a teenager but their profile suggests otherwise.",
  },
  {
    id: 2,
    reportNumber: 1041,
    target: "FakeAccount_23",
    targetType: 'User',
    reporter: 'Sanduni Fernando',
    status: 'Pending',
    type: 'User Report',
    time: '1 hour ago',
    description: "This account has been sending friend requests to children and sharing inappropriate content. Profile appears to be impersonating a minor.",
  },
  {
    id: 3,
    reportNumber: 1040,
    target: "Cyberbullying on Discord",
    targetType: 'Post',
    reporter: 'Ruwan Silva',
    status: 'Reviewed',
    type: 'Content Review',
    time: '3 hours ago',
    description: "A group of users on Discord have been coordinating bullying attacks against children in gaming servers. They use derogatory language and threaten victims.",
  },
  {
    id: 4,
    reportNumber: 1039,
    target: "Spammer_2024",
    targetType: 'User',
    reporter: 'Kumari Jayawardena',
    status: 'Actioned',
    type: 'User Report',
    time: '5 hours ago',
    description: "This user has been spamming multiple channels with scam links targeting children. Account has been suspended.",
  },
  {
    id: 5,
    reportNumber: 1038,
    target: "Scam on Snapchat",
    targetType: 'Post',
    reporter: 'Tharanga Bandara',
    status: 'Dismissed',
    type: 'Post Report',
    time: '1 day ago',
    description: "Reported scam post on Snapchat was found to be a legitimate promotion after review. No evidence of malicious intent found.",
  },
];

const INITIAL_MODERATION_ITEMS: ModerationItem[] = [
  {
    id: 1,
    title: "Fake Instagram account impersonating a child's friend",
    author: 'Ruwan Silva',
    platform: 'Instagram',
    time: '8 hours ago',
    status: 'pending',
    description: "An account has been created that closely mimics a child's friend's account. It's been sending friend requests to her contacts and sharing inappropriate content.",
    image: null,
  },
  {
    id: 2,
    title: 'New grooming pattern on TikTok',
    author: 'Anura Dissanayake',
    platform: 'TikTok',
    time: '12 hours ago',
    status: 'pending',
    description: "A user has been leaving seemingly innocent comments on children's TikTok videos, then moving to DMs to ask for personal information and photos.",
    image: 'https://images.pexels.com/photos/60626/pexels-photo-60626.jpeg',
  },
  {
    id: 3,
    title: 'Suspicious group on Discord',
    author: 'Chathuranga Perera',
    platform: 'Discord',
    time: '1 day ago',
    status: 'under_review',
    description: 'A private Discord server has been flagged for suspicious activity. Multiple adult users appear to be interacting with minors in private channels.',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
  },
];

const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 1,
    author: 'Nimal Perera',
    verification: 'verified',
    title: "Suspicious user 'ShadowLad' in Roblox 'Adopt Me' server",
    description:
      "This user has been approaching children in the Adopt Me server, asking them to switch to private messages and share personal photos. They claim to be a teenager but their profile suggests otherwise.",
    platform: 'Roblox',
    category: 'Grooming',
    location: 'Colombo',
    image: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
    upvotes: 24,
    downvotes: 2,
    time: '2 hours ago',
    comments: [
      { id: 1, author: 'Priyantha Dias', text: "Thank you for sharing this. My child plays Roblox too and I'll be watching out.", time: '1 hour ago' },
      { id: 2, author: 'Malini Rajapaksa', text: "I've seen this user too. Very concerning behavior.", time: '45 min ago' },
      { id: 3, author: 'Asanka Kumara', text: 'Reported to SLCERT already. Please do the same.', time: '30 min ago' },
    ],
  },
  {
    id: 2,
    author: 'Sanduni Fernando',
    verification: 'under_review',
    title: 'Cyberbullying ring on Discord targeting young teens',
    description:
      'A group of users on Discord have been coordinating bullying attacks against children in gaming servers. They use derogatory language and threaten victims.',
    platform: 'Discord',
    category: 'Cyberbullying',
    location: 'Kandy',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    upvotes: 18,
    downvotes: 1,
    time: '5 hours ago',
    comments: [
      { id: 1, author: 'Dilshan Weerasinghe', text: 'This is very alarming. My son uses Discord daily for school group projects.', time: '3 hours ago' },
      { id: 2, author: 'Chamari Perera', text: 'We need to report this to the school authorities as well.', time: '2 hours ago' },
    ],
  },
  {
    id: 3,
    author: 'Ruwan Silva',
    verification: 'pending',
    title: "Fake Instagram account impersonating a child's friend",
    description:
      "An account has been created that closely mimics my daughter's friend's account. It's been sending friend requests to her contacts and sharing inappropriate content.",
    platform: 'Instagram',
    category: 'Harmful Content',
    location: 'Galle',
    image: null,
    upvotes: 12,
    downvotes: 0,
    time: '8 hours ago',
    comments: [
      { id: 1, author: 'Lakshmi Nanayakkara', text: 'The same thing happened to my niece last month. These accounts need to be taken down faster.', time: '6 hours ago' },
    ],
  },
  {
    id: 4,
    author: 'Kumari Jayawardena',
    verification: 'verified',
    title: 'Predator using TikTok comments to contact children',
    description:
      "A user has been leaving seemingly innocent comments on children's TikTok videos, then moving to DMs to ask for personal information and photos.",
    platform: 'TikTok',
    category: 'Grooming',
    location: 'Colombo',
    image: 'https://images.pexels.com/photos/60626/pexels-photo-60626.jpeg',
    upvotes: 31,
    downvotes: 3,
    time: '12 hours ago',
    comments: [
      { id: 1, author: 'Tharindu Gamage', text: "This pattern is becoming more common on TikTok. Parents need to check their children's DMs regularly.", time: '10 hours ago' },
      { id: 2, author: 'Ishara Weerakoon', text: 'I reported a similar account last week. TikTok needs to do better.', time: '9 hours ago' },
      { id: 3, author: 'Nadeesha Fernando', text: "Thank you for the warning. I have now restricted DMs on my child's account.", time: '8 hours ago' },
      { id: 4, author: 'Roshan Wijesekera', text: 'Is there a way to block DMs from non-followers on TikTok?', time: '7 hours ago' },
    ],
  },
  {
    id: 5,
    author: 'Tharanga Bandara',
    verification: 'verified',
    title: 'Scam on Snapchat asking for gift card codes',
    description:
      'Multiple users on Snapchat have been asking children to purchase and share gift card codes in exchange for in-game items. This is a known scam pattern.',
    platform: 'Snapchat',
    category: 'Scam',
    location: 'Colombo',
    image: null,
    upvotes: 15,
    downvotes: 1,
    time: '1 day ago',
    comments: [
      { id: 1, author: 'Supun Rathnayake', text: 'My daughter was targeted by this. They promised Robux in exchange for gift cards.', time: '20 hours ago' },
      { id: 2, author: 'Anusha Kumari', text: 'Parents should educate their children about these scams. The promise of free items is tempting for kids.', time: '18 hours ago' },
    ],
  },
];

const INITIAL_MODERATORS: Moderator[] = [
  { id: 1, name: 'Dr. Kamal Perera', email: 'kamal.perera@netwatch.lk', status: 'Active' },
  { id: 2, name: 'Nimali Fernando', email: 'nimali.f@netwatch.lk', status: 'Active' },
  { id: 3, name: 'Saman Kumara', email: 'saman.k@netwatch.lk', status: 'Inactive' },
];

const ACTIVITY_FEED = [
  { id: 1, text: 'New report submitted by Nimal Perera', time: '5 min ago', Icon: FileText as typeof FileText, color: 'text-amber-600' },
  { id: 2, text: "Post verified: 'Suspicious user in Roblox'", time: '15 min ago', Icon: CheckCircle as typeof CheckCircle, color: 'text-emerald-600' },
  { id: 3, text: 'New user registered: Sanduni Fernando', time: '1 hour ago', Icon: User as typeof User, color: 'text-sky-600' },
  { id: 4, text: 'Report dismissed: False alarm on Instagram', time: '2 hours ago', Icon: XCircle as typeof XCircle, color: 'text-slate-500' },
  { id: 5, text: 'Community alert sent: Grooming pattern on Discord', time: '3 hours ago', Icon: Bell as typeof Bell, color: 'text-red-600' },
];

/* ------------------------------------------------------------------ */
/*  Helper Components                                                  */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 animate-in fade-in max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function VerificationBadge({ verification }: { verification: Verification }) {
  const { t } = useApp();
  const config = VERIFICATION_CONFIG[verification];
  const { Icon } = config;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {t(config.labelKey)}
    </span>
  );
}

function StatusBadge({ status }: { status: ReportStatus }) {
  const config = REPORT_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

/* ================================================================== */
/*  Admin Dashboard                                                    */
/* ================================================================== */

function AdminDashboard({ onNavigate }: { onNavigate: (tab: AdminTab) => void }) {
  const { t } = useApp();

  const stats = [
    { label: t('totalUsers'), value: '1,247', Icon: Users, color: 'from-slate-600 to-slate-700', iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
    { label: t('reportsToReview'), value: '23', Icon: FileText, color: 'from-amber-500 to-amber-600', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', onClick: () => onNavigate('reports') },
    { label: t('pendingVerifications'), value: '8', Icon: Shield, color: 'from-teal-600 to-teal-700', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
    { label: t('activeAlertsCount'), value: '156', Icon: AlertTriangle, color: 'from-red-500 to-red-600', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  ];

  const quickActions = [
    { label: t('reviewReport'), Icon: FileText, onClick: () => onNavigate('reports'), color: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200' },
    { label: t('moderationQueue'), Icon: Shield, onClick: () => onNavigate('moderation'), color: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200' },
    { label: t('activeMonitoring'), Icon: Bell, onClick: () => onNavigate('community'), color: 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button
            key={stat.label}
            onClick={stat.onClick}
            disabled={!stat.onClick}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-5 text-left shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${stat.onClick ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.iconBg}`}>
                <stat.Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            {stat.onClick && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            {t('dashboard')}
          </h2>
          <div className="mt-4 space-y-4">
            {ACTIVITY_FEED.map((item, idx) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-50 shrink-0">
                  <item.Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{item.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                </div>
                {idx < ACTIVITY_FEED.length - 1 && (
                  <div className="absolute left-6 mt-9 w-px h-4 bg-slate-100 hidden" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-teal-600" />
            {t('activeMonitoring')}
          </h2>
          <div className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`flex items-center gap-3 w-full rounded-xl border px-4 py-3.5 text-sm font-semibold transition-all ${action.color}`}
              >
                <action.Icon className="w-5 h-5" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Reports Page                                                       */
/* ================================================================== */

function ReportsPage() {
  const { t } = useApp();
  const [filter, setFilter] = useState<ReportFilter>('all');
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  const filterTabs: { key: ReportFilter; labelKey: string }[] = [
    { key: 'all', labelKey: 'all' },
    { key: 'Pending', labelKey: 'caution' },
    { key: 'Reviewed', labelKey: 'reviewReport' },
    { key: 'Actioned', labelKey: 'actionReport' },
    { key: 'Dismissed', labelKey: 'dismissReport' },
  ];

  const filteredReports = filter === 'all'
    ? reports
    : reports.filter((r) => r.status === filter);

  const handleReview = (report: Report) => {
    setSelectedReport(report);
    setAdminNotes('');
    setShowDetailModal(true);
  };

  const handleStatusChange = (reportId: number, newStatus: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    setShowDetailModal(false);
    setSelectedReport(null);
  };

  const counts = {
    all: reports.length,
    Pending: reports.filter((r) => r.status === 'Pending').length,
    Reviewed: reports.filter((r) => r.status === 'Reviewed').length,
    Actioned: reports.filter((r) => r.status === 'Actioned').length,
    Dismissed: reports.filter((r) => r.status === 'Dismissed').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            {t('reports')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{t('reviewReport')}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-teal-700 text-white shadow-md shadow-teal-700/25'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {t(tab.labelKey)}
            <span className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-xs font-bold ${
              filter === tab.key
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('reports')}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('view')}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('search')}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('filter')}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('caution')}</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('dashboard')}</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('actionReport')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-800">#{report.reportNumber}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${report.targetType === 'Post' ? 'bg-sky-100 text-sky-600' : 'bg-violet-100 text-violet-600'}`}>
                        {report.targetType === 'Post' ? <FileText className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-sm text-slate-700 font-medium truncate max-w-[200px]">{report.target}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">{report.reporter}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 rounded-lg px-2.5 py-1">{report.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-400">{report.time}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleReview(report)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {t('reviewReport')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'Dismissed')}
                        disabled={report.status === 'Dismissed'}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {t('dismissReport')}
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'Actioned')}
                        disabled={report.status === 'Actioned'}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {t('actionReport')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500 font-medium">{t('filter')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Detail Modal */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)}>
        {selectedReport && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-100">
                  <FileText className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{t('reports')} #{selectedReport.reportNumber}</h3>
                  <p className="text-xs text-slate-400">{selectedReport.type}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Report Info */}
            <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">{t('caution')}</span>
                <StatusBadge status={selectedReport.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">{t('view')}</span>
                <span className="text-sm text-slate-700 font-medium">{selectedReport.targetType}: {selectedReport.target}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">{t('search')}</span>
                <span className="text-sm text-slate-700">{selectedReport.reporter}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">{t('submit')}</span>
                <span className="text-sm text-slate-700">{selectedReport.time}</span>
              </div>
            </div>

            {/* Reported Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('reports')}</label>
              <p className="text-sm text-slate-600 leading-relaxed bg-white rounded-lg border border-slate-200 p-3">
                {selectedReport.description}
              </p>
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('adminNotes')}</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder={t('adminNotes')}
                rows={3}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleStatusChange(selectedReport.id, 'Dismissed')}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                {t('dismissReport')}
              </button>
              <button
                onClick={() => handleStatusChange(selectedReport.id, 'Reviewed')}
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t('reviewReport')}
              </button>
              <button
                onClick={() => handleStatusChange(selectedReport.id, 'Actioned')}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                {t('actionReport')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ================================================================== */
/*  Moderation Queue Page                                              */
/* ================================================================== */

function ModerationQueuePage() {
  const { t } = useApp();
  const [items, setItems] = useState<ModerationItem[]>(INITIAL_MODERATION_ITEMS);

  const handleVerification = (id: number, newStatus: Verification) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Shield className="w-6 h-6 text-teal-600" />
          {t('moderationQueue')}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{t('verifyPost')}</p>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => {
          const platColor = PLATFORM_COLORS[item.platform];
          return (
            <div key={item.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-slate-300">
              <div className="flex flex-col sm:flex-row">
                {/* Image */}
                {item.image && (
                  <div className="sm:w-56 h-48 sm:h-auto overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${platColor.bg} ${platColor.text}`}>
                          {item.platform}
                        </span>
                        <VerificationBadge verification={item.status} />
                      </div>
                      <h3 className="font-bold text-slate-800 leading-snug">{item.title}</h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {item.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {item.time}
                    </span>
                  </div>

                  {/* Verification Buttons */}
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleVerification(item.id, 'verified')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        item.status === 'verified'
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {t('verifyPost')}
                    </button>
                    <button
                      onClick={() => handleVerification(item.id, 'under_review')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        item.status === 'under_review'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                      {t('markUnderReview')}
                    </button>
                    <button
                      onClick={() => handleVerification(item.id, 'false_info')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                        item.status === 'false_info'
                          ? 'bg-red-600 text-white shadow-md'
                          : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      {t('markFalseInfo')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">{t('moderationQueue')}</p>
            <p className="text-sm text-slate-400 mt-1">{t('verifyPost')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Admin Community Page                                               */
/* ================================================================== */

function AdminCommunityPage() {
  const { t, profile: _profile } = useApp();

  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);
  const [voteStates, setVoteStates] = useState<Record<number, VoteState>>({});
  const [commentsOpenId, setCommentsOpenId] = useState<number | null>(null);
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [adminMenuOpenId, setAdminMenuOpenId] = useState<number | null>(null);

  const handleVote = (postId: number, type: 'up' | 'down') => {
    setVoteStates((prev) => {
      const current = prev[postId] || 'none';
      if (type === 'up') {
        return { ...prev, [postId]: current === 'up' ? 'none' : 'up' };
      } else {
        return { ...prev, [postId]: current === 'down' ? 'none' : 'down' };
      }
    });
  };

  const handleAdminVerification = (postId: number, verification: Verification) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, verification } : p))
    );
    setAdminMenuOpenId(null);
  };

  const handleAddComment = (postId: number) => {
    const text = (newComments[postId] || '').trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: Date.now(),
              author: 'Admin',
              text,
              time: 'Just now',
            },
          ],
        };
      })
    );
    setNewComments((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-600" />
          {t('moderationQueue')}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{t('verifyPost')}</p>
      </div>

      {/* Posts */}
      <div className="space-y-5">
        {posts.map((post) => {
          const platColor = PLATFORM_COLORS[post.platform];
          const catColor = CATEGORY_COLORS[post.category];
          const voteState = voteStates[post.id] || 'none';

          return (
            <div key={post.id} className="rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300 overflow-hidden">
              {/* Image */}
              {post.image && (
                <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold text-white shadow-sm ${PLATFORM_ACCENT[post.platform]}`}>
                      {post.platform}
                    </span>
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${catColor.bg} ${catColor.text}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-5 space-y-4">
                {/* Header: Author + Admin Menu */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-sm shrink-0">
                      {post.author.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-sm truncate">{post.author}</span>
                        <VerificationBadge verification={post.verification} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.time}</span>
                        {post.location && (
                          <>
                            <span className="text-slate-300">|</span>
                            <MapPin className="w-3 h-3" />
                            <span>{post.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin 3-dot menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setAdminMenuOpenId(adminMenuOpenId === post.id ? null : post.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {adminMenuOpenId === post.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setAdminMenuOpenId(null)} />
                        <div className="absolute right-0 top-8 z-20 w-52 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 overflow-hidden">
                          <button
                            onClick={() => handleAdminVerification(post.id, 'verified')}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {t('safe')}
                          </button>
                          <button
                            onClick={() => handleAdminVerification(post.id, 'under_review')}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            <Clock className="w-4 h-4" />
                            {t('markUnderReview')}
                          </button>
                          <button
                            onClick={() => handleAdminVerification(post.id, 'false_info')}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                            {t('markFalseInfo')}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges row (when no image) */}
                {!post.image && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${platColor.bg} ${platColor.text}`}>
                      {post.platform}
                    </span>
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${catColor.bg} ${catColor.text}`}>
                      {post.category}
                    </span>
                  </div>
                )}

                {/* Title & Description */}
                <div>
                  <h3 className="font-bold text-slate-800 leading-snug">{post.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{post.description}</p>
                </div>

                {/* Location (if no image) */}
                {!post.image && post.location && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{post.location}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVote(post.id, 'up')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all ${
                        voteState === 'up'
                          ? 'bg-teal-50 text-teal-600'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${voteState === 'up' ? 'fill-teal-500' : ''}`} />
                      <span>{post.upvotes + (voteState === 'up' ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => handleVote(post.id, 'down')}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all ${
                        voteState === 'down'
                          ? 'bg-red-50 text-red-600'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                      }`}
                    >
                      <ThumbsDown className={`w-4 h-4 ${voteState === 'down' ? 'fill-red-500' : ''}`} />
                      <span>{post.downvotes + (voteState === 'down' ? 1 : 0)}</span>
                    </button>
                    <button
                      onClick={() => setCommentsOpenId(commentsOpenId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {commentsOpenId === post.id && (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs shrink-0">
                          {comment.author.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700">{comment.author}</span>
                            <span className="text-xs text-slate-400">{comment.time}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder={t('adminNotes')}
                        className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={!((newComments[post.id] || '').trim())}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Admin Settings Page                                                */
/* ================================================================== */

function AdminSettingsPage() {
  const { t } = useApp();

  // General Settings
  const [platformToggles, setPlatformToggles] = useState<Record<string, boolean>>({
    Roblox: true,
    Discord: true,
    Instagram: true,
    TikTok: true,
    Snapchat: false,
  });
  const [autoVerifyThreshold, setAutoVerifyThreshold] = useState(75);
  const [reportAutoDismiss, setReportAutoDismiss] = useState(false);

  // Moderation Settings
  const [moderators, setModerators] = useState<Moderator[]>(INITIAL_MODERATORS);
  const [showAddModModal, setShowAddModModal] = useState(false);
  const [newModName, setNewModName] = useState('');
  const [newModEmail, setNewModEmail] = useState('');
  const [verificationTimeout, setVerificationTimeout] = useState('2');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [alertFrequency, setAlertFrequency] = useState<AlertFrequency>('Immediate');

  const handleTogglePlatform = (platform: string) => {
    setPlatformToggles((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleAddModerator = () => {
    if (!newModName.trim() || !newModEmail.trim()) return;
    setModerators((prev) => [
      ...prev,
      { id: Date.now(), name: newModName.trim(), email: newModEmail.trim(), status: 'Active' },
    ]);
    setNewModName('');
    setNewModEmail('');
    setShowAddModModal(false);
  };

  const handleRemoveModerator = (id: number) => {
    setModerators((prev) => prev.filter((m) => m.id !== id));
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-teal-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-5.5' : 'translate-x-1'
        }`}
        style={{ width: '18px', height: '18px', transform: enabled ? 'translateX(22px)' : 'translateX(4px)' }}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600" />
          {t('adminSettings')}
        </h2>
        <p className="text-sm text-slate-500 mt-1">{t('monitoringActiveDesc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-teal-600" />
            {t('adminSettings')}
          </h3>

          {/* Platform Monitoring Toggles */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">{t('activeMonitoring')}</label>
            <div className="space-y-3">
              {Object.entries(platformToggles).map(([platform, enabled]) => (
                <div key={platform} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50/50">
                  <span className="text-sm font-medium text-slate-700">{platform}</span>
                  <Toggle enabled={enabled} onToggle={() => handleTogglePlatform(platform)} />
                </div>
              ))}
            </div>
          </div>

          {/* Auto-verification Threshold */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t('verifyPost')}: <span className="text-teal-600">{autoVerifyThreshold}%</span>
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={autoVerifyThreshold}
              onChange={(e) => setAutoVerifyThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
              <span>1%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Report Auto-dismissal */}
          <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
            <div>
              <p className="text-sm font-medium text-slate-700">{t('dismissReport')}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t('monitoringPausedDesc')}</p>
            </div>
            <Toggle enabled={reportAutoDismiss} onToggle={() => setReportAutoDismiss(!reportAutoDismiss)} />
          </div>
        </div>

        {/* Moderation Settings */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-600" />
            {t('moderationQueue')}
          </h3>

          {/* Moderator List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700">{t('moderationQueue')}</label>
              <button
                onClick={() => setShowAddModModal(true)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('moderationQueue')}
              </button>
            </div>
            <div className="space-y-2">
              {moderators.map((mod) => (
                <div key={mod.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-slate-50/50">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-xs shrink-0">
                      {mod.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{mod.name}</p>
                      <p className="text-xs text-slate-400 truncate">{mod.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mod.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {mod.status}
                    </span>
                    <button
                      onClick={() => handleRemoveModerator(mod.id)}
                      className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Timeout */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('markUnderReview')}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={verificationTimeout}
                onChange={(e) => setVerificationTimeout(e.target.value)}
                min={1}
                max={72}
                className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
              />
              <span className="text-sm text-slate-500">hours</span>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-teal-600" />
            {t('activeAlertsCount')}
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
              <div>
                <p className="text-sm font-medium text-slate-700">{t('activeAlertsCount')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('monitoringActiveDesc')}</p>
              </div>
              <Toggle enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
              <div>
                <p className="text-sm font-medium text-slate-700">{t('activeMonitoring')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t('monitoringPausedDesc')}</p>
              </div>
              <Toggle enabled={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} />
            </div>

            <div className="py-3 px-4 rounded-lg bg-slate-50/50">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('activeAlertsCount')}</label>
              <select
                value={alertFrequency}
                onChange={(e) => setAlertFrequency(e.target.value as AlertFrequency)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all appearance-none cursor-pointer"
              >
                <option value="Immediate">Immediate</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            {t('dashboard')}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{t('dashboard')}</p>
                  <p className="text-xs text-slate-400">{t('monitoringActiveDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800">2.4 GB</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Wifi className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{t('activeMonitoring')}</p>
                  <p className="text-xs text-slate-400">{t('monitoringActiveDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800">342</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{t('save')}</p>
                  <p className="text-xs text-slate-400">{t('monitoringPausedDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-800">2 hours ago</span>
            </div>

            <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{t('dashboard')}</p>
                  <p className="text-xs text-slate-400">{t('monitoringActiveDesc')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-emerald-600">99.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Moderator Modal */}
      <Modal open={showAddModModal} onClose={() => setShowAddModModal(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-100">
                <User className="w-5 h-5 text-teal-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{t('moderationQueue')}</h3>
            </div>
            <button
              onClick={() => setShowAddModModal(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('adminNotes')}</label>
            <input
              type="text"
              value={newModName}
              onChange={(e) => setNewModName(e.target.value)}
              placeholder={t('adminNotes')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('search')}</label>
            <input
              type="email"
              value={newModEmail}
              onChange={(e) => setNewModEmail(e.target.value)}
              placeholder={t('search')}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowAddModModal(false)}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleAddModerator}
              disabled={!newModName.trim() || !newModEmail.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {t('moderationQueue')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ================================================================== */
/*  Main AdminConsolePage Component                                    */
/* ================================================================== */

export default function AdminConsolePage() {
  const { t, language, setLanguage, profile: _profile, signOut } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setActiveTab} />;
      case 'reports':
        return <ReportsPage />;
      case 'moderation':
        return <ModerationQueuePage />;
      case 'community':
        return <AdminCommunityPage />;
      case 'settings':
        return <AdminSettingsPage />;
      default:
        return <AdminDashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200/80 bg-white/80 backdrop-blur-sm flex flex-col">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight">NetWatch</h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{t('adminConsole')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-3 w-full rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-700 text-white shadow-md shadow-slate-700/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <item.Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {t(item.labelKey)}
              </button>
            );
          })}
        </nav>

        {/* Language Toggle */}
        <div className="px-5 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">{t('language')}:</span>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
                  language === 'en' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
                  language === 'si' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                සිං
              </button>
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="px-5 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-700 text-white font-bold text-sm shrink-0">
              N
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">Nimal Perera</p>
              <p className="text-xs text-slate-400 truncate">nimal.perera@netwatch.lk</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
