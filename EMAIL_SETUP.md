# Email Integration Setup for KanbanFlow

## Overview
Email functionality has been added to KanbanFlow using Resend for transactional emails. The integration includes welcome emails for new users and password reset emails.

## Files Added

### 1. `src/lib/email.js`
- **Purpose**: Email service utility wrapping Resend API
- **Key Functions**:
  - `sendEmail()`: Generic email sending function
  - `sendWelcomeEmail()`: Sends welcome email to new users
  - `sendPasswordResetEmail()`: Sends password reset email
- **Features**:
  - Error handling (won't crash the app)
  - Logging for debugging
  - Returns success/error status

### 2. `src/emails/welcome.js`
- **Purpose**: Welcome email template for new users
- **Features**:
  - Responsive HTML with inline CSS
  - Matches app's cyberpunk aesthetic
  - Lists key features of KanbanFlow
  - Professional layout with header, body, and footer
  - Unsubscribe link included

### 3. `src/emails/reset-password.js`
- **Purpose**: Password reset email template
- **Features**:
  - Responsive HTML with inline CSS
  - Clear reset button and fallback link
  - Security warnings and expiration notice
  - Professional layout matching app design

## Environment Variables Required

Add to your `.env` file:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Integration Points

### 1. User Signup (Welcome Email)
In your authentication flow (likely in `app.js`), add after successful signup:

```javascript
import { sendWelcomeEmail } from './src/lib/email.js';

// After successful signup
await sendWelcomeEmail(user.email, user.name || 'there');
```

### 2. Password Reset
When implementing password reset functionality, use:

```javascript
import { sendPasswordResetEmail } from './src/lib/email.js';

// Generate reset link (using Supabase Auth)
const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://yourapp.com/reset-password',
});

// Send email
await sendPasswordResetEmail(email, resetLink);
```

## Email Templates Design

Both templates feature:
- **Header**: Gradient background matching the app's cyberpunk theme
- **Body**: Clean, readable content with app-appropriate styling
- **Footer**: Legal links and unsubscribe option
- **Responsive**: Works on mobile and desktop
- **Branding**: Uses Orbitron and Rajdhani fonts from the app

## Testing

1. **Development**: Use Resend's test API key
2. **Production**: Use your production Resend API key
3. **Monitor**: Check Resend dashboard for delivery rates

## Customization

### Change Sender Email
Update the `DEFAULT_FROM` constant in `src/lib/email.js`:
```javascript
const DEFAULT_FROM = 'your-verified-domain@yourdomain.com';
```

### Modify Templates
Edit the HTML in:
- `src/emails/welcome.js` for welcome emails
- `src/emails/reset-password.js` for reset emails

### Add More Email Types
1. Create new template file in `src/emails/`
2. Add sending function in `src/lib/email.js`
3. Call the function from your application logic

## Resend Setup Instructions

1. **Sign up** at [resend.com](https://resend.com)
2. **Verify your domain** (or use the provided test domain)
3. **Get your API key** from the dashboard
4. **Add the API key** to your environment variables
5. **Test sending** with the provided functions

## Notes

- Emails are sent asynchronously and won't block the UI
- Failures are logged but won't crash the application
- The default "from" address uses Resend's onboarding domain (change for production)
- Templates include unsubscribe links as required by email regulations
- All styling is inline for maximum email client compatibility

## Next Steps

Consider adding:
1. Task assignment notifications
2. Due date reminders
3. Project invitation emails
4. Weekly digest emails
5. Email preferences in user settings