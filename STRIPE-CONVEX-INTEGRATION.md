# Stripe and Convex Integration Guide

This document explains how to properly set up and use the Stripe and Convex integration in the aviate-ace project.

## Convex Setup

### 1. Initialize Convex
```bash
npx convex dev
```

This command will:
- Create a new Convex project (if needed)
- Deploy all functions in the `convex/` directory
- Generate API files in `convex/_generated/`
- Create a `.env.local` file with your Convex URL

### 2. Available Convex Functions

The project includes the following Convex modules:

1. **auth.ts** - Authentication functions
2. **courses.ts** - Course management functions
3. **exams.ts** - Exam functionality

Each module exports several functions that can be called from the frontend.

### 3. Environment Configuration

After running `npx convex dev`, your Convex URL will be automatically added to `.env.local`. 
For the application to work in development, copy this URL to your `.env` file:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

## Stripe Setup

### 1. Environment Variables

Add your Stripe publishable key to the `.env` file:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 2. Pricing Plans Configuration

The pricing plans are configured in `src/config/pricing.ts`. Each plan includes:
- Plan ID
- Name and description
- Price and currency
- Features list
- Aircraft type
- Stripe price ID

### 3. Stripe Price IDs

For testing, the project uses mock price IDs:
- `price_a320_basic_test`
- `price_a320_premium_test`
- `price_b737_basic_test`
- `price_b737_premium_test`
- `price_complete_package_test`

For production, replace these with actual Stripe price IDs from your Stripe dashboard.

## How It Works

### 1. Convex Activation

Convex is automatically activated when:
- The application starts
- The `ConvexProvider` component is initialized in `App.tsx`
- Functions are called via the generated API

### 2. Stripe Payment Flow

1. User selects a pricing plan on the Pricing page
2. The Stripe checkout modal opens
3. User enters payment information
4. A payment intent is created via the backend service
5. Payment is processed through Stripe
6. Upon successful payment:
   - User subscription is updated in Convex
   - Success message is displayed
   - Page is refreshed to reflect new subscription status

### 3. Backend Services

The `src/services/stripe/backend.ts` file contains:
- Payment intent creation
- Webhook handling
- Subscription management
- Receipt generation
- Refund processing

## Testing the Integration

### 1. Convex Functions

To test Convex functions:
1. Ensure `npx convex dev` is running
2. Visit the application in your browser
3. Check the browser console for Convex connection messages

### 2. Stripe Payments

To test Stripe payments:
1. Navigate to the Pricing page
2. Select any plan
3. Enter test card details:
   - Card number: 4242 4242 4242 4242
   - Expiration: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
4. Complete the payment

## Production Deployment

### 1. Convex Deployment

For production deployment:
```bash
npx convex deploy
```

### 2. Stripe Configuration

1. Replace test price IDs with production price IDs
2. Update the Stripe publishable key to your production key
3. Set up webhooks in your Stripe dashboard
4. Configure webhook signing secret in your backend

### 3. Environment Variables

Ensure the following environment variables are set in production:
```env
VITE_CONVEX_URL=https://your-production-deployment.convex.cloud
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key_here
```

## Troubleshooting

### Common Issues

1. **"Could not find public function" errors**
   - Run `npx convex dev` to deploy functions
   - Check that the function exists in the correct module
   - Restart the development server

2. **Stripe payment errors**
   - Verify the Stripe publishable key is correct
   - Ensure price IDs match those in your Stripe dashboard
   - Check browser console for detailed error messages

3. **Convex connection issues**
   - Verify the VITE_CONVEX_URL is correct
   - Check your internet connection
   - Ensure you're not behind a firewall blocking Convex

### Debugging Tips

1. Check the browser console for error messages
2. Use the Convex dashboard to monitor function calls
3. Enable verbose logging in development
4. Test functions individually using the Convex CLI

## Security Considerations

1. Never expose Stripe secret keys in client-side code
2. Always verify webhook signatures
3. Use HTTPS in production
4. Implement proper error handling
5. Sanitize user inputs
6. Follow the principle of least privilege for Convex functions

## Further Reading

- [Convex Documentation](https://docs.convex.dev/)
- [Stripe Documentation](https://stripe.com/docs)
- [React Stripe Elements](https://stripe.com/docs/stripe-js/react)