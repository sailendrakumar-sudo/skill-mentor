-- ==============================================================================
-- SKILL MENTOR: PEER-TO-PEER STUDENT SKILL EXCHANGE PLATFORM
-- INITIAL DATABASE SCHEMA MIGRATION (001_initial_schema.sql)
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 2. TABLES CREATION

-- 2.1 Profiles Table (linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  avatar_url text,
  bio text,
  institution text,
  department text,
  year_of_study text,
  location text,
  preferred_format text default 'Online' check (preferred_format in ('Online', 'In-Person', 'Hybrid', 'Collaborative Project')),
  languages text[] default array['English'],
  rating numeric(3,2) default 0.00 check (rating >= 0.00 and rating <= 5.00),
  completed_sessions_count integer default 0 check (completed_sessions_count >= 0),
  mentored_count integer default 0 check (mentored_count >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.2 User Teaching Skills Table
create table if not exists public.user_teaching_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_name text not null,
  proficiency_level text not null check (proficiency_level in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, skill_name)
);

-- 2.3 User Learning Skills Table
create table if not exists public.user_learning_skills (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  skill_name text not null,
  target_level text not null check (target_level in ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, skill_name)
);

-- 2.4 Mentorship Requests Table
create table if not exists public.mentorship_requests (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  skill_requested text not null,
  skill_offered text,
  objective text not null,
  status text default 'Pending' check (status in ('Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.5 Conversations Table
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  participant_one uuid references public.profiles(id) on delete cascade not null,
  participant_two uuid references public.profiles(id) on delete cascade not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_conversation_participants unique (participant_one, participant_two)
);

-- 2.6 Messages Table
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.7 Learning Sessions Table
create table if not exists public.learning_sessions (
  id uuid default uuid_generate_v4() primary key,
  mentor_id uuid references public.profiles(id) on delete cascade not null,
  learner_id uuid references public.profiles(id) on delete cascade not null,
  skill_name text not null,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  meeting_link text,
  objective text,
  status text default 'Scheduled' check (status in ('Scheduled', 'In Progress', 'Completed', 'Cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2.8 Reviews Table
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.learning_sessions(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewed_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (session_id, reviewer_id)
);

-- 3. INDEXES FOR HIGH-PERFORMANCE SEARCH, MATCHING & CHAT

create index if not exists idx_profiles_institution on public.profiles(institution);
create index if not exists idx_profiles_rating on public.profiles(rating desc);
create index if not exists idx_user_teaching_skills_skill on public.user_teaching_skills(lower(skill_name));
create index if not exists idx_user_teaching_skills_user on public.user_teaching_skills(user_id);
create index if not exists idx_user_learning_skills_skill on public.user_learning_skills(lower(skill_name));
create index if not exists idx_user_learning_skills_user on public.user_learning_skills(user_id);
create index if not exists idx_mentorship_requests_sender on public.mentorship_requests(sender_id);
create index if not exists idx_mentorship_requests_receiver on public.mentorship_requests(receiver_id);
create index if not exists idx_mentorship_requests_status on public.mentorship_requests(status);
create index if not exists idx_conversations_p1 on public.conversations(participant_one);
create index if not exists idx_conversations_p2 on public.conversations(participant_two);
create index if not exists idx_messages_conversation on public.messages(conversation_id, created_at asc);
create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_sessions_mentor on public.learning_sessions(mentor_id);
create index if not exists idx_sessions_learner on public.learning_sessions(learner_id);
create index if not exists idx_sessions_date on public.learning_sessions(session_date);
create index if not exists idx_reviews_reviewed on public.reviews(reviewed_id);
create index if not exists idx_reviews_session on public.reviews(session_id);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all 8 tables
alter table public.profiles enable row level security;
alter table public.user_teaching_skills enable row level security;
alter table public.user_learning_skills enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.reviews enable row level security;

-- 4.1 Profiles Policies
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 4.2 Teaching Skills Policies
drop policy if exists "Teaching skills viewable by everyone" on public.user_teaching_skills;
create policy "Teaching skills viewable by everyone"
  on public.user_teaching_skills for select
  using (true);

drop policy if exists "Users manage their own teaching skills (insert)" on public.user_teaching_skills;
create policy "Users manage their own teaching skills (insert)"
  on public.user_teaching_skills for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own teaching skills (update)" on public.user_teaching_skills;
create policy "Users manage their own teaching skills (update)"
  on public.user_teaching_skills for update
  using (auth.uid() = user_id);

drop policy if exists "Users manage their own teaching skills (delete)" on public.user_teaching_skills;
create policy "Users manage their own teaching skills (delete)"
  on public.user_teaching_skills for delete
  using (auth.uid() = user_id);

-- 4.3 Learning Skills Policies
drop policy if exists "Learning skills viewable by everyone" on public.user_learning_skills;
create policy "Learning skills viewable by everyone"
  on public.user_learning_skills for select
  using (true);

drop policy if exists "Users manage their own learning skills (insert)" on public.user_learning_skills;
create policy "Users manage their own learning skills (insert)"
  on public.user_learning_skills for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users manage their own learning skills (update)" on public.user_learning_skills;
create policy "Users manage their own learning skills (update)"
  on public.user_learning_skills for update
  using (auth.uid() = user_id);

drop policy if exists "Users manage their own learning skills (delete)" on public.user_learning_skills;
create policy "Users manage their own learning skills (delete)"
  on public.user_learning_skills for delete
  using (auth.uid() = user_id);

-- 4.4 Mentorship Requests Policies
drop policy if exists "Participants can view their mentorship requests" on public.mentorship_requests;
create policy "Participants can view their mentorship requests"
  on public.mentorship_requests for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Authenticated users can create mentorship requests" on public.mentorship_requests;
create policy "Authenticated users can create mentorship requests"
  on public.mentorship_requests for insert
  with check (auth.uid() = sender_id);

drop policy if exists "Participants can update mentorship request status" on public.mentorship_requests;
create policy "Participants can update mentorship request status"
  on public.mentorship_requests for update
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- 4.5 Conversations Policies
drop policy if exists "Participants can view their conversations" on public.conversations;
create policy "Participants can view their conversations"
  on public.conversations for select
  using (auth.uid() = participant_one or auth.uid() = participant_two);

drop policy if exists "Participants can create conversations" on public.conversations;
create policy "Participants can create conversations"
  on public.conversations for insert
  with check (auth.uid() = participant_one or auth.uid() = participant_two);

-- 4.6 Messages Policies
drop policy if exists "Participants can view conversation messages" on public.messages;
create policy "Participants can view conversation messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.participant_one = auth.uid() or c.participant_two = auth.uid())
    )
  );

drop policy if exists "Conversation participants can send messages" on public.messages;
create policy "Conversation participants can send messages"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.participant_one = auth.uid() or c.participant_two = auth.uid())
    )
  );

drop policy if exists "Message recipients can mark as read" on public.messages;
create policy "Message recipients can mark as read"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.participant_one = auth.uid() or c.participant_two = auth.uid())
    )
  );

