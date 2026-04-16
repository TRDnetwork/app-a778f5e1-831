import { setupRealtime, teardownRealtime } from './realtime.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize Supabase
const supabaseUrl = window.__SUPABASE_URL__;
const supabaseAnonKey = window.__SUPABASE_ANON_KEY__;

if (!supabaseUrl || !supabaseAnonKey) {
    document.getElementById('credentials-error').style.display = 'block';
    throw new Error('Supabase credentials not injected');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// State
let currentUser = null;
let tasks = [];
let projects = [];
let filters = { priority: 'all', status: 'all' };
let currentProjectId = null;

// DOM Elements
const appEl = document.getElementById('app');
const loadingEl = document.getElementById('loading');

// Initialize app
async function init() {
    try {
        // Try to get session (wrapped for sandbox resilience)
        try {
            const { data: { session } } = await supabase.auth.getSession();
            currentUser = session?.user || null;
        } catch (authError) {
            console.warn('Auth init failed (sandbox):', authError);
            currentUser = null;
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            currentUser = session?.user || null;
            if (event === 'SIGNED_IN') {
                await loadData();
                setupRealtime(supabase, handleRealtimeUpdate);
            } else if (event === 'SIGNED_OUT') {
                teardownRealtime();
                tasks = [];
                projects = [];
            }
            render();
        });

        // Initial render
        render();
        
        // Load data if signed in
        if (currentUser) {
            await loadData();
            setupRealtime(supabase, handleRealtimeUpdate);
        }
    } catch (error) {
        console.error('Init error:', error);
        showError('Failed to initialize app');
    } finally {
        // Always hide loading and show app
        loadingEl.classList.add('hidden');
        appEl.classList.add('loaded');
    }
}

// Load data from Supabase
async function loadData() {
    try {
        // Load projects
        const { data: projectsData, error: projectsError } = await supabase
            .from('app_1a7c_projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (projectsError) throw projectsError;
        projects = projectsData || [];
        
        // Select first project if none selected
        if (projects.length > 0 && !currentProjectId) {
            currentProjectId = projects[0].id;
        }

        // Load tasks for current project
        await loadTasks();
    } catch (error) {
        console.error('Load data error:', error);
        showError('Failed to load data');
    }
}

async function loadTasks() {
    if (!currentProjectId) return;
    
    try {
        const { data: tasksData, error: tasksError } = await supabase
            .from('app_1a7c_tasks')
            .select('*')
            .eq('project_id', currentProjectId)
            .order('position', { ascending: true });

        if (tasksError) throw tasksError;
        tasks = tasksData || [];
    } catch (error) {
        console.error('Load tasks error:', error);
        showError('Failed to load tasks');
    }
}

// Handle realtime updates
function handleRealtimeUpdate(payload) {
    if (payload.table === 'app_1a7c_tasks') {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
            case 'INSERT':
                if (newRecord.project_id === currentProjectId) {
                    tasks.push(newRecord);
                }
                break;
            case 'UPDATE':
                if (newRecord.project_id === currentProjectId) {
                    const index = tasks.findIndex(t => t.id === newRecord.id);
                    if (index !== -1) {
                        tasks[index] = newRecord;
                    }
                } else {
                    // Task moved to different project
                    tasks = tasks.filter(t => t.id !== newRecord.id);
                }
                break;
            case 'DELETE':
                tasks = tasks.filter(t => t.id !== oldRecord.id);
                break;
        }
        render();
    }
}

// Render the app
function render() {
    if (!currentUser) {
        renderAuthGate();
    } else {
        renderApp();
    }
}

