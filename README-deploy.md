# KanbanFlow Deployment Guide

## Prerequisites

- **Docker** (for Docker deployment) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (for Compose deployment) - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Supabase Account** - [Sign up at Supabase](https://supabase.com)
- **Resend Account** (optional, for emails) - [Sign up at Resend](https://resend.com)

## Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd kanbanflow
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the SQL from `db/schema.sql` in the Supabase SQL Editor
   - Go to **Project Settings → API** and copy:
     - `Project URL` → `VITE_SUPABASE_URL`
     - `anon public` key → `VITE_SUPABASE_ANON_KEY`

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   RESEND_API_KEY=your-resend-api-key-here  # Optional
   NODE_ENV=production
   SUPABASE_URL=your-project-ref.supabase.co
   ```

## Deploy with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t kanbanflow .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name kanbanflow \
     -p 8080:8080 \
     --env-file .env \
     kanbanflow
   ```

3. **Verify deployment:**
   ```bash
   docker ps
   curl http://localhost:8080
   ```

## Deploy with Docker Compose

1. **Start the application:**
   ```bash
   docker-compose up -d
   ```

2. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

## Deploy to Railway

1. **Install Railway CLI:**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and initialize:**
   ```bash
   railway login
   railway init
   ```

3. **Set environment variables:**
   ```bash
   railway variables set VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   railway variables set VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   railway variables set NODE_ENV=production
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

## Deploy to Render

1. **Create a new Static Site on Render**

2. **Connect your repository**

3. **Set environment variables in Render dashboard:**
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NODE_ENV`: `production`

4. **Build command:** (leave empty for static site)

5. **Publish directory:** `/`

6. **Click Deploy**

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes | - |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes | - |
| `RESEND_API_KEY` | Resend API key for emails | No | - |
| `NODE_ENV` | Environment (development/production) | No | `production` |
| `SUPABASE_URL` | Supabase URL for nginx proxy | Yes | - |

## Database Migrations

### Initial Setup
1. Log into your Supabase dashboard
2. Go to **SQL Editor**
3. Copy and paste the entire contents of `db/schema.sql`
4. Click **Run**

### Seed Data (Optional)
For testing, you can run `db/seed.sql` in the SQL Editor.

### Schema Updates
When updating the schema:
1. Create a new migration file in `db/migrations/`
2. Apply it in the Supabase SQL Editor
3. Test thoroughly before deploying to production

## Health Checks

The Docker container includes a health check that verifies:
- Nginx is serving the application
- The main page is accessible
- Port 8080 is responding

Check health status:
```bash
docker inspect --format='{{.State.Health.Status}}' kanbanflow
```

## Troubleshooting

### Application not loading
1. Check environment variables are set correctly
2. Verify Supabase credentials are valid
3. Check browser console for errors
4. View container logs: `docker logs kanbanflow`

### Database connection issues
1. Verify RLS policies are correctly set
2. Check if tables exist in Supabase
3. Ensure user has proper permissions

### Email not sending
1. Verify `RESEND_API_KEY` is set
2. Check Resend dashboard for logs
3. Ensure email domain is verified in Resend

### Performance issues
1. Check nginx logs: `docker exec kanbanflow tail -f /var/log/nginx/access.log`
2. Verify gzip compression is working
3. Check browser network tab for slow requests

## Security Notes

- Never commit `.env` file to version control
- Use HTTPS in production
- Regularly update dependencies
- Monitor Supabase dashboard for unusual activity
- Implement proper CORS policies for your domain

## Backup and Recovery

### Database Backups
Supabase provides automatic backups. For manual backups:
1. Use Supabase dashboard → Database → Backups
2. Export data via SQL in the SQL Editor

### Application Data
- User files are stored in Supabase Storage
- Configuration is in environment variables
- Static assets are in the Docker image

## Scaling

### Horizontal Scaling
For increased traffic:
1. Use multiple Docker containers behind a load balancer
2. Configure Supabase connection pooling
3. Enable CDN for static assets

### Database Scaling
- Upgrade Supabase plan for more resources
- Add database indexes for frequent queries
- Implement query optimization

## Monitoring

### Application Monitoring
- Check container logs: `docker logs kanbanflow`
- Monitor nginx access/error logs
- Use browser developer tools for frontend issues

### Database Monitoring
- Use Supabase dashboard analytics
- Monitor query performance
- Set up alerts for high resource usage

## Support

For deployment issues:
1. Check Docker/container logs
2. Verify all environment variables are set
3. Ensure ports are not blocked by firewall
4. Consult Supabase documentation for API issues

For application issues:
1. Check browser console for errors
2. Verify Supabase tables and RLS policies
3. Test with different browsers/devices