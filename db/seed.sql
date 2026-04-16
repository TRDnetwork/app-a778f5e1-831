-- Seed data for KanbanFlow
-- Note: This assumes auth.users already has some test users

-- Insert sample project for user (assuming user with ID '00000000-0000-0000-0000-000000000000' exists)
INSERT INTO public.app_1a7c_projects (id, user_id, name, description, color, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Website Redesign', 'Redesign company website with modern UI', '#8B5CF6', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Mobile App Launch', 'Launch new mobile application', '#10B981', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO public.app_1a7c_tasks (id, user_id, project_id, title, description, status, priority, due_date, position, labels, created_at, updated_at)
VALUES 
    ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Design Homepage', 'Create wireframes and mockups for homepage', 'todo', 'high', NOW() + INTERVAL '7 days', 0, '{"design", "ui"}', NOW(), NOW()),
    ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Implement Navigation', 'Code the main navigation component', 'in_progress', 'medium', NOW() + INTERVAL '5 days', 0, '{"frontend", "react"}', NOW(), NOW()),
    ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Test Responsive Design', 'Test on mobile, tablet, and desktop', 'done', 'low', NOW() - INTERVAL '1 day', 0, '{"testing", "responsive"}', NOW(), NOW()),
    ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'App Icon Design', 'Design app icon for stores', 'todo', 'medium', NOW() + INTERVAL '10 days', 0, '{"design", "mobile"}', NOW(), NOW()),
    ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'API Integration', 'Connect app to backend API', 'in_progress', 'high', NOW() + INTERVAL '3 days', 1, '{"backend", "api"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample comments
INSERT INTO public.app_1a7c_comments (id, user_id, task_id, content, created_at, updated_at)
VALUES 
    ('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333', 'Let''s use a dark theme for the homepage', NOW(), NOW()),
    ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000000', '44444444-4444-4444-4444-444444444444', 'Navigation should be sticky on scroll', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;