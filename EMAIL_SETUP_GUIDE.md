# Email Setup Guide for DafiTech Contact Form

This guide explains how to configure email notifications for the contact form.

## Current Status

The contact form is currently **not configured** to send emails. Messages are being saved to the server console but not sent via email.

## Setup Instructions

### 1. Create a .env file

Create a `.env` file in the `server/` directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 2. Gmail App Password Setup

Since Gmail requires app-specific passwords for SMTP:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS` in your .env file

### 3. Alternative Email Services

You can also use other email services by modifying the transporter configuration in `server/routes/contact.js`:

#### Outlook/Hotmail
```javascript
const transporter = nodemailer.createTransporter({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

#### Custom SMTP
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## Testing

After setting up the email configuration:

1. Restart your server
2. Check the console for "📧 Email notifications: ✅ Configured"
3. Submit a test message through the contact form
4. Check your email inbox for the notification

## Current Behavior

- **Without email configuration**: Messages are saved to server console only
- **With email configuration**: Messages are sent to `wedibrhana@gmail.com` and saved to console
- **Email failures**: Messages are still saved even if email sending fails

## Troubleshooting

### Common Issues

1. **"Email not configured"**: Add `EMAIL_PASS` to your .env file
2. **"Authentication failed"**: Check your Gmail app password
3. **"Connection timeout"**: Verify your internet connection and Gmail settings

### Debug Information

Check the server console for detailed email status:
- ✅ Email sent successfully
- ⚠️ Email not configured
- ❌ Email sending failed

## Security Notes

- Never commit your .env file to version control
- Use app-specific passwords, not your main Gmail password
- Consider using environment-specific email addresses for testing