-- 4.7 Learning Sessions Policies
drop policy if exists "Participants can view learning sessions" on public.learning_sessions;
create policy "Participants can view learning sessions"
  on public.learning_sessions for select
  using (auth.uid() = mentor_id or auth.uid() = learner_id);

drop policy if exists "Participants can schedule learning sessions" on public.learning_sessions;
create policy "Participants can schedule learning sessions"
  on public.learning_sessions for insert
  with check (auth.uid() = mentor_id or auth.uid() = learner_id);

drop policy if exists "Participants can update learning sessions" on public.learning_sessions;
create policy "Participants can update learning sessions"
  on public.learning_sessions for update
  using (auth.uid() = mentor_id or auth.uid() = learner_id);

-- 4.8 Reviews Policies
drop policy if exists "Reviews are viewable by everyone" on public.reviews;
create policy "Reviews are viewable by everyone"
  on public.reviews for select
  using (true);

drop policy if exists "Session participants can submit reviews" on public.reviews;
create policy "Session participants can submit reviews"
  on public.reviews for insert
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from public.learning_sessions s
      where s.id = reviews.session_id
      and (s.mentor_id = auth.uid() or s.learner_id = auth.uid())
    )
  );

-- 5. DATABASE FUNCTIONS & TRIGGERS

-- 5.1 Auto-create profile on Supabase Auth signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, bio, institution)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
    'Passionate student looking to learn and share knowledge!',
    coalesce(new.raw_user_meta_data->>'institution', 'University Campus')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5.2 Auto-update profile rating and completed count when review is submitted
create or replace function public.update_profile_stats_on_review()
returns trigger as $$
declare
  avg_rating numeric(3,2);
  sessions_count integer;
  mentor_sessions_count integer;
