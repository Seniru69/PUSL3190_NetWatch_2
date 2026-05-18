import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Clock, MessageCircle, UserPlus, Shield, AlertTriangle, Eye, X, CheckCircle } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Platform = 'Roblox' | 'Discord' | 'Instagram' | 'TikTok' | 'Snapchat';
type Severity = 'Critical' | 'Caution' | 'Safe';

interface ActivityItem {
  id: string;
  description: string;
  severity: Severity;
  time: string;
  contact?: string;
  excerpt?: string;
  hasDetails: boolean;
}

interface PlatformSection {
  platform: Platform;
  color: string;
  activities: ActivityItem[];
}

interface TimePeriodData {
  label: string;
  platforms: PlatformSection[];
}

/* ------------------------------------------------------------------ */
/*  Hard-coded sample data                                             */
/* ------------------------------------------------------------------ */

const TIMELINE_DATA: TimePeriodData[] = [
  /* ---- Today ---- */
  {
    label: 'Today',
    platforms: [
      {
        platform: 'Roblox',
        color: '#00D4AA',
        activities: [
          {
            id: 't-roblox-1',
            description: "Private message from 'GamerBro99' - Asked to meet outside game",
            severity: 'Critical',
            time: '2:30 PM',
            contact: 'GamerBro99',
            excerpt: "Hey, you seem really cool! Wanna meet up IRL? I know a fun place we can hang out. Don't tell your parents tho, it'll be our secret!",
            hasDetails: true,
          },
          {
            id: 't-roblox-2',
            description: "Friend request from unknown user 'ShadowLad'",
            severity: 'Caution',
            time: '1:15 PM',
            contact: 'ShadowLad',
            excerpt: 'ShadowLad sent a friend request. This account has no mutual friends and was created 2 days ago. Profile shows age 19.',
            hasDetails: true,
          },
          {
            id: 't-roblox-3',
            description: "Joined new group 'Adopt Me Trading'",
            severity: 'Safe',
            time: '11:00 AM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Discord',
        color: '#5865F2',
        activities: [
          {
            id: 't-discord-1',
            description: "DM from 'DiscordMod_Alex' requesting personal info",
            severity: 'Critical',
            time: '3:45 PM',
            contact: 'DiscordMod_Alex',
            excerpt: "I'm a Discord moderator and I need to verify your account. Can you send me your full name, address, and school name? It's for safety verification purposes.",
            hasDetails: true,
          },
          {
            id: 't-discord-2',
            description: "New server joined: 'Gaming Hub'",
            severity: 'Caution',
            time: '12:30 PM',
            contact: 'Gaming Hub',
            excerpt: "Server 'Gaming Hub' has 1,200 members. Contains channels with age-restricted content. No verification gate to access all channels.",
            hasDetails: true,
          },
          {
            id: 't-discord-3',
            description: 'Voice chat with known friend',
            severity: 'Safe',
            time: '10:00 AM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Instagram',
        color: '#E4405F',
        activities: [
          {
            id: 't-ig-1',
            description: "Follow request from 'CoolTeen2008' - Adult account",
            severity: 'Critical',
            time: '4:00 PM',
            contact: 'CoolTeen2008',
            excerpt: "Account 'CoolTeen2008' lists age as 28 in bio. Follows 500+ accounts, mostly minors. Posts contain suggestive content. No mutual followers.",
            hasDetails: true,
          },
          {
            id: 't-ig-2',
            description: "Comment on post: 'You look cute'",
            severity: 'Caution',
            time: '2:00 PM',
            contact: 'random_follower_42',
            excerpt: "Comment from non-mutual follower: 'You look cute 😍 we should chat! DM me?' Profile appears to target younger users.",
            hasDetails: true,
          },
          {
            id: 't-ig-3',
            description: 'Story viewed by known follower',
            severity: 'Safe',
            time: '9:30 AM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'TikTok',
        color: '#000000',
        activities: [
          {
            id: 't-tiktok-1',
            description: 'Stranger sent video with inappropriate content',
            severity: 'Critical',
            time: '5:15 PM',
            contact: 'unknown_sender_88',
            excerpt: "Received a direct video message from an unknown account. Video contains content flagged by NetWatch's content filter as adult/inappropriate for minors.",
            hasDetails: true,
          },
          {
            id: 't-tiktok-2',
            description: "New follower: 'DanceFan_42'",
            severity: 'Caution',
            time: '3:00 PM',
            contact: 'DanceFan_42',
            excerpt: "New follower 'DanceFan_42' - account has no profile picture, follows 2,000+ accounts, and has 0 posts. Account age: 3 days.",
            hasDetails: true,
          },
          {
            id: 't-tiktok-3',
            description: 'Liked a family-friendly video',
            severity: 'Safe',
            time: '11:30 AM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Snapchat',
        color: '#FFFC00',
        activities: [
          {
            id: 't-snap-1',
            description: 'Snap from unknown user',
            severity: 'Caution',
            time: '6:00 PM',
            contact: 'snaps_stranger',
            excerpt: "Received a snap from an unknown user not in contacts list. Snap was opened before parental review. User account has no mutual friends.",
            hasDetails: true,
          },
          {
            id: 't-snap-2',
            description: 'Story posted: At the park',
            severity: 'Safe',
            time: '4:30 PM',
            hasDetails: false,
          },
          {
            id: 't-snap-3',
            description: 'Chat with school friend',
            severity: 'Safe',
            time: '1:00 PM',
            hasDetails: false,
          },
        ],
      },
    ],
  },

  /* ---- Yesterday ---- */
  {
    label: 'Yesterday',
    platforms: [
      {
        platform: 'Roblox',
        color: '#00D4AA',
        activities: [
          {
            id: 'y-roblox-1',
            description: "Chat invite from 'xXDarkKnightXx' to private server",
            severity: 'Critical',
            time: '8:15 PM',
            contact: 'xXDarkKnightXx',
            excerpt: "User 'xXDarkKnightXx' sent a repeated chat invite to join a private server. Account has been reported 3 times for inappropriate behavior.",
            hasDetails: true,
          },
          {
            id: 'y-roblox-2',
            description: "Received in-game item trade from 'PixelQueen'",
            severity: 'Caution',
            time: '5:45 PM',
            contact: 'PixelQueen',
            excerpt: "Received a trade offer for a rare item at significantly below market value. Possible scam attempt. Account has no verified trade history.",
            hasDetails: true,
          },
          {
            id: 'y-roblox-3',
            description: 'Played Blox Fruits with school friends',
            severity: 'Safe',
            time: '3:30 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Discord',
        color: '#5865F2',
        activities: [
          {
            id: 'y-discord-1',
            description: "Link shared in DM from 'Music_Lover_99' - suspicious URL",
            severity: 'Critical',
            time: '9:20 PM',
            contact: 'Music_Lover_99',
            excerpt: "User shared a shortened URL in DM: 'Check this out! bit.ly/3xK9mP'. URL resolves to an unverified external site requesting personal information.",
            hasDetails: true,
          },
          {
            id: 'y-discord-2',
            description: "Added to group chat 'Late Night Vibes'",
            severity: 'Caution',
            time: '11:00 PM',
            contact: 'Late Night Vibes',
            excerpt: "Added to a group chat with 15 members, 8 of whom are unknown. Chat contains late-night conversations and adult-themed emojis.",
            hasDetails: true,
          },
          {
            id: 'y-discord-3',
            description: 'Sent meme to known friend',
            severity: 'Safe',
            time: '7:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Instagram',
        color: '#E4405F',
        activities: [
          {
            id: 'y-ig-1',
            description: "DM from 'Photographer_Mike' offering free photoshoot",
            severity: 'Critical',
            time: '6:30 PM',
            contact: 'Photographer_Mike',
            excerpt: "DM reads: 'Hey! I love your look! I'm a professional photographer and I'd love to do a free photoshoot for you. We can meet at my studio downtown. Just you and me!'",
            hasDetails: true,
          },
          {
            id: 'y-ig-2',
            description: "Tagged in post by 'school_bestie_2024'",
            severity: 'Caution',
            time: '4:15 PM',
            contact: 'school_bestie_2024',
            excerpt: "Tagged in a post at a location that reveals the school name. Post is publicly visible and includes geolocation data.",
            hasDetails: true,
          },
          {
            id: 'y-ig-3',
            description: 'Reel liked from verified creator',
            severity: 'Safe',
            time: '2:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'TikTok',
        color: '#000000',
        activities: [
          {
            id: 'y-tiktok-1',
            description: "Comment on video: 'Meet me at the mall Saturday'",
            severity: 'Critical',
            time: '10:30 PM',
            contact: 'skaterdude_15',
            excerpt: "Comment from unknown user on a public video: 'Hey you live near me right? Meet me at the mall Saturday at 3pm near the food court. Come alone!'",
            hasDetails: true,
          },
          {
            id: 'y-tiktok-2',
            description: "Followed 'trendy_clips_2024' - promotional account",
            severity: 'Caution',
            time: '8:45 PM',
            contact: 'trendy_clips_2024',
            excerpt: "Followed a promotional account that frequently posts sponsored content and has multiple community reports for spam/misleading links.",
            hasDetails: true,
          },
          {
            id: 'y-tiktok-3',
            description: 'Shared a funny video with friend',
            severity: 'Safe',
            time: '6:15 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Snapchat',
        color: '#FFFC00',
        activities: [
          {
            id: 'y-snap-1',
            description: 'Added to group story with unknown users',
            severity: 'Caution',
            time: '9:50 PM',
            contact: 'group_mixer_23',
            excerpt: "Added to a group story with 12 members, 7 of whom are not in contacts. Group contains location-tagged content.",
            hasDetails: true,
          },
          {
            id: 'y-snap-2',
            description: 'Snap Map location shared with best friend',
            severity: 'Safe',
            time: '5:30 PM',
            hasDetails: false,
          },
          {
            id: 'y-snap-3',
            description: 'Streak maintained with classmate',
            severity: 'Safe',
            time: '8:00 AM',
            hasDetails: false,
          },
        ],
      },
    ],
  },

  /* ---- 2 Days Ago ---- */
  {
    label: '2 Days Ago',
    platforms: [
      {
        platform: 'Roblox',
        color: '#00D4AA',
        activities: [
          {
            id: '2d-roblox-1',
            description: "User 'BuildingMaster' asked for real name in chat",
            severity: 'Critical',
            time: '7:45 PM',
            contact: 'BuildingMaster',
            excerpt: "Chat message: 'What's your real name? Mine is Jake. Are you a boy or girl? How old are you? I want to know more about you!'",
            hasDetails: true,
          },
          {
            id: '2d-roblox-2',
            description: "Received trade request from 'NewTrader2024'",
            severity: 'Caution',
            time: '4:20 PM',
            contact: 'NewTrader2024',
            excerpt: "Trade request offering extremely rare items for common items. Account is 1 day old with no trade history. Possible scam pattern.",
            hasDetails: true,
          },
          {
            id: '2d-roblox-3',
            description: 'Completed obstacle course with friends',
            severity: 'Safe',
            time: '2:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Discord',
        color: '#5865F2',
        activities: [
          {
            id: '2d-discord-1',
            description: "Voice channel invite from 'NightOwl_Gamer' - unknown user",
            severity: 'Critical',
            time: '10:30 PM',
            contact: 'NightOwl_Gamer',
            excerpt: "Repeated voice channel invites from an unknown user in a late-night session. User attempted to move conversation to a private channel.",
            hasDetails: true,
          },
          {
            id: '2d-discord-2',
            description: "Joined 'Anime Watch Party' server",
            severity: 'Caution',
            time: '6:15 PM',
            contact: 'Anime Watch Party',
            excerpt: "Server has open membership with no age verification. Contains channels with mature content discussions. 500+ members.",
            hasDetails: true,
          },
          {
            id: '2d-discord-3',
            description: 'Text chat with cousin',
            severity: 'Safe',
            time: '3:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Instagram',
        color: '#E4405F',
        activities: [
          {
            id: '2d-ig-1',
            description: "Profile visited by 'FashionVlogger_30' - adult account",
            severity: 'Critical',
            time: '8:00 PM',
            contact: 'FashionVlogger_30',
            excerpt: "Account 'FashionVlogger_30' (age 30) visited profile multiple times and sent a follow request. Account follows predominantly minor accounts.",
            hasDetails: true,
          },
          {
            id: '2d-ig-2',
            description: "DM from acquaintance: 'Check out this link'",
            severity: 'Caution',
            time: '5:30 PM',
            contact: 'classmate_jordan',
            excerpt: "DM contains a link to an external app download. The linked app is not available on official app stores and has no reviews.",
            hasDetails: true,
          },
          {
            id: '2d-ig-3',
            description: 'Posted a photo from family outing',
            severity: 'Safe',
            time: '12:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'TikTok',
        color: '#000000',
        activities: [
          {
            id: '2d-tiktok-1',
            description: "DM from 'LifeCoach_David' offering mentorship",
            severity: 'Critical',
            time: '9:15 PM',
            contact: 'LifeCoach_David',
            excerpt: "DM reads: 'I can see you have potential! I mentor young people for free. Send me your number so we can talk privately. This is between us.'",
            hasDetails: true,
          },
          {
            id: '2d-tiktok-2',
            description: "Video shared in 'challenge' trend",
            severity: 'Caution',
            time: '7:00 PM',
            contact: 'viral_challenges_24',
            excerpt: "Participated in a trending challenge. Some variations of this challenge involve risky behavior. Video is publicly visible.",
            hasDetails: true,
          },
          {
            id: '2d-tiktok-3',
            description: 'Watched cooking tutorial videos',
            severity: 'Safe',
            time: '4:30 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Snapchat',
        color: '#FFFC00',
        activities: [
          {
            id: '2d-snap-1',
            description: 'Snap from unknown number with screen recording request',
            severity: 'Caution',
            time: '10:00 PM',
            contact: 'unknown_number_555',
            excerpt: "Received a snap from an unknown phone number requesting a screen recording of conversations. Likely social engineering attempt.",
            hasDetails: true,
          },
          {
            id: '2d-snap-2',
            description: 'Birthday snap received from family',
            severity: 'Safe',
            time: '8:00 AM',
            hasDetails: false,
          },
          {
            id: '2d-snap-3',
            description: 'Group chat with soccer team',
            severity: 'Safe',
            time: '5:00 PM',
            hasDetails: false,
          },
        ],
      },
    ],
  },

  /* ---- 3 Days Ago ---- */
  {
    label: '3 Days Ago',
    platforms: [
      {
        platform: 'Roblox',
        color: '#00D4AA',
        activities: [
          {
            id: '3d-roblox-1',
            description: "User 'CoolKid_Roblox' shared external chat app link",
            severity: 'Critical',
            time: '6:50 PM',
            contact: 'CoolKid_Roblox',
            excerpt: "Chat message: 'This game is boring, let's talk on [messaging app] instead! Add me: CoolKid_2024. No parents allowed there lol!'",
            hasDetails: true,
          },
          {
            id: '3d-roblox-2',
            description: "Received gift from 'FriendlyTrader88'",
            severity: 'Caution',
            time: '3:30 PM',
            contact: 'FriendlyTrader88',
            excerpt: "Received unsolicited in-game gifts from 'FriendlyTrader88'. This user has been sending gifts to multiple young accounts before requesting private chats.",
            hasDetails: true,
          },
          {
            id: '3d-roblox-3',
            description: 'Explored new world with sibling',
            severity: 'Safe',
            time: '1:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Discord',
        color: '#5865F2',
        activities: [
          {
            id: '3d-discord-1',
            description: "User 'Helpful_Hacker' offered to 'boost' account",
            severity: 'Critical',
            time: '11:15 PM',
            contact: 'Helpful_Hacker',
            excerpt: "DM: 'I can boost your Discord account for free! Just give me your login details and I'll set everything up. Trust me, I've done this for hundreds of people!'",
            hasDetails: true,
          },
          {
            id: '3d-discord-2',
            description: "Mentioned in 'Free Nitro' channel",
            severity: 'Caution',
            time: '8:30 PM',
            contact: 'Free Nitro',
            excerpt: "Mentioned in a channel promoting 'free Discord Nitro'. Links in channel lead to phishing pages designed to steal Discord credentials.",
            hasDetails: true,
          },
          {
            id: '3d-discord-3',
            description: 'Shared homework answers with study group',
            severity: 'Safe',
            time: '5:00 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Instagram',
        color: '#E4405F',
        activities: [
          {
            id: '3d-ig-1',
            description: "DM request from 'ModelScout_Agency' - unverified",
            severity: 'Critical',
            time: '7:45 PM',
            contact: 'ModelScout_Agency',
            excerpt: "DM: 'We represent a top modeling agency and we think you have great potential! Please send us your measurements, full name, and a casual photo. We need your parent's contact too!' Account is unverified and has 12 followers.",
            hasDetails: true,
          },
          {
            id: '3d-ig-2',
            description: "Liked a post from 'school_club_official'",
            severity: 'Caution',
            time: '4:00 PM',
            contact: 'school_club_official',
            excerpt: "Liked a post from a school club account. The post contains location information visible to followers of the account.",
            hasDetails: true,
          },
          {
            id: '3d-ig-3',
            description: 'Saved a recipe reel',
            severity: 'Safe',
            time: '10:30 AM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'TikTok',
        color: '#000000',
        activities: [
          {
            id: '3d-tiktok-1',
            description: "Comment received: 'Where do you go to school?'",
            severity: 'Critical',
            time: '9:00 PM',
            contact: 'new_viewer_777',
            excerpt: "Comment from unknown user on a public video: 'You seem fun! Where do you go to school? I think we might be near each other!' Account shows red flags: no content, follows 500+ minors.",
            hasDetails: true,
          },
          {
            id: '3d-tiktok-2',
            description: "Started following 'DIY_Crafts_Channel'",
            severity: 'Caution',
            time: '6:45 PM',
            contact: 'DIY_Crafts_Channel',
            excerpt: "Followed a craft channel that shares content suitable for minors but has started posting sponsored links to external shopping sites.",
            hasDetails: true,
          },
          {
            id: '3d-tiktok-3',
            description: 'Dueted a friend\'s pet video',
            severity: 'Safe',
            time: '3:15 PM',
            hasDetails: false,
          },
        ],
      },
      {
        platform: 'Snapchat',
        color: '#FFFC00',
        activities: [
          {
            id: '3d-snap-1',
            description: 'Received snap from non-contact with geofilter',
            severity: 'Caution',
            time: '8:30 PM',
            contact: 'stranger_snap_01',
            excerpt: "Snap from unknown user includes a geofilter showing a nearby location. User attempted to start a conversation about the shared location.",
            hasDetails: true,
          },
          {
            id: '3d-snap-2',
            description: 'Sent snap to family group',
            severity: 'Safe',
            time: '5:00 PM',
            hasDetails: false,
          },
          {
            id: '3d-snap-3',
            description: 'Viewed friend\'s Spotlight video',
            severity: 'Safe',
            time: '2:30 PM',
            hasDetails: false,
          },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Platform filter config                                             */
/* ------------------------------------------------------------------ */

interface PlatformFilter {
  name: Platform | 'All';
  color: string;
  badgeColor: string;
}

const PLATFORM_FILTERS: PlatformFilter[] = [
  { name: 'All', color: '#0d9488', badgeColor: 'bg-teal-500' },
  { name: 'Roblox', color: '#00D4AA', badgeColor: 'bg-emerald-400' },
  { name: 'Discord', color: '#5865F2', badgeColor: 'bg-blue-500' },
  { name: 'Instagram', color: '#E4405F', badgeColor: 'bg-pink-500' },
  { name: 'TikTok', color: '#000000', badgeColor: 'bg-gray-800' },
  { name: 'Snapchat', color: '#FFFC00', badgeColor: 'bg-yellow-400' },
];

/* ------------------------------------------------------------------ */
/*  Severity badge styles                                              */
/* ------------------------------------------------------------------ */

const SEVERITY_STYLES: Record<Severity, { bg: string; text: string; dot: string }> = {
  Critical: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  Caution: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Safe: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

/* ------------------------------------------------------------------ */
/*  Severity icon helper                                               */
/* ------------------------------------------------------------------ */

function SeverityIcon({ severity }: { severity: Severity }) {
  switch (severity) {
    case 'Critical':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'Caution':
      return <Shield className="w-4 h-4 text-amber-500" />;
    case 'Safe':
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
  }
}

/* ================================================================== */
/*  TimelinePage                                                        */
/* ================================================================== */

export default function TimelinePage() {
  const { t, language } = useApp();
  const [activeTimeTab, setActiveTimeTab] = useState(0);
  const [activePlatform, setActivePlatform] = useState<Platform | 'All'>('All');
  const [selectedItem, setSelectedItem] = useState<ActivityItem & { platform: Platform; platformColor: string } | null>(null);
  const [falsePositives, setFalsePositives] = useState<Set<string>>(new Set());

  const currentDate = new Date();

  const timeTabs = TIMELINE_DATA.map((period) => {
    return {
      label: period.label,
    };
  });

  const currentPeriod = TIMELINE_DATA[activeTimeTab];

  const filteredPlatforms = activePlatform === 'All'
    ? currentPeriod.platforms
    : currentPeriod.platforms.filter((p) => p.platform === activePlatform);

  const handleViewDetails = (item: ActivityItem, platform: Platform, platformColor: string) => {
    setSelectedItem({ ...item, platform, platformColor });
  };

  const handleMarkFalsePositive = (id: string) => {
    setFalsePositives((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    setSelectedItem(null);
  };

  const getEffectiveSeverity = (item: ActivityItem): Severity => {
    if (falsePositives.has(item.id)) return 'Safe';
    return item.severity;
  };

  const totalCritical = filteredPlatforms.reduce(
    (sum, p) => sum + p.activities.filter((a) => getEffectiveSeverity(a) === 'Critical').length,
    0,
  );
  const totalCaution = filteredPlatforms.reduce(
    (sum, p) => sum + p.activities.filter((a) => getEffectiveSeverity(a) === 'Caution').length,
    0,
  );
  const totalSafe = filteredPlatforms.reduce(
    (sum, p) => sum + p.activities.filter((a) => getEffectiveSeverity(a) === 'Safe').length,
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              {t('timeline') || 'Activity Timeline'}
            </h1>
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
        {/*  Filter Bar                                                   */}
        {/* ============================================================ */}
        <div className="space-y-4">
          {/* Platform filter */}
          <div className="flex flex-wrap items-center gap-2">
            {PLATFORM_FILTERS.map((pf) => {
              const isActive = activePlatform === pf.name;
              return (
                <button
                  key={pf.name}
                  onClick={() => setActivePlatform(pf.name)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-md shadow-slate-700/25'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <span
                    className={`inline-flex items-center justify-center w-2.5 h-2.5 rounded-full ${pf.badgeColor} ${isActive ? 'ring-2 ring-white/30' : ''}`}
                  />
                  {pf.name}
                </button>
              );
            })}
          </div>

          {/* Time filter tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-200 p-1 shadow-sm">
            {timeTabs.map((tab, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTimeTab(idx)}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTimeTab === idx
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className="block">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Summary Stats                                                */}
        {/* ============================================================ */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-red-700">{totalCritical}</p>
              <p className="text-[10px] font-medium text-red-500 uppercase tracking-wider">
                {t('critical') || 'Critical'}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-700">{totalCaution}</p>
              <p className="text-[10px] font-medium text-amber-500 uppercase tracking-wider">
                {t('caution') || 'Caution'}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-700">{totalSafe}</p>
              <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">
                {t('safe') || 'Safe'}
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Timeline Content                                             */}
        {/* ============================================================ */}
        <div className="space-y-6 transition-opacity duration-300">
          {filteredPlatforms.map((section) => (
            <div
              key={section.platform}
              className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden"
            >
              {/* Platform header */}
              <div
                className="flex items-center gap-3 px-6 py-4 border-b border-slate-100"
                style={{ borderLeft: `4px solid ${section.color}` }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold"
                  style={{ backgroundColor: section.color }}
                >
                  {section.platform.slice(0, 2)}
                </div>
                <h2 className="text-base font-bold text-slate-800">{section.platform}</h2>
                <span className="text-xs text-slate-400 font-medium">
                  {section.activities.filter((a) => getEffectiveSeverity(a) === 'Critical').length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-red-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {section.activities.filter((a) => getEffectiveSeverity(a) === 'Critical').length} critical
                    </span>
                  )}
                </span>
              </div>

              {/* Activity items */}
              <div className="divide-y divide-slate-50">
                {section.activities.map((item) => {
                  const severity = getEffectiveSeverity(item);
                  const sevStyle = SEVERITY_STYLES[severity];
                  return (
                    <div
                      key={item.id}
                      className="group px-6 py-4 flex items-start gap-4 transition-all hover:bg-slate-50/50"
                    >
                      {/* Severity icon */}
                      <div className="mt-0.5 shrink-0">
                        <SeverityIcon severity={severity} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 leading-snug">
                              {item.description}
                            </p>
                            <div className="mt-2 flex items-center gap-3 flex-wrap">
                              {/* Severity badge */}
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sevStyle.bg} ${sevStyle.text}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${sevStyle.dot}`} />
                                {severity === 'Critical'
                                  ? (t('critical') || 'Critical')
                                  : severity === 'Caution'
                                    ? (t('caution') || 'Caution')
                                    : (t('safe') || 'Safe')}
                              </span>
                              {/* Time */}
                              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                <Clock className="w-3 h-3" />
                                {item.time}
                              </span>
                            </div>
                          </div>

                          {/* View Details button */}
                          {item.hasDetails && (
                            <button
                              onClick={() => handleViewDetails(item, section.platform, section.color)}
                              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100 active:bg-teal-200 opacity-70 group-hover:opacity-100"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {t('viewDetails') || 'View Details'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty state */}
          {filteredPlatforms.length === 0 && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-slate-100">
                <MessageCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">
                {t('noActivity') || 'No activity found for this filter'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/*  View Details Modal                                           */}
      {/* ============================================================ */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          {/* content */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal header with platform color */}
            <div
              className="px-6 py-4 border-b border-slate-100"
              style={{ borderLeft: `4px solid ${selectedItem.platformColor}` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-xl text-white text-sm font-bold"
                    style={{ backgroundColor: selectedItem.platformColor }}
                  >
                    {selectedItem.platform.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{selectedItem.platform}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedItem.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${SEVERITY_STYLES[getEffectiveSeverity(selectedItem)].bg} ${SEVERITY_STYLES[getEffectiveSeverity(selectedItem)].text}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${SEVERITY_STYLES[getEffectiveSeverity(selectedItem)].dot}`} />
                    {getEffectiveSeverity(selectedItem) === 'Critical'
                      ? (t('critical') || 'Critical')
                      : getEffectiveSeverity(selectedItem) === 'Caution'
                        ? (t('caution') || 'Caution')
                        : (t('safe') || 'Safe')}
                  </span>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-5">
              {/* Description */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-1">
                  {t('description') || 'Description'}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedItem.description}
                </p>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {t('platform') || 'Platform'}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{selectedItem.platform}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {t('time') || 'Time'}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{selectedItem.time}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {t('severity') || 'Severity'}
                  </p>
                  <p className={`mt-1 text-sm font-semibold ${SEVERITY_STYLES[getEffectiveSeverity(selectedItem)].text}`}>
                    {getEffectiveSeverity(selectedItem)}
                  </p>
                </div>
              </div>

              {/* Contact */}
              {selectedItem.contact && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">
                    {t('contactUsername') || 'Contact Username'}
                  </h4>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2">
                    <UserPlus className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">{selectedItem.contact}</span>
                  </div>
                </div>
              )}

              {/* Excerpt */}
              {selectedItem.excerpt && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-700 mb-1">
                    {t('flaggedContent') || 'Flagged Content'}
                  </h4>
                  <div className="rounded-lg border border-red-100 bg-red-50/50 p-4">
                    <p className="text-sm text-red-700 leading-relaxed italic">
                      "{selectedItem.excerpt}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              {!falsePositives.has(selectedItem.id) && (
                <button
                  onClick={() => handleMarkFalsePositive(selectedItem.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {t('markAsFalsePositive')}
                </button>
              )}
              {falsePositives.has(selectedItem.id) && (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <CheckCircle className="w-4 h-4" />
                  {t('markedAsSafe')}
                </span>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 transition-colors"
              >
                {t('close') || 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
