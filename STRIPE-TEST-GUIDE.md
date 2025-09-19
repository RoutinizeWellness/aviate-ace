# Stripe Integration Test Guide

## Testing the Stripe Payment Flow

### Prerequisites
1. Ensure the development server is running (`npm run dev`)
2. Navigate to http://localhost:8081/pricing

### Test Steps

1. **Access the Pricing Page**
   - Open your browser and go to http://localhost:8081/pricing
   - You should see the pricing plans for A320 and B737 type ratings

2. **Select a Plan**
   - Click on the "Seleccionar plan" button for any of the premium plans
   - A Stripe checkout modal should appear

3. **Enter Test Payment Details**
   - Use the following test card details:
     - Card Number: 4242 4242 4242 4242
     - Expiration Date: Any future date (e.g., 12/30)
     - CVC: Any 3 digits (e.g., 123)
     - ZIP: Any 5 digits (e.g., 12345)
   - Click "Pay $X.XX" where X.XX is the plan price

4. **Verify Payment Success**
   - After processing, you should see an alert: "¡Pago completado con éxito! Tu suscripción ha sido activada."
   - The page should reload, showing your new subscription status

### Test Card Numbers for Different Scenarios

- **Successful Payment**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined Payment**: 4000 0000 0000 0002
- **Insufficient Funds**: 4000 0000 0000 9995

### Verifying Subscription Updates

1. After a successful payment, log in to the application
2. Navigate to the user profile or subscription management page
3. Verify that the subscription status reflects the purchased plan

### Troubleshooting

**Issue: Stripe modal doesn't appear**
- Ensure all dependencies are installed (`npm install`)
- Check browser console for errors
- Verify the Stripe publishable key is correctly set in `.env`

**Issue: Payment fails**
- Ensure you're using test card numbers
- Check the browser console for error messages
- Verify network connectivity

**Issue: Subscription not updated**
- Check the Convex dashboard for any errors in the `updateUserSubscription` function
- Verify the user is properly authenticated