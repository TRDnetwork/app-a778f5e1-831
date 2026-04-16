-- Create tables for KanbanFlow project management tool
-- All tables prefixed with app_1a7c_

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.app_1a7c_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.app_1a7c_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table (Kanban cards)
CREATE TABLE IF NOT EXISTS public.app_1a7c_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.app_1a7c_projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    position INTEGER DEFAULT 0, -- For drag-and-drop ordering within columns
    labels TEXT[], -- Array of label strings
    assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task comments table
CREATE TABLE IF NOT EXISTS public.app_1a7c_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.app_1a7c_tasks(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Task activity log table
CREATE TABLE IF NOT EXISTS public.app_1a7c_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.app_1a7c_tasks(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.app_1a7c_projects(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.app_1a7c_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_1a7c_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_1a7c_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_1a7c_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_1a7c_activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.app_1a7c_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.app_1a7c_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.app_1a7c_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.app_1a7c_profiles;

DROP POLICY IF EXISTS "Users can view own projects" ON public.app_1a7c_projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.app_1a7c_projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.app_1a7c_projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.app_1a7c_projects;

DROP POLICY IF EXISTS "Users can view own tasks" ON public.app_1a7c_tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.app_1a7c_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.app_1a7c_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.app_1a7c_tasks;

DROP POLICY IF EXISTS "Users can view own comments" ON public.app_1a7c_comments;
DROP POLICY IF EXISTS "Users can insert own comments" ON public.app_1a7c_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.app_1a7c_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.app_1a7c_comments;

DROP POLICY IF EXISTS "Users can view own activity" ON public.app_1a7c_activity_log;
DROP POLICY IF EXISTS "Users can insert own activity" ON public.app_1a7c_activity_log;
DROP POLICY IF EXISTS "Users can update own activity" ON public.app_1a7c_activity_log;
DROP POLICY IF EXISTS "Users can delete own activity" ON public.app_1a7c_activity_log;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.app_1a7c_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.app_1a7c_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.app_1a7c_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON public.app_1a7c_profiles
    FOR DELETE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view own projects" ON public.app_1a7c_projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON public.app_1a7c_projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.app_1a7c_projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.app_1a7c_projects
    FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON public.app_1a7c_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.app_1a7c_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.app_1a7c_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.app_1a7c_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view own comments" ON public.app_1a7c_comments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own comments" ON public.app_1a7c_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON public.app_1a7c_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON public.app_1a7c_comments
    FOR DELETE USING (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view own activity" ON public.app_1a7c_activity_log
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON public.app_1a7c_activity_log
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON public.app_1a7c_activity_log
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activity" ON public.app_1a7c_activity_log
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_app_1a7c_profiles_user_id ON public.app_1a7c_profiles(id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_projects_user_id ON public.app_1a7c_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_tasks_user_id ON public.app_1a7c_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_tasks_project_id ON public.app_1a7c_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_tasks_status ON public.app_1a7c_tasks(status);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_tasks_priority ON public.app_1a7c_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_tasks_due_date ON public.app_1a7c_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_comments_user_id ON public.app_1a7c_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_comments_task_id ON public.app_1a7c_comments(task_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_activity_log_user_id ON public.app_1a7c_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_activity_log_task_id ON public.app_1a7c_activity_log(task_id);
CREATE INDEX IF NOT EXISTS idx_app_1a7c_activity_log_project_id ON public.app_1a7c_activity_log(project_id);

-- Add tables to realtime publication for live updates
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_1a7c_tasks'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.app_1a7c_tasks;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_1a7c_comments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.app_1a7c_comments;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'app_1a7c_activity_log'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.app_1a7c_activity_log;
    END IF;
END $$;

-- Create storage bucket for task attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('app_1a7c_attachments', 'app_1a7c_attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for attachments
DROP POLICY IF EXISTS "Users can upload own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own attachments" ON storage.objects;

CREATE POLICY "Users can upload own attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'app_1a7c_attachments' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'app_1a7c_attachments' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update own attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'app_1a7c_attachments' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'app_1a7c_attachments' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );