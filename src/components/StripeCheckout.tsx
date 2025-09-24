import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useConvexAuth';
import { useMutation, api } from '@/lib/convex';
import { PRICING_PLANS, type PricingPlan } from '@/config/pricing';
import { createCheckoutSession } from '@/services/autumn/backend';
import { Button } from '@/components/ui/button';

interface AutumnCheckoutProps {
  plan: PricingPlan;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const StripeCheckout: React.FC<AutumnCheckoutProps> = ({ 
  plan,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const updateUserSubscription = useMutation(api.auth.updateUserSubscription);

  useEffect(() => {
    // Check if there's a saved plan selection from before login
    const savedPlan = localStorage.getItem('selectedPlan');
    if (savedPlan) {
      localStorage.removeItem('selectedPlan');
      // Plan is already passed as a prop, so we don't need to do anything here
      // This is just to clean up any saved plan data
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from bubbling up
    
    console.log('Form submission started');
    
    if (!user) {
      console.log('User not authenticated');
      // Save the selected plan to localStorage
      localStorage.setItem('selectedPlan', JSON.stringify(plan));
      toast({
        title: "Authentication Required",
        description: "You must be logged in to purchase a plan. You will be redirected to login.",
        variant: "destructive",
      });
      
      // Redirect to login with return URL
      setTimeout(() => {
        window.location.href = '/login?returnUrl=/subscription-management';
      }, 2000);
      return;
    }

    setIsProcessing(true);
    console.log('Processing payment for plan:', plan);

    try {
      // Update user subscription in Convex FIRST
      console.log('Updating user subscription in Convex with:', {
        userId: user._id,
        subscription: plan.aircraftType
      });
      
      await updateUserSubscription({
        userId: user._id,
        subscription: plan.aircraftType,
        planId: plan.id
      });

      // Create checkout session with Autumn
      console.log('Creating checkout session with params:', {
        productId: plan.productId || plan.id,
        userId: user._id,
        email: user.email
      });
      
      const checkoutData = await createCheckoutSession({
        productId: plan.productId || plan.id,
        userId: user._id,
        email: user.email
      });

      console.log('Checkout session created:', checkoutData);

      if (!checkoutData.checkoutUrl) {
        throw new Error("Failed to create checkout session - no checkout URL returned");
      }

      toast({
        title: "Redirecting to Payment",
        description: `You will be redirected to complete your ${plan.name} purchase.`,
      });

      // Redirect to checkout URL
      console.log('Redirecting to:', checkoutData.checkoutUrl);
      window.location.href = checkoutData.checkoutUrl;

      setIsProcessing(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "An error occurred while processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4">Payment Details</h3>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">€{plan.price.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Display product ID for debugging */}
        <div className="mt-4 text-xs text-gray-500">
          Product ID: {plan.productId || plan.id}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            onCancel?.();
          }}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isProcessing}
          className="bg-primary hover:bg-primary-dark"
        >
          {isProcessing ? 'Processing...' : `Pay €${plan.price.toFixed(2)}`}
        </Button>
      </div>
      
      {/* Display processing status */}
      {isProcessing && (
        <div className="text-center text-sm text-gray-500">
          Processing your payment, please wait...
        </div>
      )}
    </form>
  );
};

// Legacy export
export const AutumnCheckout = StripeCheckout;