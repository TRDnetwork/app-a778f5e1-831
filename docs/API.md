# KanbanFlow API Documentation

This document describes the Supabase tables and Edge Functions used by KanbanFlow. All API access is through the Supabase JavaScript client.

## Base URL

```
https://[your-project-ref].supabase.co
```

## Authentication

KanbanFlow uses Supabase Auth. All requests require a valid JWT token, which is automatically handled by the Supabase client.

## Database Tables

All tables are prefixed with `app_1a7c_` and have Row‑Level Security (RLS) enabled.

### `app_1a7c_profiles`
Extends `auth.users` with additional user information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | References `auth.users.id` |
| `username` | TEXT | User’s chosen username |
| `full_name` | TEXT | User’s full name |
| `avatar_url` | TEXT | URL to profile image |
| `created_at` | TIMESTAMPTZ | Auto‑set on creation |
| `updated_at` | TIMESTAMPTZ | Auto‑updated on change |

**Policies**: Users can only CRUD their own profile.

### `app_1a7c_projects`
Projects belong to a single user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto‑generated |
| `user_id` | UUID (FK) | References `auth.users.id` |
| `name` | TEXT | Project name (required) |
| `description` | TEXT | Project description |
| `color` | TEXT | Hex color for UI (default: `#3B82F6`) |
| `created_at` | TIMESTAMPTZ | Auto‑set on creation |
| `updated_at` | TIMESTAMPTZ | Auto‑updated on change |

**Policies**: Users can only CRUD their own projects.

### `app_1a7c_tasks`
Tasks (Kanban cards) belong to a project and a user.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto‑generated |
| `user_id` | UUID (FK) | References `auth.users.id` |
| `project_id` | UUID (FK) | References `app_1a7c_projects.id` |
| `title` | TEXT | Task title (required) |
| `description` | TEXT | Task description |
| `status` | TEXT | `todo`, `in_progress`, or `done` (default: `todo`) |
| `priority` | TEXT | `low`, `medium`, or `high` (default: `medium`) |
| `due_date` | TIMESTAMPTZ | Optional due date |
| `position` | INTEGER | Order within column (default: `0`) |
| `labels` | TEXT[] | Array of label strings |
| `assignee_id` | UUID (FK) | References `auth.users.id` (optional) |
| `created_at` | TIMESTAMPTZ | Auto‑set on creation |
| `updated_at` | TIMESTAMPTZ | Auto‑updated on change |

**Indexes**: `user_id`, `project_id`, `status`, `priority`, `due_date`, `position`, `(status, priority)`, `(user_id, project_id)`

**Policies**: Users can only CRUD their own tasks.

**Realtime**: Enabled for live updates.

### `app_1a7c_comments`
Comments on tasks.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto‑generated |
| `user_id` | UUID (FK) | References `auth.users.id` |
| `task_id` | UUID (FK) | References `app_1a7c_tasks.id` |
| `content` | TEXT | Comment text (required) |
| `created_at` | TIMESTAMPTZ | Auto‑set on creation |
| `updated_at` | TIMESTAMPTZ | Auto‑updated on change |

**Policies**: Users can only CRUD their own comments.

**Realtime**: Enabled.

### `app_1a7c_activity_log`
Audit log for task and project activity.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Auto‑generated |
| `user_id` | UUID (FK) | References `auth.users.id` |
| `task_id` | UUID (FK) | References `app_1a7c_tasks.id` (optional) |
| `project_id` | UUID (FK) | References `app_1a7c_projects.id` (optional) |
| `action` | TEXT | Action description (e.g., `task_created`) |
| `details` | JSONB | Additional context |
| `created_at` | TIMESTAMPTZ | Auto‑set on creation |

**Policies**: Users can only CRUD their own activity.

**Realtime**: Enabled.

## Storage Bucket

**Bucket ID**: `app_1a7c_attachments`

**Purpose**: Store task attachments (images, documents, etc.).

**Policies**: Users can only access files in their own user‑scoped folder (`/{user_id}/filename`).

## Edge Functions

### `task-webhook`
Logs task activity to the audit log.

**Endpoint**: `https://[your-project-ref].supabase.co/functions/v1/task-webhook`

**Method**: `POST`

**Headers**:
```http
Authorization: Bearer [SUPABASE_ANON_KEY or user JWT]
Content-Type: application/json
```

