const nodemailer = require('nodemailer');

/**
 * Send email utility for transactional emails (Password reset, notifications)
 * Uses EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD, CLIENT_URL
 */
const sendEmail = async (options) => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT, 10) || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  // Check if SMTP credentials are configured
  if (!host || !user || !pass) {
    console.warn('[Email Warning] SMTP credentials not fully configured (EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD). Password reset token generated securely in database.');
    return {
      success: false,
      message: 'SMTP credentials not configured. Token generated in database.'
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass
    }
  });

  const mailOptions = {
    from: `"BookSwap Campus Marketplace" <${user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">${options.message}</div>`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('[Email Service] Email sent successfully. Message ID:', info.messageId);
  return { success: true, info };
};

module.exports = sendEmail;
