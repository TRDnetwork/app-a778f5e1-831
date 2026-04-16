/**
 * Password reset email template
 * @param {Object} params
 * @param {string} params.resetLink - Password reset link
 * @param {string} params.appName - App name (KanbanFlow)
 * @returns {string} HTML email content
 */
export function renderPasswordResetEmail({ resetLink, appName }) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your ${appName} Password</title>
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
        
        .warning {
            background: rgba(255, 71, 87, 0.1);
            border: 1px solid rgba(255, 71, 87, 0.3);
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            color: #ff4757;
        }
        
        /* Reset Button */
        .reset-button {
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
        
        .reset-link {
            word-break: break-all;
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 14px;
            color: #8a8ab5;
            border: 1px solid rgba(0, 217, 255, 0.1);
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
            
            .reset-button {
                display: block;
                margin: 20px auto;
            }
            
            .reset-link {
                font-size: 12px;
                padding: 10px;
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
            <h2 class="greeting">Password Reset Request</h2>
            
            <p class="message">
                We received a request to reset your password for your ${appName} account. 
                If you didn't make this request, you can safely ignore this email.
            </p>
            
            <div class="warning">
                <strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.
            </div>
            
            <p class="message">
                Click the button below to reset your password:
            </p>
            
            <div style="text-align: center;">
                <a href="${resetLink}" class="reset-button">Reset Password</a>
            </div>
            
            <p class="message">
                Or copy and paste this link into your browser:
            </p>
            
            <div class="reset-link">${resetLink}</div>
            
            <p class="message">
                If you're having trouble with the button above, make sure you're using a modern web browser.
            </p>
            
            <p class="message">
                For security reasons, please don't share this email with anyone. 
                Our support team will never ask for your password.
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