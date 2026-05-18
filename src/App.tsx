import { useState } from 'react';
import { useApp, AppProvider } from './context/AppContext';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TimelinePage from './pages/TimelinePage';
import ContactsPage from './pages/ContactsPage';
import AlertsPage from './pages/AlertsPage';
import CommunityPage from './pages/CommunityPage';
import WellnessPage from './pages/WellnessPage';
import SettingsPage from './pages/SettingsPage';
import AdminConsolePage from './pages/AdminConsolePage';
import NotificationsPanel from './components/NotificationsPanel';
import {
  LayoutDashboard,
  Clock,
  Users,
  AlertTriangle,
  MessageCircle,
  Heart,
  Settings,
  LogOut,
  Bell,
  User,
  Shield,
  Menu,
  Globe,
} from 'lucide-react';

type Page = 'dashboard' | 'timeline' | 'contacts' | 'alerts' | 'community' | 'wellness' | 'settings' | 'profile' | 'editProfile';

const userNavItems = [
  { id: 'dashboard' as Page, icon: LayoutDashboard, label: 'dashboard' },
  { id: 'timeline' as Page, icon: Clock, label: 'timeline' },
  { id: 'contacts' as Page, icon: Users, label: 'contacts' },
  { id: 'alerts' as Page, icon: AlertTriangle, label: 'alerts' },
  { id: 'community' as Page, icon: MessageCircle, label: 'community' },
  { id: 'wellness' as Page, icon: Heart, label: 'wellness' },
  { id: 'settings' as Page, icon: Settings, label: 'settings' },
];

function AppContent() {
  const { user, profile, loading, t, language, setLanguage, signOut, monitoringPaused } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">Loading NetWatch...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthPage />;
  }

  const isAdmin = profile.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
  };

  const renderPage = () => {
    if (isAdmin) {
      return <AdminConsolePage />;
    }
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
      case 'timeline': return <TimelinePage />;
      case 'contacts': return <ContactsPage />;
      case 'alerts': return <AlertsPage />;
      case 'community': return <CommunityPage />;
      case 'wellness': return <WellnessPage />;
      case 'settings': return <SettingsPage initialTab="linked" />;
      case 'profile': return <SettingsPage initialTab="editProfile" />;
      case 'editProfile': return <SettingsPage initialTab="editProfile" />;
      default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50/30 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - only for non-admin users */}
      {!isAdmin && (
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">NetWatch</h1>
              <p className="text-xs text-teal-600 font-medium">
                {isAdmin ? t('adminConsole') : 'Parent Dashboard'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {userNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {t(item.label)}
              </button>
            );
          })}
        </nav>

        {/* Language Toggle */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2 px-3 py-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">{t('language')}:</span>
            <div className="flex gap-1 ml-auto">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
                  language === 'en' ? 'bg-teal-100 text-teal-700' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('si')}
                className={`px-2 py-0.5 text-xs rounded-md font-medium transition-colors ${
                  language === 'si' ? 'bg-teal-100 text-teal-700' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                සිං
              </button>
            </div>
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{profile.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </button>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar - only for non-admin users */}
        {!isAdmin && (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {t(currentPage)}
                </h2>
                {monitoringPaused && (
                  <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Monitoring Paused
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-600" />
                {hasUnreadNotifications && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              <button
                onClick={() => { setCurrentPage('editProfile'); }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <User className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </header>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} onAllRead={() => setHasUnreadNotifications(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