**Request Body**:
```json
{
  "task_id": "uuid",
  "user_id": "uuid",
  "action": "string (max 100 chars)",
  "details": { /* optional JSON */ }
}
```

**Response**:
```json
{
  "success": true
}
```

**Example cURL**:
```bash
curl -X POST 'https://[project].supabase.co/functions/v1/task-webhook' \
  -H 'Authorization: Bearer [anon key]' \
  -H 'Content-Type: application/json' \
  -d '{
    "task_id": "33333333-3333-3333-3333-333333333333",
    "user_id": "00000000-0000-0000-0000-000000000000",
    "action": "status_updated",
    "details": {"from": "todo", "to": "in_progress"}
  }'
```

### `analytics-dashboard`
Returns aggregated statistics for a user’s dashboard.

**Endpoint**: `https://[your-project-ref].supabase.co/functions/v1/analytics-dashboard`

**Method**: `POST`

**Headers**:
```http
Authorization: Bearer [user JWT]
Content-Type: application/json
```

**Request Body**:
```json
{
  "user_id": "uuid",
  "project_id": "uuid (optional)"
}
```

**Response**:
```json
{
  "total_tasks": 42,
  "completed_tasks": 15,
  "completion_rate": 36,
  "priority_stats": {
    "high": 5,
    "medium": 25,
    "low": 12
  },
  "status_stats": {
    "todo": 20,
    "in_progress": 7,
    "done": 15
  },
  "overdue_tasks": 3,
  "last_updated": "2024-01-15T10:30:00Z"
}
```

**Example cURL**:
```bash
curl -X POST 'https://[project].supabase.co/functions/v1/analytics-dashboard' \
  -H 'Authorization: Bearer [user JWT]' \
  -H 'Content-Type: application/json' \
  -d '{
    "user_id": "00000000-0000-0000-0000-000000000000",
    "project_id": "11111111-1111-1111-1111-111111111111"
  }'
```

## JavaScript Client Examples

### Initialize Client
```javascript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Fetch Tasks for a Project
```javascript
const { data: tasks, error } = await supabase
  .from('app_1a7c_tasks')
  .select('*')
  .eq('project_id', '11111111-1111-1111-1111-111111111111')
  .order('position', { ascending: true })
```

### Create a New Task
```javascript
const { data: task, error } = await supabase
  .from('app_1a7c_tasks')
  .insert({
    user_id: currentUser.id,
    project_id: selectedProjectId,
    title: 'New Task',
    description: 'Task description',
    status: 'todo',
    priority: 'medium',
    due_date: new Date().toISOString(),
    position: 0
  })
  .select()
  .single()
```

### Update Task Status (Drag‑and‑Drop)
```javascript
const { error } = await supabase
  .from('app_1a7c_tasks')
  .update({
    status: 'in_progress',
    position: newPosition,
    updated_at: new Date().toISOString()
  })
  .eq('id', taskId)
```

### Subscribe to Real‑Time Updates
```javascript
const channel = supabase
  .channel('tasks')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'app_1a7c_tasks'
    },
    (payload) => {
      console.log('Task changed:', payload)
      // Update UI
    }
  )
  .subscribe()
```

### Upload Task Attachment
```javascript
const { data, error } = await supabase.storage
  .from('app_1a7c_attachments')
  .upload(`/${userId}/${fileName}`, file)
```

## Error Handling

All Supabase client methods return an object with `data` and `error` properties.

```javascript
const { data, error } = await supabase.from('app_1a7c_tasks').select('*')

if (error) {
  console.error('Supabase error:', error.message)
  // Handle error (show user message, retry, etc.)
} else {
  // Use data
}
```

Common errors:
- `401 Unauthorized`: Invalid or missing JWT
- `403 Forbidden`: RLS policy violation (user trying to access another user’s data)
- `422 Unprocessable Entity`: Validation error (e.g., invalid `status` value)

## Rate Limiting

Supabase imposes rate limits based on your plan. Monitor usage in the Supabase dashboard.

## Support

For API issues:
1. Check Supabase logs in the dashboard
2. Verify RLS policies match the schema
3. Ensure JWT token is valid and not expired
4. Confirm environment variables are set correctly

---

*This documentation reflects the current Supabase schema and Edge Functions. Update when modifying the database structure.*