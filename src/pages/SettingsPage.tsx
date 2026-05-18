import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { User, Link, Users, Bookmark, Shield, Trash2, CreditCard as Edit, Plus, Mail, Phone, Globe, CheckCircle, AlertTriangle, X, Save, Eye } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Hard-coded sample data                                             */
/* ------------------------------------------------------------------ */

interface LinkedAccount {
  id: number;
  name: string;
  age: number;
  email: string;
  status: 'active' | 'pending' | 'inactive';
}

interface ChildProfile {
  id: number;
  name: string;
  age: number;
  email: string;
  platforms: string[];
}

interface SavedPost {
  id: number;
  title: string;
  savedAt: string;
}

const LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: 1, name: 'Kavindu Perera', age: 12, email: 'kavindu.p@gmail.com', status: 'active' },
];

const CHILD_PROFILES: ChildProfile[] = [
  { id: 1, name: 'Kavindu Perera', age: 12, email: 'kavindu.p@gmail.com', platforms: ['Roblox', 'Discord', 'Instagram', 'TikTok', 'Snapchat'] },
];

const SAVED_POSTS: SavedPost[] = [
  { id: 1, title: "Suspicious user 'ShadowLad' in Roblox", savedAt: '1 day ago' },
  { id: 2, title: 'Predator using TikTok comments', savedAt: '3 days ago' },
  { id: 3, title: 'Grooming pattern detected on Discord', savedAt: '5 days ago' },
];

const ALL_PLATFORMS = ['Roblox', 'Discord', 'Instagram', 'TikTok', 'Snapchat'];

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  inactive: { bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400' },
};

type TabKey = 'linked' | 'profiles' | 'saved' | 'editProfile' | 'privacy';

const TABS: { key: TabKey; labelKey: string; icon: React.ReactNode }[] = [
  { key: 'linked', labelKey: 'linkedAccounts', icon: <Link className="w-4 h-4" /> },
  { key: 'profiles', labelKey: 'childProfiles', icon: <Users className="w-4 h-4" /> },
  { key: 'saved', labelKey: 'savedPosts', icon: <Bookmark className="w-4 h-4" /> },
  { key: 'editProfile', labelKey: 'editProfile', icon: <User className="w-4 h-4" /> },
  { key: 'privacy', labelKey: 'dataAndPrivacy', icon: <Shield className="w-4 h-4" /> },
];

/* ------------------------------------------------------------------ */
/*  Modal component                                                    */
/* ------------------------------------------------------------------ */

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-8 animate-in fade-in">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Toggle Switch component                                            */
/* ------------------------------------------------------------------ */

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
        enabled ? 'bg-teal-600' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

/* ================================================================== */
/*  SettingsPage                                                       */
/* ================================================================== */

