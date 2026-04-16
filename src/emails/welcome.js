/**
 * Welcome email template for new users
 * @param {Object} params
 * @param {string} params.name - User's name
 * @param {string} params.appName - App name (KanbanFlow)
 * @returns {string} HTML email content
 */
export function renderWelcomeEmail({ name, appName }) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${appName}</title>
    <style>
        /* Base styles */
        body {
            margin: 0;
            padding: 0;
            background-color: #0a0a14;
            font-family: 'Rajdhani', 'Helvetica Neue', Arial, sans-serif;
            color: #e0e0ff;
            line-height: 1.6;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #12121e;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #00d9ff 0%, #ff00aa 100%);
            padding: 30px 20px;
            text-align: center;
        }
        
        .header h1 {
            font-family: 'Orbitron', sans-serif;
            font-size: 28px;
            font-weight: 900;
            margin: 0;
            color: #0a0a14;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
        }
        
        /* Content */
        .content {
            padding: 40px 30px;
            border: 1px solid rgba(0, 217, 255, 0.2);
            border-top: none;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #00d9ff;
        }
        
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #8a8ab5;
        }
        
        .features {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
            border: 1px solid rgba(0, 217, 255, 0.1);
        }
        
        .features h3 {
            color: #00d9ff;
            margin-top: 0;
            font-family: 'Orbitron', sans-serif;
            font-size: 18px;
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .feature-list li {
            padding: 8px 0;
            border-bottom: 1px solid rgba(138, 138, 181, 0.1);
        }
        
        .feature-list li:last-child {
            border-bottom: none;
        }
        
        .feature-list li:before {
            content: "✓";
            color: #00d9ff;
            margin-right: 10px;
            font-weight: bold;
        }
        
        /* CTA Button */
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #00d9ff 0%, #ff00aa 100%);
            color: #0a0a14;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            font-family: 'Orbitron', sans-serif;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Footer */
        .footer {
            padding: 20px 30px;
            text-align: center;
            background-color: #0a0a14;
            border-top: 1px solid rgba(0, 217, 255, 0.2);
            font-size: 14px;
            color: #8a8ab5;
        }
        
        .footer a {
            color: #00d9ff;
            text-decoration: none;
        }
        
        .unsubscribe {
            font-size: 12px;
            margin-top: 15px;
            color: #666;
        }
        
        /* Responsive */
        @media only screen and (max-width: 600px) {
            .content {
                padding: 20px 15px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 20px;
            }
            
            .cta-button {
                display: block;
                margin: 20px auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${appName}</h1>
        </div>
        
        <div class="content">
            <h2 class="greeting">Welcome, ${name}!</h2>
            
            <p class="message">
                Thank you for joining ${appName} - your new project management tool with interactive Kanban boards. 
                We're excited to help you organize your workflow with style and efficiency.
            </p>
            
            <div class="features">
                <h3>Get Started with These Features:</h3>
                <ul class="feature-list">
                    <li>Drag-and-drop task cards between columns</li>
                    <li>Track tasks with priorities and due dates</li>
                    <li>Filter tasks by priority and status</li>
                    <li>Dashboard with completion rate analytics</li>
                    <li>Sleek cyberpunk-inspired dark UI</li>
                    <li>Real-time updates and collaboration</li>
                </ul>
            </div>
            
            <p class="message">
                Ready to organize your projects? Log in to start creating your first Kanban board.
            </p>
            
            <div style="text-align: center;">
                <a href="https://kanbanflow.app" class="cta-button">Launch Your Dashboard</a>
            </div>
            
            <p class="message">
                If you have any questions or need help getting started, feel free to reply to this email.
            </p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
            <p>This email was sent to you as part of your ${appName} account.</p>
            <p class="unsubscribe">
                <a href="https://kanbanflow.app/unsubscribe">Unsubscribe</a> | 
                <a href="https://kanbanflow.app/privacy">Privacy Policy</a> | 
                <a href="https://kanbanflow.app/terms">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>
  `;
}