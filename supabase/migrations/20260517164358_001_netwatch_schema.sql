/*
  # NetWatch Database Schema

  1. New Tables
    - `profiles` — User profiles linked to auth.users (parent accounts)
      - `id` (uuid, PK, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text, nullable)
      - `avatar_url` (text, nullable)
      - `language` (text, default 'en')
      - `role` (text, default 'user') — 'user' or 'admin'
      - `created_at` (timestamptz)
    - `children` — Child profiles linked to parent
      - `id` (uuid, PK)
      - `parent_id` (uuid, FK to profiles)
      - `name` (text)
      - `age` (integer)
      - `gmail_account` (text)
      - `avatar_url` (text, nullable)
      - `created_at` (timestamptz)
    - `contacts` — Monitored contacts across platforms
      - `id` (uuid, PK)
      - `child_id` (uuid, FK to children)
      - `parent_id` (uuid, FK to profiles)
      - `username` (text)
      - `platform` (text)
      - `risk_level` (text, default 'low') — 'low', 'medium', 'high'
      - `is_known` (boolean, default false)
      - `cross_platform_match` (text, nullable)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
    - `alerts` — Safety alerts for parents
      - `id` (uuid, PK)
      - `parent_id` (uuid, FK to profiles)
      - `child_id` (uuid, FK to children)
      - `contact_username` (text, nullable)
      - `platform` (text)
      - `alert_type` (text) — 'grooming', 'cyberbullying', 'harmful_content', 'suspicious_contact'
      - `severity` (text) — 'caution', 'critical'
      - `title` (text)
      - `description` (text)
      - `excerpt` (text, nullable)
      - `is_read` (boolean, default false)
      - `is_false_positive` (boolean, default false)
      - `created_at` (timestamptz)
    - `notifications` — System notifications
      - `id` (uuid, PK)
      - `parent_id` (uuid, FK to profiles)
      - `type` (text) — 'alert', 'community', 'system', 'verification'
      - `title` (text)
      - `message` (text)
      - `is_read` (boolean, default false)
      - `link` (text, nullable)
      - `created_at` (timestamptz)
    - `community_posts` — Community threat sharing posts
      - `id` (uuid, PK)
      - `author_id` (uuid, FK to profiles)
      - `author_name` (text)
      - `platform` (text)
      - `category` (text) — 'grooming', 'cyberbullying', 'harmful_content', 'scam', 'other'
      - `title` (text)
      - `description` (text)
      - `image_url` (text, nullable)
      - `video_url` (text, nullable)
      - `location` (text, nullable)
      - `verification_status` (text, default 'pending') — 'verified', 'under_review', 'false_info', 'pending'
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `is_hidden` (boolean, default false)
      - `is_reported` (boolean, default false)
      - `is_saved` (boolean, default false for user-specific)
      - `created_at` (timestamptz)
    - `post_comments` — Comments on community posts
      - `id` (uuid, PK)
      - `post_id` (uuid, FK to community_posts)
      - `author_id` (uuid, FK to profiles)
      - `author_name` (text)
      - `content` (text)
      - `created_at` (timestamptz)
    - `post_votes` — User votes on community posts
      - `id` (uuid, PK)
      - `post_id` (uuid, FK to community_posts)
      - `user_id` (uuid, FK to profiles)
      - `vote_type` (text) — 'up', 'down'
      - `created_at` (timestamptz)
    - `saved_posts` — User saved community posts
      - `id` (uuid, PK)
      - `post_id` (uuid, FK to community_posts)
      - `user_id` (uuid, FK to profiles)
      - `created_at` (timestamptz)
    - `hidden_posts` — User hidden community posts
      - `id` (uuid, PK)
      - `post_id` (uuid, FK to community_posts)
      - `user_id` (uuid, FK to profiles)
      - `created_at` (timestamptz)
    - `reported_posts` — Reported community posts (forwarded to admin)
      - `id` (uuid, PK)
      - `post_id` (uuid, FK to community_posts)
      - `reporter_id` (uuid, FK to profiles)
      - `reason` (text)
      - `status` (text, default 'pending') — 'pending', 'reviewed', 'dismissed'
      - `created_at` (timestamptz)
    - `timeline_events` — Activity timeline events
      - `id` (uuid, PK)
      - `child_id` (uuid, FK to children)
      - `parent_id` (uuid, FK to profiles)
      - `platform` (text)
      - `event_type` (text) — 'message', 'friend_request', 'group_join', 'content_viewed'
      - `severity` (text, default 'safe') — 'safe', 'caution', 'critical'
      - `title` (text)
      - `description` (text)
      - `contact_username` (text, nullable)
      - `is_false_positive` (boolean, default false)
      - `event_time` (timestamptz)
      - `created_at` (timestamptz)
    - `wellness_data` — Digital wellness tracking
      - `id` (uuid, PK)
      - `child_id` (uuid, FK to children)
      - `parent_id` (uuid, FK to profiles)
      - `date` (date)
      - `screen_time_minutes` (integer, default 0)
      - `sleep_score` (integer, default 0)
      - `app_diversity_score` (integer, default 0)
      - `safety_score` (integer, default 0)
      - `platform_breakdown` (jsonb, default '{}')
      - `created_at` (timestamptz)
    - `admin_reports` — Admin review reports
      - `id` (uuid, PK)
      - `post_id` (uuid, nullable, FK to community_posts)
      - `reporter_id` (uuid, nullable, FK to profiles)
      - `type` (text) — 'post_report', 'user_report', 'content_review'
      - `reason` (text)
      - `status` (text, default 'pending') — 'pending', 'reviewed', 'actioned', 'dismissed'
      - `admin_notes` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Admins can access all data
    - Community posts are readable by all authenticated users
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  avatar_url text,
  language text DEFAULT 'en',
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

-- Children table
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  age integer NOT NULL,
  gmail_account text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  username text NOT NULL,
  platform text NOT NULL,
  risk_level text DEFAULT 'low',
  is_known boolean DEFAULT false,
  cross_platform_match text,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  contact_username text,
  platform text NOT NULL,
  alert_type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  excerpt text,
  is_read boolean DEFAULT false,
  is_false_positive boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  link text,
  created_at timestamptz DEFAULT now()
);

-- Community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  platform text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  video_url text,
  location text,
  verification_status text DEFAULT 'pending',
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  is_hidden boolean DEFAULT false,
  is_reported boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Post votes table
CREATE TABLE IF NOT EXISTS post_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Saved posts table
CREATE TABLE IF NOT EXISTS saved_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Hidden posts table
CREATE TABLE IF NOT EXISTS hidden_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Reported posts table
CREATE TABLE IF NOT EXISTS reported_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Timeline events table
CREATE TABLE IF NOT EXISTS timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  event_type text NOT NULL,
  severity text DEFAULT 'safe',
  title text NOT NULL,
  description text NOT NULL,
  contact_username text,
  is_false_positive boolean DEFAULT false,
  event_time timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Wellness data table
CREATE TABLE IF NOT EXISTS wellness_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  screen_time_minutes integer DEFAULT 0,
  sleep_score integer DEFAULT 0,
  app_diversity_score integer DEFAULT 0,
  safety_score integer DEFAULT 0,
  platform_breakdown jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Admin reports table
CREATE TABLE IF NOT EXISTS admin_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE,
  reporter_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  reason text NOT NULL,
  status text DEFAULT 'pending',
  admin_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hidden_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_reports ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Children policies
CREATE POLICY "Users can read own children" ON children FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own children" ON children FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own children" ON children FOR UPDATE TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can delete own children" ON children FOR DELETE TO authenticated USING (parent_id = auth.uid());

-- Contacts policies
CREATE POLICY "Users can read own contacts" ON contacts FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own contacts" ON contacts FOR UPDATE TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can delete own contacts" ON contacts FOR DELETE TO authenticated USING (parent_id = auth.uid());

-- Alerts policies
CREATE POLICY "Users can read own alerts" ON alerts FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own alerts" ON alerts FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can delete own notifications" ON notifications FOR DELETE TO authenticated USING (parent_id = auth.uid());

-- Community posts policies (readable by all authenticated)
CREATE POLICY "Authenticated users can read community posts" ON community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert community posts" ON community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update own community posts" ON community_posts FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());

-- Post comments policies
CREATE POLICY "Authenticated users can read comments" ON post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert comments" ON post_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

-- Post votes policies
CREATE POLICY "Authenticated users can read votes" ON post_votes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert votes" ON post_votes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own votes" ON post_votes FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Saved posts policies
CREATE POLICY "Users can read own saved posts" ON saved_posts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert saved posts" ON saved_posts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own saved posts" ON saved_posts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Hidden posts policies
CREATE POLICY "Users can read own hidden posts" ON hidden_posts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert hidden posts" ON hidden_posts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own hidden posts" ON hidden_posts FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Reported posts policies
CREATE POLICY "Users can read own reported posts" ON reported_posts FOR SELECT TO authenticated USING (reporter_id = auth.uid());
CREATE POLICY "Users can insert reported posts" ON reported_posts FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Users can delete own reported posts" ON reported_posts FOR DELETE TO authenticated USING (reporter_id = auth.uid());

-- Timeline events policies
CREATE POLICY "Users can read own timeline events" ON timeline_events FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own timeline events" ON timeline_events FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own timeline events" ON timeline_events FOR UPDATE TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());

-- Wellness data policies
CREATE POLICY "Users can read own wellness data" ON wellness_data FOR SELECT TO authenticated USING (parent_id = auth.uid());
CREATE POLICY "Users can insert own wellness data" ON wellness_data FOR INSERT TO authenticated WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Users can update own wellness data" ON wellness_data FOR UPDATE TO authenticated USING (parent_id = auth.uid()) WITH CHECK (parent_id = auth.uid());

-- Admin reports policies
CREATE POLICY "Users can read own admin reports" ON admin_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can insert admin reports" ON admin_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Admins can update admin reports" ON admin_reports FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_children_parent_id ON children(parent_id);
CREATE INDEX IF NOT EXISTS idx_contacts_parent_id ON contacts(parent_id);
CREATE INDEX IF NOT EXISTS idx_contacts_child_id ON contacts(child_id);
CREATE INDEX IF NOT EXISTS idx_alerts_parent_id ON alerts(parent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_parent_id ON notifications(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_timeline_events_parent_id ON timeline_events(parent_id);
CREATE INDEX IF NOT EXISTS idx_wellness_data_parent_id ON wellness_data(parent_id);
CREATE INDEX IF NOT EXISTS idx_admin_reports_status ON admin_reports(status);
