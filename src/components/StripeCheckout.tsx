import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useConvexAuth';
import { useMutation, api } from '@/lib/convex';
import { PRICING_PLANS, type PricingPlan } from '@/config/pricing';
import { createPaymentIntent, confirmPayment } from '@/services/stripe/paymentService';

interface StripeCheckoutProps {
  plan: PricingPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "rgba(50,50,93,0.5)"
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
};

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ 
  plan,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const updateUserSubscription = useMutation(api.auth.updateUserSubscription);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: user.email,
        },
      });

      if (error) {
        throw new Error(error.message || 'Error creating payment method');
      }

      // Create payment intent on the backend
      const paymentIntentData = await createPaymentIntent({
        planId: plan.id,
        userId: user._id,
        email: user.email
      });

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        throw new Error(result.error.message || 'Error confirming payment');
      }

      // If payment is successful, update user subscription
      if (result.paymentIntent?.status === 'succeeded') {
        await updateUserSubscription({
          userId: user._id,
          subscription: plan.aircraftType,
          planId: plan.id
        });

        toast({
          title: "Payment Successful",
          description: `You have successfully purchased the ${plan.name} plan!`,
        });

        setIsProcessing(false);
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred while processing your payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Payment Details</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border rounded-md p-3">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">${plan.price.toFixed(2)} {plan.currency}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="flex-1"
        >
          {isProcessing ? "Processing..." : `Pay $${plan.price.toFixed(2)}`}
        </Button>
      </div>
    </form>
  );
};