begin
  -- Calculate new average rating for reviewed user
  select round(coalesce(avg(rating), 0)::numeric, 2)
  into avg_rating
  from public.reviews
  where reviewed_id = new.reviewed_id;

  -- Calculate completed sessions as learner or mentor
  select count(*)
  into sessions_count
  from public.learning_sessions
  where (mentor_id = new.reviewed_id or learner_id = new.reviewed_id)
  and status = 'Completed';

  -- Calculate sessions where user mentored
  select count(*)
  into mentor_sessions_count
  from public.learning_sessions
  where mentor_id = new.reviewed_id
  and status = 'Completed';

  -- Update profiles table
  update public.profiles
  set
    rating = avg_rating,
    completed_sessions_count = sessions_count,
    mentored_count = mentor_sessions_count
  where id = new.reviewed_id;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger for reviews
drop trigger if exists on_review_inserted on public.reviews;
create trigger on_review_inserted
  after insert or update on public.reviews
  for each row execute procedure public.update_profile_stats_on_review();

-- ==============================================================================
-- 6. SEED DATA (Demo Students, Skills, Requests, Messages & Reviews)
-- ==============================================================================

do $$
declare
  user1_id uuid := 'a1111111-1111-1111-1111-111111111111';
  user2_id uuid := 'b2222222-2222-2222-2222-222222222222';
  user3_id uuid := 'c3333333-3333-3333-3333-333333333333';
  user4_id uuid := 'd4444444-4444-4444-4444-444444444444';
  user5_id uuid := 'e5555555-5555-5555-5555-555555555555';
  conv1_id uuid := 'c0000001-0001-0001-0001-000000000001';
  sess1_id uuid := 'f0000001-0001-0001-0001-000000000001';
  sess2_id uuid := 'f0000002-0002-0002-0002-000000000002';
