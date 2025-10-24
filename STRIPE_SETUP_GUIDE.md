# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payments for your OneTigray events platform.

## 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Start now" to create a new account
3. Complete the account setup process
4. Verify your email address

## 2. Get Your API Keys

1. Log into your Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

## 3. Set Up Webhook Endpoint (Optional but Recommended)

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

## 4. Update Environment Variables

Add these variables to your `server/.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

For the frontend, add this to your `client/.env` file:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 5. Test the Integration

### Test Cards (Test Mode Only)

Use these test card numbers to test payments:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date (e.g., 12/25) and any 3-digit CVC.

### Testing Steps

1. Start your server: `cd server && npm start`
2. Start your client: `cd client && npm start`
3. Log in as an admin
4. Create a new event with pricing enabled
5. Go to the event detail page
6. Click "Going (Pay)" to test the payment flow

## 6. Go Live (Production)

When you're ready to accept real payments:

1. Complete Stripe's account verification process
2. Switch to live mode in your Stripe Dashboard
3. Get your live API keys
4. Update your environment variables with live keys
5. Update your webhook endpoint URL to your production domain
6. Test with small amounts first

## 7. Features Included

### Event Pricing
- Set different prices for General, Student, and VIP tickets
- Toggle between free and paid events
- Admin can set pricing when creating/editing events

### Payment Processing
- Secure payment processing with Stripe
- Support for all major credit cards
- Automatic payment confirmation
- Payment status tracking

### User Experience
- Clear pricing display on event pages
- Payment modal with card input
- Success/failure feedback
- Automatic event registration after payment

## 8. Security Notes

- Never expose your secret keys in client-side code
- Always use HTTPS in production
- Validate webhook signatures
- Keep your API keys secure and rotate them regularly

## 9. Troubleshooting

### Common Issues

1. **"Invalid API key"**: Check that you're using the correct key for test/live mode
2. **"Payment failed"**: Verify the card details and ensure sufficient funds
3. **"Webhook signature verification failed"**: Check that your webhook secret is correct
4. **"CORS error"**: Ensure your frontend domain is allowed in Stripe settings

### Debug Mode

Enable debug logging by adding this to your server:

```javascript
// In server/index.js
if (process.env.NODE_ENV === 'development') {
  console.log('Stripe Secret Key:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Missing');
  console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing');
}
```

## 10. Support

- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Stripe Support: [https://support.stripe.com](https://support.stripe.com)
- OneTigray Support: Contact wediabrhana@gmail.com

---

**Note**: This integration is currently in test mode. Make sure to complete Stripe's verification process before going live with real payments.



