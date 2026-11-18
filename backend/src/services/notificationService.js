const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const config = require('../config/config');

let transporter = null;

// Initialize Nodemailer if credentials are configured
if (config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_PORT === 465,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  });
}

/**
 * Dispatch notification (In-app + Optional Email)
 */
async function sendNotification({ recipientId, title, message, type = 'system', link = '', recipientEmail = null }) {
  try {
    // 1. Create In-App Notification Record
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      link
    });

    // 2. Send Email if SMTP configured and recipient email provided
    if (transporter && recipientEmail) {
      try {
        await transporter.sendMail({
          from: config.EMAIL_FROM,
          to: recipientEmail,
          subject: `[EventNest] ${title}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 16px 24px; border-radius: 8px; margin-bottom: 20px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">EventNest College Portal</h1>
              </div>
              <h2 style="color: #1e293b; font-size: 18px; margin-top: 0;">${title}</h2>
              <p style="color: #475569; font-size: 15px; line-height: 1.6;">${message}</p>
              ${link ? `<div style="margin-top: 24px;"><a href="${link}" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; font-size: 14px; display: inline-block;">View in EventNest</a></div>` : ''}
              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">You received this notification from EventNest GTBIT / GGSIPU College Event Management System.</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.warn(`[Nodemailer Notice] Email delivery skipped for ${recipientEmail}: ${mailErr.message}`);
      }
    } else {
      // In-app log for demonstration visibility
      console.log(`[Notification Dispatched] To: ${recipientId} | [${type.toUpperCase()}] ${title}: ${message}`);
    }

    return notification;
  } catch (err) {
    console.error('[Notification Service Error]', err);
    return null;
  }
}

module.exports = {
  sendNotification
};
