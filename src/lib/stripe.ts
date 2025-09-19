import { loadStripe, Stripe } from '@stripe/stripe-js';

// Make sure to add your Stripe publishable key to your environment variables
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51S8j62K2LP4EoA9opSqnId83SRSjQcbDvt64ILmBbIiD1yDu9ktHEvvd7nPthoScbsnnNVMCHRzz2UruQLfNKYbt00Xy7qSLQT';

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};