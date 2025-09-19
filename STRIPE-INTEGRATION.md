# Stripe Integration Documentation

## Overview
This document explains how the Stripe payment system is integrated into the Aviate Ace application for handling aircraft type rating subscriptions.

## Configuration

### Environment Variables
The following environment variables need to be set in the `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51S8j62K2LP4EoA9opSqnId83SRSjQcbDvt64ILmBbIiD1yDu9ktHEvvd7nPthoScbsnnNVMCHRzz2UruQLfNKYbt00Xy7qSLQT
```

### Pricing Plans
Pricing plans are configured in `src/config/pricing.ts` with the following structure:

```typescript
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  aircraftType: string;
  stripePriceId?: string;
}
```

## Implementation Details

### Frontend Components
1. **StripeCheckout.tsx** - Handles the payment form and Stripe integration
2. **Pricing.tsx** - Displays pricing plans and manages the checkout flow
3. **stripe.ts** - Initializes the Stripe.js library
4. **paymentService.ts** - (Simulated) backend service for creating payment intents

### Payment Flow
1. User selects a pricing plan on the Pricing page
2. Stripe checkout modal opens with payment form
3. User enters card details
4. Payment is processed through Stripe
5. On successful payment, user subscription is updated in the database
6. User is notified of successful payment

### Convex Integration
The `updateUserSubscription` mutation in `convex/auth.ts` is used to update the user's subscription status after a successful payment.

## Testing
To test the Stripe integration:

1. Navigate to the Pricing page
2. Select any plan
3. Enter test card details:
   - Card Number: 4242 4242 4242 4242
   - Expiration: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
4. Complete the payment
5. Verify the subscription is updated

## Security Considerations
- Publishable key is used on the frontend (safe to expose)
- Secret key should only be used on the backend (not included in this demo)
- All payment processing is handled by Stripe.js on the frontend
- User subscription updates are handled securely through Convex mutations

## Future Improvements
1. Implement real backend endpoints for creating payment intents
2. Add webhook handling for payment confirmations
3. Implement subscription management features
4. Add receipt generation
5. Implement refund functionality
