import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id, project_id } = await req.json()

    // Get task statistics for dashboard
    const { data: tasks, error } = await supabaseClient
      .from('app_1a7c_tasks')
      .select('status, priority, due_date')
      .eq('user_id', user_id)
      .eq(project_id ? 'project_id' : 'user_id', project_id || user_id)

    if (error) throw error

    // Calculate statistics
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(t => t.status === 'done').length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    
    const priorityStats = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length,
    }

    const statusStats = {
      todo: tasks.filter(t => t.status === 'todo').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      done: tasks.filter(t => t.status === 'done').length,
    }

    // Calculate overdue tasks
    const overdueTasks = tasks.filter(t => 
      t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
    ).length

    return new Response(
      JSON.stringify({
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        completion_rate: Math.round(completionRate),
        priority_stats: priorityStats,
        status_stats: statusStats,
        overdue_tasks: overdueTasks,
        last_updated: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})