import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, Check, AlertTriangle, Shield, Users, Clock, CheckCheck } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAllRead?: () => void;
}

interface Notification {
  id: string;
  type: 'alert' | 'community' | 'system' | 'verification';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Critical Alert: Grooming Detected',
    message: 'Your child received 18 private messages from an adult-sounding user in Roblox after 11 PM asking for photos.',
    time: '2 min ago',
    isRead: false,
  },
  {
    id: '2',
    type: 'alert',
    title: 'Suspicious Contact on Discord',
    message: 'A user impersonating a Discord moderator has been messaging your child requesting login credentials.',
    time: '15 min ago',
    isRead: false,
  },
  {
    id: '3',
    type: 'community',
    title: 'Community Alert: New Threat Verified',
    message: 'A post about suspicious user "ShadowLad" in Roblox has been verified by moderators.',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: '4',
    type: 'system',
    title: 'Weekly Safety Report Ready',
    message: 'Your child\'s weekly safety report is now available. Safety score: 78/100 (+5 from last week).',
    time: '3 hours ago',
    isRead: true,
  },
  {
    id: '5',
    type: 'verification',
    title: 'Account Verification Complete',
    message: 'Your linked Gmail account for Kavindu Perera has been successfully verified.',
    time: '5 hours ago',
    isRead: true,
  },
  {
    id: '6',
    type: 'alert',
    title: 'Cyberbullying Detected on TikTok',
    message: 'Multiple negative comments targeting your child have been detected on their recent TikTok posts.',
    time: '8 hours ago',
    isRead: true,
  },
  {
    id: '7',
    type: 'community',
    title: 'New Post in Your Area',
    message: 'Nimal Perera posted a new community alert about a suspicious user in Colombo.',
    time: '12 hours ago',
    isRead: true,
  },
  {
    id: '8',
    type: 'system',
    title: 'Monitoring Resumed',
    message: 'Monitoring has been resumed for all linked accounts. All platforms are being tracked.',
    time: '1 day ago',
    isRead: true,
  },
];

export default function NotificationsPanel({ isOpen, onClose, onAllRead }: NotificationsPanelProps) {
  const { t } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    onAllRead?.();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'community': return <Users className="w-5 h-5 text-teal-600" />;
      case 'system': return <Shield className="w-5 h-5 text-slate-500" />;
      case 'verification': return <Check className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getBgColor = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-white';
    switch (type) {
      case 'alert': return 'bg-red-50';
      case 'community': return 'bg-teal-50';
      case 'system': return 'bg-slate-50';
      case 'verification': return 'bg-emerald-50';
      default: return 'bg-white';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-slate-800">{t('notifications')}</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium px-2 py-1 rounded-lg hover:bg-teal-50 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                {t('markAllAsRead')}
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Bell className="w-12 h-12 mb-3" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${getBgColor(notification.type, notification.isRead)} ${!notification.isRead ? 'border-l-4 border-l-teal-500' : 'border-l-4 border-l-transparent'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-400">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
