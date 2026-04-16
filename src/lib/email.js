import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Default from email (can be changed by user later)
const DEFAULT_FROM = 'onboarding@resend.dev';
const APP_NAME = 'KanbanFlow';

/**
 * Send an email using Resend
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} [options.from] - Sender email (defaults to onboarding@resend.dev)
 * @returns {Promise<Object>} Resend response
 */
export async function sendEmail({ to, subject, html, from = DEFAULT_FROM }) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${from}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Email sending failed:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email to new users
 * @param {string} email - User email
 * @param {string} name - User name
 * @returns {Promise<Object>} Send result
 */
export async function sendWelcomeEmail(email, name = 'there') {
  const { renderWelcomeEmail } = await import('../emails/welcome.js');
  const html = renderWelcomeEmail({ name, appName: APP_NAME });
  
  return sendEmail({
    to: email,
    subject: `Welcome to ${APP_NAME}! Get Started with Your Kanban Boards`,
    html,
  });
}

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetLink - Password reset link
 * @returns {Promise<Object>} Send result
 */
export async function sendPasswordResetEmail(email, resetLink) {
  const { renderPasswordResetEmail } = await import('../emails/reset-password.js');
  const html = renderPasswordResetEmail({ resetLink, appName: APP_NAME });
  
  return sendEmail({
    to: email,
    subject: `Reset Your ${APP_NAME} Password`,
    html,
  });
}