import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api';

// Check if Stripe is properly configured
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
const isStripeConfigured = stripePublishableKey && !stripePublishableKey.includes('placeholder');

const stripePromise = isStripeConfigured ? loadStripe(stripePublishableKey) : null;

const PaymentForm = ({ event, ticketType, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Validate event and pricing data
      if (!event || !event._id) {
        setError('Event information is missing');
        setLoading(false);
        return;
      }

      if (!event.pricing || !event.pricing[ticketType]) {
        setError('Pricing information is not available for this ticket type');
        setLoading(false);
        return;
      }

      // Create payment intent
      const response = await api.post('/payments/create-payment-intent', {
        eventId: event._id,
        amount: event.pricing[ticketType].amount,
        currency: event.pricing[ticketType].currency
      });

      // Check if Stripe is not configured
      if (response.data.error === 'STRIPE_NOT_CONFIGURED') {
        setError('Payment processing is not available at the moment. Please contact the administrator.');
        setLoading(false);
        return;
      }

      const { clientSecret } = response.data;

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on backend
        await api.post('/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          eventId: event._id
        });

        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">You have been registered for this event.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
        <p className="text-sm text-gray-600">{event.title}</p>
        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Ticket Type</h3>
        <p className="text-sm text-gray-600 capitalize">
          {ticketType} - ${event.pricing?.[ticketType]?.amount || 0}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ${event.pricing?.[ticketType]?.amount || 0}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({ isOpen, onClose, event, onSuccess }) => {
  const [ticketType, setTicketType] = useState('general');
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(isStripeConfigured);

  useEffect(() => {
    if (isOpen && event) {
      fetchPricing();
    }
  }, [isOpen, event]);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payments/events/${event._id}/pricing`);
      setPricing(response.data.pricing);
    } catch (error) {
      console.error('Error fetching pricing:', error);
      if (error.response?.data?.error === 'STRIPE_NOT_CONFIGURED') {
        setStripeConfigured(false);
      } else {
        // If pricing fetch fails, use the event's pricing data
        console.log('Using event pricing data as fallback');
        setPricing(event.pricing);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!event || !event._id) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Event Information</h3>
            <p className="text-gray-600">Please wait while we load the event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stripeConfigured) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Payment Not Available</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Processing Unavailable</h3>
            <p className="text-gray-600 mb-6">Payment processing is not configured yet. Please contact the administrator or try again later.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (event.isFree) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Free Event Registration</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Event</h3>
            <p className="text-gray-600 mb-6">This event is free to attend. No payment required.</p>
            <button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Register for Free
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pricing information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Event Registration</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Ticket Type
          </label>
          {pricing && Object.keys(pricing).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(pricing).map(([type, details]) => (
                <label key={type} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="ticketType"
                    value={type}
                    checked={ticketType === type}
                    onChange={(e) => setTicketType(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium capitalize">{type}</div>
                    <div className="text-sm text-gray-600">{details.description}</div>
                  </div>
                  <div className="text-lg font-semibold text-primary-600">
                    ${details.amount}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Pricing information is not available. Please contact the administrator.
              </p>
            </div>
          )}
        </div>

        {isStripeConfigured ? (
          <Elements stripe={stripePromise}>
            <PaymentForm
              event={{ ...event, pricing: pricing || event.pricing }}
              ticketType={ticketType}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Processing Unavailable</h3>
            <p className="text-gray-600 mb-6">Stripe payment processing is not configured. Please contact the administrator to set up payment processing.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