begin
  -- Insert into auth.users if not present (allows foreign key constraints to succeed in PostgreSQL)
  insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  values
    (user1_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alex.chen@university.edu', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Alex Chen"}', now(), now()),
    (user2_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sarah.jenkins@university.edu', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sarah Jenkins"}', now(), now()),
    (user3_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'marcus.vance@university.edu', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marcus Vance"}', now(), now()),
    (user4_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'priya.patel@university.edu', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Patel"}', now(), now()),
    (user5_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'david.kim@university.edu', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"David Kim"}', now(), now())
  on conflict (id) do nothing;

  -- 6.1 Insert Profiles
  insert into public.profiles (id, full_name, avatar_url, bio, institution, department, year_of_study, location, preferred_format, languages, rating, completed_sessions_count, mentored_count)
  values
    (user1_id, 'Alex Chen', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200', 'Computer Science Junior with a deep passion for Full-Stack development and Machine Learning. Eager to master UI/UX Design and Figma to build gorgeous interfaces.', 'Stanford University', 'Computer Science', '3rd Year', 'San Francisco, CA', 'Online', array['English', 'Mandarin'], 4.90, 18, 12),
    (user2_id, 'Sarah Jenkins', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 'Product Designer & Visual Communicator. Love creating wireframes, design systems, and micro-interactions. Want to learn Python and web scraping for data-driven design.', 'Rhode Island School of Design', 'Digital Arts & Design', '4th Year', 'Providence, RI', 'Online', array['English'], 4.85, 24, 16),
    (user3_id, 'Marcus Vance', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200', 'Data Science & Algorithm Specialist. Built predictive models for campus hackathons. Seeking a partner to polish my public speaking and pitch deck communication skills.', 'MIT', 'Electrical Engineering & CS', '2nd Year', 'Cambridge, MA', 'Hybrid', array['English', 'Spanish'], 4.75, 14, 9),
    (user4_id, 'Priya Patel', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200', 'Debate team captain and business communications mentor. Helping engineers present technical ideas with conviction and clarity. Keen to learn React and modern JavaScript.', 'UC Berkeley', 'Haas School of Business', 'Senior', 'Berkeley, CA', 'Online', array['English', 'Hindi'], 4.95, 31, 22),
    (user5_id, 'David Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'Video editor and digital motion graphics creator. Proficient in Premiere Pro and After Effects. Looking to collaborate on video projects and learn basic Python automation.', 'NYU Tisch', 'Film & Television', '2nd Year', 'New York, NY', 'In-Person', array['English', 'Korean'], 4.65, 10, 6)
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    bio = excluded.bio,
    institution = excluded.institution,
    department = excluded.department,
    year_of_study = excluded.year_of_study,
    location = excluded.location,
    preferred_format = excluded.preferred_format,
    languages = excluded.languages,
    rating = excluded.rating,
    completed_sessions_count = excluded.completed_sessions_count,
    mentored_count = excluded.mentored_count;

  -- 6.2 Teaching Skills
  insert into public.user_teaching_skills (user_id, skill_name, proficiency_level)
  values
    (user1_id, 'Python', 'Expert'),
    (user1_id, 'React', 'Advanced'),
    (user1_id, 'Machine Learning', 'Intermediate'),
    (user2_id, 'UI/UX Design', 'Expert'),
    (user2_id, 'Figma', 'Expert'),
    (user2_id, 'Graphic Design', 'Advanced'),
    (user3_id, 'Python', 'Advanced'),
    (user3_id, 'Mathematics', 'Expert'),
    (user3_id, 'Data Science', 'Advanced'),
    (user4_id, 'Public Speaking', 'Expert'),
    (user4_id, 'Communication', 'Expert'),
    (user4_id, 'Leadership', 'Advanced'),
    (user5_id, 'Video Editing', 'Expert'),
    (user5_id, 'Digital Marketing', 'Intermediate')
  on conflict (user_id, skill_name) do nothing;

  -- 6.3 Learning Skills
  insert into public.user_learning_skills (user_id, skill_name, target_level)
  values
    (user1_id, 'UI/UX Design', 'Advanced'),
    (user1_id, 'Figma', 'Intermediate'),
    (user2_id, 'Python', 'Intermediate'),
    (user2_id, 'JavaScript', 'Beginner'),
    (user3_id, 'Public Speaking', 'Advanced'),
    (user3_id, 'Communication', 'Intermediate'),
    (user4_id, 'React', 'Intermediate'),
    (user4_id, 'JavaScript', 'Intermediate'),
    (user5_id, 'Python', 'Intermediate'),
    (user5_id, 'UI/UX Design', 'Beginner')
  on conflict (user_id, skill_name) do nothing;

  -- 6.4 Mentorship Requests
  insert into public.mentorship_requests (sender_id, receiver_id, skill_requested, skill_offered, objective, status)
  values
    (user1_id, user2_id, 'UI/UX Design', 'Python', 'I want to redesign my web application project and learn wireframing best practices in Figma. In return, I can teach you Python programming and pandas for data analysis!', 'Accepted'),
    (user3_id, user4_id, 'Public Speaking', 'Mathematics', 'Need guidance on articulating complex algorithmic research concisely for an upcoming research conference presentation.', 'Accepted'),
    (user5_id, user1_id, 'Python', 'Video Editing', 'Looking for beginner Python scripts to automate bulk media renaming and folder organization for video editing pipelines.', 'Pending')
  on conflict do nothing;

  -- 6.5 Conversations
  insert into public.conversations (id, participant_one, participant_two, updated_at)
  values
    (conv1_id, user1_id, user2_id, now())
  on conflict (participant_one, participant_two) do nothing;

  -- 6.6 Messages
  insert into public.messages (conversation_id, sender_id, content, is_read, created_at)
  values
    (conv1_id, user1_id, 'Hi Sarah! Thanks for accepting my request. Looking forward to our UI/UX and Python skill exchange!', true, now() - interval '2 days'),
    (conv1_id, user2_id, 'Hey Alex! So excited. I have always wanted to automate my design assets with Python. When works best for our first session?', true, now() - interval '1 day'),
    (conv1_id, user1_id, 'How does Wednesday at 4:00 PM EST sound? I can prepare an interactive Colab notebook for you!', false, now() - interval '4 hours')
  on conflict do nothing;

  -- 6.7 Learning Sessions
  insert into public.learning_sessions (id, mentor_id, learner_id, skill_name, session_date, start_time, end_time, meeting_link, objective, status)
  values
    (sess1_id, user2_id, user1_id, 'UI/UX Design', current_date + interval '2 days', '16:00:00', '17:00:00', 'https://meet.google.com/xyz-mentor-skill', 'Figma layout grids, typography hierarchies, and mobile responsiveness review.', 'Scheduled'),
    (sess2_id, user1_id, user2_id, 'Python', current_date - interval '3 days', '14:00:00', '15:00:00', 'https://meet.google.com/abc-python-exchange', 'Python fundamentals: variables, lists, dictionaries, and CSV file reading.', 'Completed')
  on conflict do nothing;

  -- 6.8 Reviews
  insert into public.reviews (session_id, reviewer_id, reviewed_id, rating, feedback)
  values
    (sess2_id, user2_id, user1_id, 5, 'Alex is a phenomenal peer teacher! He broke down Python programming concepts into bite-sized analogies that made total sense. We wrote 3 scripts together in one hour. Highly recommended!')
  on conflict (session_id, reviewer_id) do nothing;

end $$;
