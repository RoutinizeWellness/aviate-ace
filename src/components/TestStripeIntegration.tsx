import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { PRICING_PLANS } from '@/config/pricing';
import { StripeCheckout } from './StripeCheckout';

const TestStripeIntegration = () => {
  const stripePromise = getStripe();
  
  const handleSuccess = () => {
    console.log('Payment successful!');
    alert('Payment successful!');
  };
  
  const handleCancel = () => {
    console.log('Payment cancelled');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Test Stripe Integration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRICING_PLANS.slice(0, 2).map((plan) => (
          <div key={plan.id} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <p className="text-2xl font-bold mb-4">${plan.price.toFixed(2)} {plan.currency}</p>
            
            <Elements stripe={stripePromise}>
              <StripeCheckout 
                plan={plan}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </Elements>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestStripeIntegration;