const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
const testEmail = async () => {
  console.log('🧪 Testing email configuration...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || 'contact@dafitech.org');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Not set');
  console.log('');
  
  if (!process.env.EMAIL_PASS) {
    console.log('❌ EMAIL_PASS not found in environment variables');
    console.log('📝 Please add EMAIL_PASS to your .env file');
    return;
  }
  
  try {
    // Create transporter
    console.log('🔧 Creating email transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'contact@dafitech.org',
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Verify connection
    console.log('🔍 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Email connection verified successfully!\n');
    
    // Send test email
    console.log('📧 Sending test email...');
    const mailOptions = {
      from: process.env.EMAIL_USER || 'contact@dafitech.org',
      to: process.env.EMAIL_USER || 'contact@dafitech.org',
      subject: 'DafiTech Email Test',
      html: `
        <h2>Email Test Successful!</h2>
        <p>This is a test email from the DafiTech contact form system.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <hr>
        <p><em>If you received this email, the contact form email system is working correctly.</em></p>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Email sent to: contact@dafitech.org');
    
  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔐 Authentication Error - Possible solutions:');
      console.log('1. Check your Gmail username and password');
      console.log('2. Make sure you\'re using an App Password (not your regular password)');
      console.log('3. Enable 2-Factor Authentication on your Gmail account');
      console.log('4. Generate a new App Password in Google Account settings');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🌐 Connection Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify Gmail SMTP settings');
      console.log('3. Check if your firewall is blocking the connection');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('\n⏰ Timeout Error - Possible solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Try again in a few minutes');
      console.log('3. Check if Gmail is experiencing issues');
    }
  }
};

// Run the test
testEmail().then(() => {
  console.log('\n🏁 Email test completed');
  process.exit(0);
}).catch((error) => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
