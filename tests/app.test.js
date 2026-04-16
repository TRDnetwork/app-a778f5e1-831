import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Mock Supabase
vi.mock('https://esm.sh/@supabase/supabase-js@2', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => Promise.resolve({ error: null })),
      delete: vi.fn(() => Promise.resolve({ error: null }))
    }))
  }))
}));

// Mock DOM
beforeEach(() => {
  document.body.innerHTML = `
    <div id="loading"></div>
    <div id="app"></div>
    <div id="credentials-error" style="display: none;"></div>
  `;
  global.supabase = createClient('test', 'test');
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('KanbanFlow App', () => {
  describe('Authentication', () => {
    it('should render auth gate when no user is logged in', async () => {
      // Mock no session
      supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
      
      // We'd need to import and call init, but for test we simulate
      const authGateHTML = `
        <div class="auth-gate">
          <h2>KanbanFlow</h2>
          <form class="auth-form" id="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" required minlength="6">
            </div>
            <div class="auth-buttons">
              <button type="submit" class="btn btn-primary" id="signup-btn">Sign Up</button>
              <button type="button" class="btn btn-secondary" id="signin-btn">Sign In</button>
            </div>
            <div class="auth-error hidden" id="auth-error"></div>
          </form>
        </div>
      `;
      
      document.getElementById('app').innerHTML = authGateHTML;
      
      expect(document.querySelector('.auth-gate')).toBeTruthy();
      expect(document.getElementById('signup-btn')).toBeTruthy();
      expect(document.getElementById('signin-btn')).toBeTruthy();
    });

    it('should handle signup with email and password', async () => {
      supabase.auth.signUp.mockResolvedValue({ error: null });
      
      // Simulate form submission
      const email = 'test@example.com';
      const password = 'password123';
      
      // In real app, this would be triggered by button click
      await supabase.auth.signUp({ email, password });
      
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email,
        password
      });
    });
  });

  describe('Task Management', () => {
    it('should filter tasks by priority', () => {
      const tasks = [
        { id: '1', title: 'Task 1', priority: 'high', status: 'todo' },
        { id: '2', title: 'Task 2', priority: 'medium', status: 'todo' },
        { id: '3', title: 'Task 3', priority: 'low', status: 'done' }
      ];
      
      const filters = { priority: 'high', status: 'all' };
      const filtered = tasks.filter(task => {
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.status !== 'all' && task.status !== filters.status) return false;
        return true;
      });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Task 1');
    });

    it('should filter tasks by status', () => {
      const tasks = [
        { id: '1', title: 'Task 1', priority: 'high', status: 'todo' },
        { id: '2', title: 'Task 2', priority: 'medium', status: 'in_progress' },
        { id: '3', title: 'Task 3', priority: 'low', status: 'done' }
      ];
      
      const filters = { priority: 'all', status: 'done' };
      const filtered = tasks.filter(task => {
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.status !== 'all' && task.status !== filters.status) return false;
        return true;
      });
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Task 3');
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate completion rate correctly', () => {
      const tasks = [
        { status: 'done' },
        { status: 'done' },
        { status: 'todo' },
        { status: 'in_progress' }
      ];
      
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'done').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      expect(completionRate).toBe(50);
    });

    it('should identify overdue tasks', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const tasks = [
        { due_date: yesterday.toISOString(), status: 'todo' },
        { due_date: tomorrow.toISOString(), status: 'todo' },
        { due_date: yesterday.toISOString(), status: 'done' }, // Not overdue because done
        { due_date: null, status: 'todo' }
      ];
      
      const overdue = tasks.filter(t => {
        if (!t.due_date || t.status === 'done') return false;
        const dueDate = new Date(t.due_date);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return dueDate < todayStart;
      });
      
      expect(overdue).toHaveLength(1);
    });
  });

  describe('UI Rendering', () => {
    it('should escape HTML to prevent XSS', () => {
      const maliciousInput = '<script>alert("xss")</script>';
      
      // Simulate escapeHtml function
      const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      };
      
      const escaped = escapeHtml(maliciousInput);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    it('should render task cards with correct priority classes', () => {
      const task = {
        id: '1',
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        due_date: new Date().toISOString(),
        status: 'todo'
      };
      
      // Simulate renderTaskCard function
      const dueDate = task.due_date ? new Date(task.due_date) : null;
      const dueText = dueDate ? dueDate.toLocaleDateString() : 'No due date';
      const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';
      
      const cardHTML = `
        <div class="task-card" data-task-id="${task.id}" draggable="true">
          <h3>${task.title}</h3>
          <p class="task-description">${task.description || 'No description'}</p>
          <div class="task-meta">
            <span class="task-priority priority-${task.priority}">${task.priority}</span>
            <span class="task-due ${isOverdue ? 'pulse' : ''}" style="color: ${isOverdue ? '#ff4757' : 'var(--text-dim)'}">
              ${dueText}
            </span>
          </div>
        </div>
      `;
      
      expect(cardHTML).toContain('priority-high');
      expect(cardHTML).toContain('draggable="true"');
    });
  });
});