export default function SettingsPage({ initialTab }: { initialTab?: string }) {
  const { t, language, setLanguage, profile, signOut, user } = useApp();

  const [activeTab, setActiveTab] = useState<TabKey>(initialTab === 'editProfile' ? 'editProfile' : initialTab === 'savedPosts' ? 'saved' : 'linked');

  /* ---- Linked Accounts state ---- */
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildEmail, setNewChildEmail] = useState('');
  const [showLinkConfirmation, setShowLinkConfirmation] = useState(false);

  /* ---- Child Profiles state ---- */
  const [editingProfile, setEditingProfile] = useState<ChildProfile | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPlatforms, setEditPlatforms] = useState<string[]>([]);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [addProfileName, setAddProfileName] = useState('');
  const [addProfileAge, setAddProfileAge] = useState('');
  const [addProfileEmail, setAddProfileEmail] = useState('');
  const [addProfilePlatforms, setAddProfilePlatforms] = useState<string[]>([]);

  /* ---- Saved Posts state ---- */
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>(SAVED_POSTS);

  /* ---- Edit Profile state ---- */
  const [profileName, setProfileName] = useState(profile?.full_name || '');
  const [profileEmail] = useState(profile?.email || '');
  const [profilePhone, setProfilePhone] = useState(profile?.phone || '');
  const [profileLang, setProfileLang] = useState(language);
  const [profileSaved, setProfileSaved] = useState(false);

  /* ---- Data & Privacy state ---- */
  const [faceBlurring, setFaceBlurring] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* ---- Handlers ---- */

  const handleLinkAccount = () => {
    if (!newChildName || !newChildAge || !newChildEmail) return;
    setShowAddChild(false);
    setShowLinkConfirmation(true);
    setNewChildName('');
    setNewChildAge('');
    setNewChildEmail('');
  };

  const handleEditProfile = (child: ChildProfile) => {
    setEditingProfile(child);
    setEditName(child.name);
    setEditAge(String(child.age));
    setEditEmail(child.email);
    setEditPlatforms([...child.platforms]);
  };

  const handleSaveProfileChanges = () => {
    setEditingProfile(null);
  };

  const handleTogglePlatform = (platform: string, list: string[], setList: (v: string[]) => void) => {
    if (list.includes(platform)) {
      setList(list.filter((p) => p !== platform));
    } else {
      setList([...list, platform]);
    }
  };

  const handleRemoveSavedPost = (id: number) => {
    setSavedPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveProfile = async () => {
    try {
      if (user) {
        await supabase
          .from('profiles')
          .update({
            full_name: profileName,
            phone: profilePhone,
            language: profileLang,
          })
          .eq('id', user.id);
      }
      if (profileLang !== language) {
        setLanguage(profileLang);
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      // silently handle
    }
  };

  const handleLanguageChange = (lang: 'en' | 'si') => {
    setProfileLang(lang);
    setLanguage(lang);
  };

  const handleDataDeletion = async () => {
    if (!user) return;
    setDeleting(true);

    try {
      const userId = user.id;

      const tables = [
        'profiles',
        'children',
        'contacts',
        'alerts',
        'notifications',
        'saved_posts',
        'hidden_posts',
        'post_votes',
        'timeline_events',
        'wellness_data',
      ];

      for (const table of tables) {
        await supabase.from(table).delete().eq('user_id', userId);
      }

      await signOut();
    } catch {
      // If deletion fails, still sign out
      await signOut();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ---- Header ---- */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
            {t('settings')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('manageAccountAndPreferences')}
          </p>
        </div>

        {/* ============================================================ */}
        {/*  Tab Bar                                                      */}
        {/* ============================================================ */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-1 overflow-x-auto -mb-px" aria-label="Settings tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.icon}
                {t(tab.labelKey)}
              </button>
            ))}
          </nav>
        </div>

        {/* ============================================================ */}
        {/*  Tab Content                                                  */}
        {/* ============================================================ */}

        {/* ---- 1. Linked Accounts ---- */}
        {activeTab === 'linked' && (
          <div className="space-y-6">
            {/* Current Gmail Account */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-teal-600" />
                {t('currentGmailAccount')}
              </h2>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100">
                  <Mail className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">kavindu.p@gmail.com</p>
                  <p className="text-xs text-slate-500">{t('primaryAccount')}</p>
                </div>
              </div>
            </div>

            {/* Add Another Child */}
            <button
              onClick={() => setShowAddChild(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all hover:shadow-lg hover:shadow-teal-600/30 hover:from-teal-500 hover:to-teal-600 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              {t('addAnotherChild')}
            </button>

            {/* Linked Accounts List */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                <Link className="w-5 h-5 text-teal-600" />
                {t('linkedAccounts')}
              </h2>
              <div className="space-y-3">
                {LINKED_ACCOUNTS.map((account) => {
                  const statusStyle = STATUS_STYLES[account.status];
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/70"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100">
                          <Users className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{account.name}</p>
                          <p className="text-xs text-slate-500">
                            {t('age')} {account.age} &middot; {account.email}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle.bg} ${statusStyle.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {account.status === 'active'
                          ? t('active')
                          : account.status === 'pending'
                            ? t('pending')
                            : t('inactive')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---- 2. Child Profiles ---- */}
        {activeTab === 'profiles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                {t('childProfiles')}
              </h2>
              <button
                onClick={() => {
                  setAddProfileName('');
                  setAddProfileAge('');
                  setAddProfileEmail('');
                  setAddProfilePlatforms([]);
                  setShowAddProfile(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all hover:shadow-lg hover:from-teal-500 hover:to-teal-600 active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                {t('addChild')}
              </button>
            </div>

            <div className="space-y-4">
              {CHILD_PROFILES.map((child) => (
                <div
                  key={child.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 shrink-0">
                        <Users className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-slate-800">{child.name}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {t('age')} {child.age} &middot; {child.email}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {child.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700 border border-teal-200"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditProfile(child)}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 active:bg-slate-300"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      {t('editProfile')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- 3. Saved Posts ---- */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-teal-600" />
              {t('savedPosts')}
            </h2>

            {savedPosts.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-12 shadow-sm text-center">
                <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
                  <Bookmark className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-700">
                  {t('noSavedPosts')}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {t('savedPostsWillAppear')}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-5 rounded-xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 shrink-0">
                        <Bookmark className="w-5 h-5 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{post.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t('saved')} {post.savedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100">
                        <Eye className="w-3.5 h-3.5" />
                        {t('view')}
                      </button>
                      <button
                        onClick={() => handleRemoveSavedPost(post.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                      >
                        <X className="w-3.5 h-3.5" />
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ---- 4. Edit Profile ---- */}
        {activeTab === 'editProfile' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              {t('editProfile')}
            </h2>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('fullName')}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder={t('enterFullName')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={profileEmail}
                    readOnly
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-400">{t('emailCannotBeChanged')}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  {t('phone')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    placeholder={t('enterPhone')}
                  />
                </div>
              </div>

              {/* Language Toggle */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  <Globe className="w-4 h-4 inline mr-1.5 text-slate-400" />
                  {t('language')}
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      profileLang === 'en'
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t('english')}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('si')}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                      profileLang === 'si'
                        ? 'bg-teal-600 text-white shadow-md shadow-teal-600/25'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t('sinhala')}
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition-all hover:shadow-lg hover:from-teal-500 hover:to-teal-600 active:scale-[0.98]"
                >
                  <Save className="w-4 h-4" />
                  {t('saveChanges')}
                </button>
                {profileSaved && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 animate-in fade-in slide-in-from-left-2">
                    <CheckCircle className="w-4 h-4" />
                    {t('profileSaved')}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ---- 5. Data & Privacy ---- */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              {t('dataAndPrivacy')}
            </h2>

            {/* Privacy Settings */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                {t('privacySettings')}
              </h3>

              {/* Data Retention */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">{t('dataRetentionPeriod')}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 border border-teal-200">
                  30 {t('days')}
                </span>
              </div>

              {/* Face Blurring */}
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="text-sm font-medium text-slate-800">{t('faceBlurring')}</p>
                </div>
                <ToggleSwitch enabled={faceBlurring} onToggle={() => setFaceBlurring(!faceBlurring)} />
              </div>

              {/* Encryption */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-800">{t('encryption')}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 border border-emerald-200">
                  {t('endToEndEncrypted')}
                </span>
              </div>
            </div>

            {/* Child Consent */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50/30 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-semibold text-teal-800">{t('childConsent')}</h3>
              </div>
              <p className="text-sm text-slate-700">
                {t('childConsentDescription')}
              </p>
              <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-3">
                <p className="text-sm font-medium text-slate-800">{t('consentStatusByChild')}</p>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <div>
                    <p className="text-sm text-slate-700">Kavindu Perera</p>
                    <p className="text-xs text-slate-400">{t('age')} 12</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t('consentGiven')}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {t('monitoringPaused')}
                </p>
              </div>
            </div>

            {/* Right to Erasure */}
            <div className="rounded-2xl border-2 border-red-200 bg-red-50/30 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wider">
                  {t('rightToErasure')}
                </h3>
              </div>
              <p className="text-sm text-red-700/80">
                {t('pdpaDeletionDescription')}
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/25 transition-all hover:shadow-lg hover:from-red-500 hover:to-red-600 active:scale-[0.98]"
              >
                <Trash2 className="w-4 h-4" />
                {t('requestDataDeletion')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/*  Add Another Child Modal                                     */}
      {/* ============================================================ */}
      <Modal open={showAddChild} onClose={() => setShowAddChild(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">{t('addAnotherChild')}</h3>
            <button onClick={() => setShowAddChild(false)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('childName')}</label>
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('childAge')}</label>
              <input
                type="number"
                value={newChildAge}
                onChange={(e) => setNewChildAge(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder=""
                min={1}
                max={17}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('gmailAccount')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={newChildEmail}
                  onChange={(e) => setNewChildEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowAddChild(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleLinkAccount}
              disabled={!newChildName || !newChildAge || !newChildEmail}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link className="w-4 h-4" />
              {t('linkAccount')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/*  Link Confirmation Modal                                     */}
      {/* ============================================================ */}
      <Modal open={showLinkConfirmation} onClose={() => setShowLinkConfirmation(false)}>
        <div className="space-y-5 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">{t('confirmationSent')}</h3>
          </div>

          <button
            onClick={() => setShowLinkConfirmation(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600"
          >
            <CheckCircle className="w-4 h-4" />
            {t('ok')}
          </button>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/*  Edit Child Profile Modal                                    */}
      {/* ============================================================ */}
      <Modal open={!!editingProfile} onClose={() => setEditingProfile(null)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">{t('editProfile')}</h3>
            <button onClick={() => setEditingProfile(null)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('name')}</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('age')}</label>
              <input
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                min={1}
                max={17}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('gmailAccount')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={editEmail}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-slate-400">{t('gmailCannotBeChanged')}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('monitoredPlatforms')}</label>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((platform) => {
                  const isSelected = editPlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      onClick={() => handleTogglePlatform(platform, editPlatforms, setEditPlatforms)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setEditingProfile(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSaveProfileChanges}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600"
            >
              <Save className="w-4 h-4" />
              {t('saveChanges')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/*  Add Child Profile Modal                                     */}
      {/* ============================================================ */}
      <Modal open={showAddProfile} onClose={() => setShowAddProfile(false)}>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">{t('addChild')}</h3>
            <button onClick={() => setShowAddProfile(false)} className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('childName')}</label>
              <input
                type="text"
                value={addProfileName}
                onChange={(e) => setAddProfileName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('childAge')}</label>
              <input
                type="number"
                value={addProfileAge}
                onChange={(e) => setAddProfileAge(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder=""
                min={1}
                max={17}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('gmailAccount')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={addProfileEmail}
                  onChange={(e) => setAddProfileEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  placeholder=""
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('monitoredPlatforms')}</label>
              <div className="flex flex-wrap gap-2">
                {ALL_PLATFORMS.map((platform) => {
                  const isSelected = addProfilePlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      onClick={() => handleTogglePlatform(platform, addProfilePlatforms, setAddProfilePlatforms)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => setShowAddProfile(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={() => setShowAddProfile(false)}
              disabled={!addProfileName || !addProfileAge || !addProfileEmail}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-teal-500 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              {t('addChild')}
            </button>
          </div>
        </div>
      </Modal>

      {/* ============================================================ */}
      {/*  Data Deletion Confirmation Modal                            */}
      {/* ============================================================ */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="space-y-5 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-800">{t('deleteAllData')}</h3>
            <p className="mt-2 text-sm text-red-600 leading-relaxed max-w-sm mx-auto font-medium">
              {t('deleteAllDataWarning')}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="rounded-lg px-5 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
              disabled={deleting}
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleDataDeletion}
              disabled={deleting}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:from-red-500 hover:to-red-600 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? t('deleting') : t('confirmDeletion')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