// Render auth gate
function renderAuthGate() {
    appEl.innerHTML = `
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

    const form = document.getElementById('auth-form');
    const signupBtn = document.getElementById('signup-btn');
    const signinBtn = document.getElementById('signin-btn');
    const errorEl = document.getElementById('auth-error');

    signupBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleAuth('signup');
    });

    signinBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleAuth('signin');
    });

    async function handleAuth(action) {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        errorEl.classList.add('hidden');
        
        try {
            if (action === 'signup') {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                showError('Check your email for confirmation!', false);
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            }
        } catch (error) {
            showError(error.message);
        }
    }

    function showError(message, isError = true) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        if (!isError) {
            errorEl.style.background = 'rgba(0, 217, 255, 0.1)';
            errorEl.style.color = 'var(--accent)';
        } else {
            errorEl.style.background = 'rgba(255, 71, 87, 0.1)';
            errorEl.style.color = '#ff4757';
        }
    }
}

// Render main app
function renderApp() {
    const filteredTasks = filterTasks();
    const stats = calculateStats();
    
    appEl.innerHTML = `
        <header class="header">
            <h1>KanbanFlow</h1>
            <div class="header-actions">
                <select class="filter-select" id="project-select">
                    ${projects.map(p => `
                        <option value="${p.id}" ${p.id === currentProjectId ? 'selected' : ''}>
                            ${p.name}
                        </option>
                    `).join('')}
                </select>
                <button class="btn btn-secondary" id="signout-btn">Sign Out</button>
            </div>
        </header>

        <aside class="sidebar" id="sidebar">
            <button class="sidebar-toggle" id="sidebar-toggle">☰</button>
            <nav class="sidebar-nav">
                <a href="#" class="nav-item active" data-view="board">
                    <span class="nav-icon">📋</span>
                    <span class="nav-text">Board</span>
                </a>
                <a href="#" class="nav-item" data-view="dashboard">
                    <span class="nav-icon">📊</span>
                    <span class="nav-text">Dashboard</span>
                </a>
                <a href="#" class="nav-item" id="new-task-btn">
                    <span class="nav-icon">+</span>
                    <span class="nav-text">New Task</span>
                </a>
            </nav>
        </aside>

        <main class="main-content" id="main-content">
            <div class="dashboard ${currentView !== 'dashboard' ? 'hidden' : ''}" id="dashboard-view">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${stats.total}</div>
                        <div class="stat-label">Total Tasks</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.completed}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.inProgress}</div>
                        <div class="stat-label">In Progress</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${stats.overdue}</div>
                        <div class="stat-label">Overdue</div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">Completion Rate</h3>
                    <div class="chart" id="chart"></div>
                </div>
            </div>

            <div class="board-view ${currentView !== 'board' ? 'hidden' : ''}" id="board-view">
                <div class="filters">
                    <div class="filter-group">
                        <label>Priority:</label>
                        <select class="filter-select" id="priority-filter">
                            <option value="all">All</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Status:</label>
                        <select class="filter-select" id="status-filter">
                            <option value="all">All</option>
                            <option value="todo">Todo</option>
                            <option value="in_progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                </div>

                <div class="kanban-board" id="kanban-board">
                    ${renderColumn('todo', 'Todo', filteredTasks)}
                    ${renderColumn('in_progress', 'In Progress', filteredTasks)}
                    ${renderColumn('done', 'Done', filteredTasks)}
                </div>
            </div>
        </main>

        <footer class="footer">
            <div class="footer-stats">
                <div class="footer-stat">
                    <div class="footer-value">${stats.completionRate}%</div>
                    <div class="footer-label">Completion</div>
                </div>
                <div class="footer-stat">
                    <div class="footer-value">${stats.highPriority}</div>
                    <div class="footer-label">High Priority</div>
                </div>
                <div class="footer-stat">
                    <div class="footer-value">${stats.dueToday}</div>
                    <div class="footer-label">Due Today</div>
                </div>
            </div>
            <div class="user-info">
                <span class="user-email">${currentUser.email}</span>
            </div>
        </footer>
    `;

    // Initialize
    setupEventListeners();
    renderChart(stats);
    setupDragAndDrop();
}

let currentView = 'board';

function renderColumn(status, title, taskList) {
    const columnTasks = taskList.filter(task => task.status === status);
    
    return `
        <div class="column" data-status="${status}">
            <div class="column-header">
                <span>${title}</span>
                <span class="column-count">${columnTasks.length}</span>
            </div>
            <div class="tasks-list" data-status="${status}">
                ${columnTasks.map(task => renderTaskCard(task)).join('')}
            </div>
        </div>
    `;
}

function renderTaskCard(task) {
    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const dueText = dueDate ? dueDate.toLocaleDateString() : 'No due date';
    const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';
    
    return `
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
}

// Setup event listeners
function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('expanded');
    });

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (item.id === 'new-task-btn') {
                showTaskModal();
                return;
            }
            
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.dataset.view;
            currentView = view;
            
            document.getElementById('dashboard-view').classList.toggle('hidden', view !== 'dashboard');
            document.getElementById('board-view').classList.toggle('hidden', view !== 'board');
        });
    });

    // Project select
    const projectSelect = document.getElementById('project-select');
    projectSelect?.addEventListener('change', async (e) => {
        currentProjectId = e.target.value;
        await loadTasks();
        render();
    });

    // Filters
    document.getElementById('priority-filter')?.addEventListener('change', (e) => {
        filters.priority = e.target.value;
        render();
    });

    document.getElementById('status-filter')?.addEventListener('change', (e) => {
        filters.status = e.target.value;
        render();
    });

    // Sign out
    document.getElementById('signout-btn')?.addEventListener('click', async () => {
        await supabase.auth.signOut();
    });

    // Task card click for edit
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.task-card').classList.contains('dragging')) {
                const taskId = e.target.closest('.task-card').dataset.taskId;
                const task = tasks.find(t => t.id === taskId);
                if (task) showTaskModal(task);
            }
        });
    });
}

// Filter tasks
function filterTasks() {
    return tasks.filter(task => {
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.status !== 'all' && task.status !== filters.status) return false;
        return true;
    });
}

// Calculate statistics
function calculateStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'done').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        overdue: tasks.filter(t => {
            if (!t.due_date || t.status === 'done') return false;
            const dueDate = new Date(t.due_date);
            return dueDate < today;
        }).length,
        highPriority: tasks.filter(t => t.priority === 'high').length,
        due