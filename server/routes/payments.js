const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const { auth } = require('../middleware/auth');
const Event = require('../models/Event');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent for event registration
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return res.status(503).json({ 
        msg: 'Payment processing is not configured. Please contact the administrator.',
        error: 'STRIPE_NOT_CONFIGURED'
      });
    }

    const { eventId, amount, currency = 'usd' } = req.body;

    // Validate event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Validate amount (minimum $1.00)
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (amountInCents < 100) {
      return res.status(400).json({ msg: 'Minimum payment amount is $1.00' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      metadata: {
        eventId: eventId,
        userId: req.user.id,
        eventTitle: event.title
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ msg: 'Payment processing error' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm payment and update event attendance
// @access  Private
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder') {
      return res.status(503).json({ 
        msg: 'Payment processing is not configured. Please contact the administrator.',
        error: 'STRIPE_NOT_CONFIGURED'
      });
    }

    const { paymentIntentId, eventId } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ msg: 'Payment not completed' });
    }

    // Verify the payment belongs to the user
    if (paymentIntent.metadata.userId !== req.user.id) {
      return res.status(403).json({ msg: 'Payment verification failed' });
    }

    // Update event attendance
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Remove existing RSVP if exists
    event.attendees = event.attendees.filter(
      attendee => attendee.user.toString() !== req.user.id
    );

    // Add paid attendance
    event.attendees.push({
      user: req.user.id,
      status: 'going',
      paymentStatus: 'paid',
      paymentIntentId: paymentIntentId,
      paidAt: new Date()
    });

    await event.save();
    await event.populate('attendees.user', 'name email');

    res.json({
      msg: 'Payment confirmed and registration completed',
      event: event
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ msg: 'Payment confirmation error' });
  }
});

// @route   GET /api/payments/events/:eventId/pricing
// @desc    Get event pricing information
// @access  Public
router.get('/events/:eventId/pricing', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ msg: 'Event not found' });
    }

    // Default pricing structure
    const pricing = {
      general: {
        amount: 25.00,
        currency: 'usd',
        description: 'General Admission'
      },
      student: {
        amount: 15.00,
        currency: 'usd',
        description: 'Student Discount (with valid ID)'
      },
      vip: {
        amount: 50.00,
        currency: 'usd',
        description: 'VIP Access with Premium Benefits'
      }
    };

    res.json({
      eventId: event._id,
      eventTitle: event.title,
      pricing: pricing,
      freeEvent: event.isFree || false
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({ msg: 'Error fetching pricing information' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (but verified with webhook secret)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // Additional processing can be added here
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      // Handle failed payment
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
