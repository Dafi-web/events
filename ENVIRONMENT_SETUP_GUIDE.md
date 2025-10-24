# Environment Configuration Guide

This guide will help you set up the necessary environment variables to resolve the current errors.

## Current Issues

1. **Stripe 401 Errors**: Stripe API keys are not configured
2. **500 Internal Server Error**: Cloudinary configuration is missing
3. **File Upload Failures**: File upload service is not properly configured

## Required Environment Variables

### Server Configuration (`server/.env`)

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/onetigray

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration (REQUIRED for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration (REQUIRED for payments)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

### Client Configuration (`client/.env`)

Create a `.env` file in the `client` directory with the following variables:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# Stripe Configuration (REQUIRED for payments)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

## Setup Instructions

### 1. Cloudinary Setup (Required for file uploads)

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Go to your Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret
5. Add these to your `server/.env` file

### 2. Stripe Setup (Required for payments)

1. Go to [https://stripe.com](https://stripe.com)
2. Create an account
3. Go to Developers → API keys
4. Copy your:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)
5. Add the secret key to `server/.env`
6. Add the publishable key to `client/.env`

### 3. MongoDB Setup

You can use either:
- **Local MongoDB**: Install MongoDB locally
- **MongoDB Atlas**: Use the cloud service (recommended)

For Atlas, create a cluster and get your connection string.

### 4. JWT Secret

Generate a secure random string for JWT_SECRET:
```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Using OpenSSL
openssl rand -hex 64
```

## Testing the Configuration

After setting up the environment variables:

1. **Restart the server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Restart the client**:
   ```bash
   cd client
   npm start
   ```

3. **Test file uploads**: Try creating an event with images/videos
4. **Test payments**: Try the payment flow for paid events

## Common Issues

### "File upload service is not configured"
- Make sure Cloudinary credentials are set in `server/.env`
- Verify the credentials are correct

### "Payment processing is not configured"
- Make sure Stripe keys are set in both `server/.env` and `client/.env`
- Verify the keys are correct and from the same Stripe account

### "Invalid API key" from Stripe
- Make sure you're using test keys (start with `pk_test_` and `sk_test_`)
- Verify the keys are copied correctly (no extra spaces)

## Security Notes

- Never commit `.env` files to version control
- Use different keys for development and production
- Keep your API keys secure and rotate them regularly

## Need Help?

If you're still experiencing issues:
1. Check the server console for detailed error messages
2. Verify all environment variables are set correctly
3. Make sure both server and client are restarted after changes
4. Check the browser console for client-side errors
