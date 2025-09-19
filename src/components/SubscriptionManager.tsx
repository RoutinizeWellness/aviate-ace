import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useConvexAuth';
import { getSubscriptionDetails, cancelSubscription, updateSubscriptionPlan, processRefund } from '@/services/stripe/backend';
import { PRICING_PLANS } from '@/config/pricing';

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  plan: any;
  cancelAtPeriodEnd: boolean;
}

const SubscriptionManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const sub = await getSubscriptionDetails(user._id);
        setSubscription(sub);
      } catch (error) {
        console.error('Error fetching subscription:', error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, toast]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      setCancelling(true);
      await cancelSubscription(subscription.id);
      
      // Update local state
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true
      });
      
      toast({
        title: "Success",
        description: "Your subscription will be cancelled at the end of the billing period",
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdatePlan = async (newPlanId: string) => {
    if (!subscription) return;
    
    try {
      setUpdating(true);
      await updateSubscriptionPlan({
        subscriptionId: subscription.id,
        newPlanId
      });
      
      // Update local state
      const newPlan = PRICING_PLANS.find(p => p.id === newPlanId);
      if (newPlan) {
        setSubscription({
          ...subscription,
          plan: newPlan
        });
      }
      
      toast({
        title: "Success",
        description: "Your subscription plan has been updated",
      });
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription plan",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async (paymentIntentId: string) => {
    try {
      await processRefund({
        paymentIntentId,
        reason: 'requested_by_customer'
      });
      
      toast({
        title: "Success",
        description: "Refund has been processed",
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: "Failed to process refund",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading subscription details...</div>;
  }

  if (!subscription) {
    return <div>No active subscription found</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
          <CardDescription>
            Manage your subscription plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Plan</h3>
              <p>{subscription.plan?.name || 'Unknown Plan'}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="capitalize">{subscription.status}</p>
            </div>
            <div>
              <h3 className="font-medium">Billing Period</h3>
              <p>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">Auto-renewal</h3>
              <p>{subscription.cancelAtPeriodEnd ? 'Cancelled' : 'Active'}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {!subscription.cancelAtPeriodEnd ? (
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </Button>
          ) : (
            <Button variant="outline" disabled>
              Subscription Cancelled
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Plan</CardTitle>
          <CardDescription>
            Upgrade or downgrade your subscription plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRICING_PLANS.filter(plan => plan.id !== subscription.plan?.id).map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>${plan.price.toFixed(2)}/{plan.currency}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => handleUpdatePlan(plan.id)}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Switch to this plan'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receipts & Refunds</CardTitle>
          <CardDescription>
            Access your payment receipts or request a refund
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Recent Payments</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">Aviate Ace {subscription.plan?.name} Subscription</p>
                    <p className="text-sm text-muted-foreground">Paid on {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefund('pi_mock1234567890')}
                    >
                      Request Refund
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionManager;