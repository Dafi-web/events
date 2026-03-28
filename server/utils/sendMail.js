const nodemailer = require('nodemailer');

function createTransport() {
  if (!process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'contact@dafitech.org',
      pass: process.env.EMAIL_PASS
    }
  });
}

/**
 * @param {{ to: string, subject: string, text: string, html?: string }} opts
 */
async function sendMail(opts) {
  const transporter = createTransport();
  if (!transporter) {
    console.warn('[email] EMAIL_PASS not set — email not sent.');
    return { sent: false, error: 'not_configured' };
  }
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'contact@dafitech.org';
  await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html || opts.text.replace(/\n/g, '<br/>')
  });
  return { sent: true };
}

module.exports = { sendMail, createTransport };
