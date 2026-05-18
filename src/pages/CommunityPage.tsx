import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Eye,
  Clock,
  MapPin,
  Shield,
  AlertTriangle,
  Send,
  X,
  Plus,
  CheckCircle,
  HelpCircle,
  XCircle,
  Flag,
  Bookmark,
  EyeOff,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Verification = 'verified' | 'under_review' | 'pending' | 'false_info';
type Platform = 'Roblox' | 'Discord' | 'Instagram' | 'TikTok' | 'Snapchat' | 'Other';
type Category = 'Grooming' | 'Cyberbullying' | 'Harmful Content' | 'Scam' | 'Other';
type VoteState = 'none' | 'up' | 'down';

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

interface Post {
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

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

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

const VERIFICATION_CONFIG: Record<Verification, { bg: string; text: string; labelKey: string; Icon: typeof CheckCircle }> = {
  verified: { bg: 'bg-emerald-100', text: 'text-emerald-700', labelKey: 'verified', Icon: CheckCircle },
  under_review: { bg: 'bg-amber-100', text: 'text-amber-700', labelKey: 'underReview', Icon: HelpCircle },
  pending: { bg: 'bg-slate-100', text: 'text-slate-500', labelKey: 'pending', Icon: Clock },
  false_info: { bg: 'bg-red-100', text: 'text-red-700', labelKey: 'falseInformation', Icon: XCircle },
};

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  Grooming: { bg: 'bg-red-50', text: 'text-red-700' },
  Cyberbullying: { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Harmful Content': { bg: 'bg-rose-50', text: 'text-rose-700' },
  Scam: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-700' },
};

const MY_PLATFORMS: Platform[] = ['Roblox', 'Discord', 'Instagram', 'TikTok', 'Snapchat'];
const NEAR_ME_LOCATIONS = ['Colombo', 'Kandy', 'Galle'];

type FilterTab = 'all' | 'verified' | 'my_platforms' | 'near_me';

/* ------------------------------------------------------------------ */
/*  Sample Data                                                        */
/* ------------------------------------------------------------------ */

const INITIAL_POSTS: Post[] = [
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
      { id: 1, author: 'Tharindu Gamage', text: 'This pattern is becoming more common on TikTok. Parents need to check their children\'s DMs regularly.', time: '10 hours ago' },
      { id: 2, author: 'Ishara Weerakoon', text: 'I reported a similar account last week. TikTok needs to do better.', time: '9 hours ago' },
      { id: 3, author: 'Nadeesha Fernando', text: 'Thank you for the warning. I have now restricted DMs on my child\'s account.', time: '8 hours ago' },
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

/* ------------------------------------------------------------------ */
/*  Modal component                                                    */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-8 animate-in fade-in max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Verification Badge                                                 */
/* ------------------------------------------------------------------ */

function VerificationBadge({ verification, t }: { verification: Verification; t: (key: string) => string }) {
  const config = VERIFICATION_CONFIG[verification];
  const { Icon } = config;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text}`}>
      <Icon className="w-3 h-3" />
      {t(config.labelKey)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Post Card                                                          */
/* ------------------------------------------------------------------ */

function PostCard({
  post,
  voteState,
  onVote,
  onMenuAction,
  menuOpen,
  setMenuOpen,
  commentsOpen,
  setCommentsOpen,
  newComment,
  setNewComment,
  onAddComment,
  saved,
  hidden,
  reported,
  t,
}: {
  post: Post;
  voteState: VoteState;
  onVote: (type: 'up' | 'down') => void;
  onMenuAction: (action: 'save' | 'hide' | 'report') => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  commentsOpen: boolean;
  setCommentsOpen: (open: boolean) => void;
  newComment: string;
  setNewComment: (text: string) => void;
  onAddComment: () => void;
  saved: boolean;
  hidden: boolean;
  reported: boolean;
  t: (key: string) => string;
}) {
  const platColor = PLATFORM_COLORS[post.platform];
  const catColor = CATEGORY_COLORS[post.category];

  if (reported) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
        <p className="text-sm text-slate-500">{t('postReported')}</p>
        <button
          onClick={() => onMenuAction('report')}
          className="mt-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          {t('undo')}
        </button>
      </div>
    );
  }

  if (hidden) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
        <p className="text-sm text-slate-500">{t('postHidden')}</p>
        <button
          onClick={() => onMenuAction('hide')}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          {t('unhidePost')}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md hover:border-slate-300 overflow-hidden">
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
        {/* Header: Author + Menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-sm shrink-0">
              {post.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-800 text-sm truncate">{post.author}</span>
                <VerificationBadge verification={post.verification} t={t} />
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

          {/* Three-dot menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 overflow-hidden">
                  <button
                    onClick={() => { onMenuAction('save'); setMenuOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-teal-500 text-teal-500' : 'text-slate-400'}`} />
                    {t('savePost')}
                  </button>
                  <button
                    onClick={() => { onMenuAction('hide'); setMenuOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <EyeOff className="w-4 h-4 text-slate-400" />
                    {t('hidePost')}
                  </button>
                  <button
                    onClick={() => { onMenuAction('report'); setMenuOpen(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Flag className="w-4 h-4" />
                    {t('reportPost')}
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
            {/* Upvote */}
            <button
              onClick={() => onVote('up')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all ${
                voteState === 'up'
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${voteState === 'up' ? 'fill-teal-500' : ''}`} />
              <span>{post.upvotes + (voteState === 'up' ? 1 : 0)}</span>
            </button>

            {/* Downvote */}
            <button
              onClick={() => onVote('down')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all ${
                voteState === 'down'
                  ? 'bg-red-50 text-red-600'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${voteState === 'down' ? 'fill-red-500' : ''}`} />
              <span>{post.downvotes + (voteState === 'down' ? 1 : 0)}</span>
            </button>

            {/* Comments toggle */}
            <button
              onClick={() => setCommentsOpen(!commentsOpen)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments.length}</span>
            </button>
          </div>

          {saved && (
            <span className="flex items-center gap-1 text-xs text-teal-600 font-medium">
              <Bookmark className="w-3.5 h-3.5 fill-teal-500" />
              {t('savePost')}
            </span>
          )}
        </div>

        {/* Comments Section */}
        {commentsOpen && (
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

            {/* Add comment */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('addComment')}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
                onKeyDown={(e) => { if (e.key === 'Enter') onAddComment(); }}
              />
              <button
                onClick={onAddComment}
                disabled={!newComment.trim()}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-teal-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-teal-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  CommunityPage                                                      */
/* ================================================================== */

export default function CommunityPage() {
  const { t, language: _language, profile } = useApp();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [showReportModal, setShowReportModal] = useState(false);

  // Per-post state
  const [voteStates, setVoteStates] = useState<Record<number, VoteState>>({});
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [commentsOpenId, setCommentsOpenId] = useState<number | null>(null);
  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});
  const [hiddenPosts, setHiddenPosts] = useState<Record<number, boolean>>({});
  const [reportedPosts, setReportedPosts] = useState<Record<number, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Report form state
  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    platform: '' as Platform | '',
    category: '' as Category | '',
    location: '',
    imageUrl: '',
  });

  /* ---- Filtering ---- */

  const verifiedCount = posts.filter((p) => p.verification === 'verified').length;

  const filteredPosts = posts.filter((post) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'verified') return post.verification === 'verified';
    if (activeFilter === 'my_platforms') return MY_PLATFORMS.includes(post.platform);
    if (activeFilter === 'near_me') return NEAR_ME_LOCATIONS.includes(post.location);
    return true;
  });

  /* ---- Vote handler ---- */

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

  /* ---- Menu actions ---- */

  const handleMenuAction = (postId: number, action: 'save' | 'hide' | 'report') => {
    if (action === 'save') {
      setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
      if (!savedPosts[postId]) {
        setToastMessage(t('savePost'));
        setTimeout(() => setToastMessage(null), 3000);
      }
    } else if (action === 'hide') {
      setHiddenPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    } else if (action === 'report') {
      setReportedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    }
  };

  /* ---- Add comment ---- */

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
              author: profile?.full_name || 'You',
              text,
              time: 'Just now',
            },
          ],
        };
      })
    );
    setNewComments((prev) => ({ ...prev, [postId]: '' }));
  };

  /* ---- Submit report ---- */

  const handleSubmitReport = () => {
    if (!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.platform || !reportForm.category) return;

    const newPost: Post = {
      id: Date.now(),
      author: profile?.full_name || 'You',
      verification: 'pending',
      title: reportForm.title,
      description: reportForm.description,
      platform: reportForm.platform as Platform,
      category: reportForm.category as Category,
      location: reportForm.location,
      image: reportForm.imageUrl || null,
      upvotes: 0,
      downvotes: 0,
      time: 'Just now',
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setReportForm({ title: '', description: '', platform: '', category: '', location: '', imageUrl: '' });
    setShowReportModal(false);
  };

  /* ---- Filter tabs config ---- */

  const filterTabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: t('allPosts') },
    { key: 'verified', label: t('verifiedOnly'), count: verifiedCount },
    { key: 'my_platforms', label: t('myPlatforms') },
    { key: 'near_me', label: t('nearMe') },
  ];

  /* ---- Render ---- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
              <Shield className="w-7 h-7 text-teal-600" />
              {t('community')}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Stay informed. Report threats. Protect children together.
            </p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all hover:shadow-lg hover:shadow-teal-600/30 hover:from-teal-500 hover:to-teal-600 active:scale-[0.98]"
          >
            <AlertTriangle className="w-4 h-4" />
            {t('reportAThreat')}
          </button>
        </div>

        {/* ---- Filter Tabs ---- */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeFilter === tab.key
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-xs font-bold ${
                    activeFilter === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-teal-100 text-teal-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ---- Posts ---- */}
        <div className="space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No posts found for this filter.</p>
              <p className="text-sm text-slate-400 mt-1">Try a different filter or report a new threat.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                voteState={voteStates[post.id] || 'none'}
                onVote={(type) => handleVote(post.id, type)}
                onMenuAction={(action) => handleMenuAction(post.id, action)}
                menuOpen={menuOpenId === post.id}
                setMenuOpen={(open) => setMenuOpenId(open ? post.id : null)}
                commentsOpen={commentsOpenId === post.id}
                setCommentsOpen={(open) => setCommentsOpenId(open ? post.id : null)}
                newComment={newComments[post.id] || ''}
                setNewComment={(text) => setNewComments((prev) => ({ ...prev, [post.id]: text }))}
                onAddComment={() => handleAddComment(post.id)}
                saved={!!savedPosts[post.id]}
                hidden={!!hiddenPosts[post.id]}
                reported={!!reportedPosts[post.id]}
                t={t}
              />
            ))
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="flex items-center gap-3 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-teal-600/25">
            <CheckCircle className="w-4 h-4" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Report a Threat Modal                                       */}
      {/* ============================================================ */}
      <Modal open={showReportModal} onClose={() => setShowReportModal(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-100">
                <AlertTriangle className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">{t('reportAThreat')}</h3>
            </div>
            <button
              onClick={() => setShowReportModal(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('postTitle')}</label>
            <input
              type="text"
              value={reportForm.title}
              onChange={(e) => setReportForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Brief description of the threat"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('description')}</label>
            <textarea
              value={reportForm.description}
              onChange={(e) => setReportForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Provide details about the threat, including any evidence you have..."
              rows={4}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-none"
            />
          </div>

          {/* Platform & Category row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform</label>
              <select
                value={reportForm.platform}
                onChange={(e) => setReportForm((f) => ({ ...f, platform: e.target.value as Platform }))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all appearance-none"
              >
                <option value="">Select platform</option>
                {MY_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('category')}</label>
              <select
                value={reportForm.category}
                onChange={(e) => setReportForm((f) => ({ ...f, category: e.target.value as Category }))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all appearance-none"
              >
                <option value="">Select category</option>
                <option value="Grooming">Grooming</option>
                <option value="Cyberbullying">Cyberbullying</option>
                <option value="Harmful Content">Harmful Content</option>
                <option value="Scam">Scam</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('location')}</label>
            <input
              type="text"
              value={reportForm.location}
              onChange={(e) => setReportForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g., Colombo, Kandy, Galle"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('image')}</label>
            <input
              type="text"
              value={reportForm.imageUrl}
              onChange={(e) => setReportForm((f) => ({ ...f, imageUrl: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowReportModal(false)}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSubmitReport}
              disabled={!reportForm.title.trim() || !reportForm.description.trim() || !reportForm.platform || !reportForm.category}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              <Plus className="w-4 h-4" />
              {t('submitReport')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
