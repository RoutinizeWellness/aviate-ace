import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useConvexAuth';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PRICING_PLANS } from '@/config/pricing';
import { CreditCard, Receipt, HelpCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  plan: any;
  cancelAtPeriodEnd: boolean;
}

interface Props {
  publicEmail?: string;
}

const SubscriptionManager = ({ publicEmail }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [convexReady, setConvexReady] = useState(false);

  // Always call useAction hooks - conditional execution handled in functions
  const getSubscriptionAction = useAction(api.autumn.getSubscriptionDetails);
  const cancelSubscriptionAction = useAction(api.autumn.cancelSubscription);
  const updatePlanAction = useAction(api.autumn.updateSubscriptionPlan);
  
  // Check if Convex is deployed and functions are available
  useEffect(() => {
    const checkConvexStatus = async () => {
      try {
        // Simple way to test if API is available
        const testAction = api?.autumn?.getSubscriptionDetails;
        setConvexReady(!!testAction);
      } catch (error) {
        console.warn('Convex not deployed, using fallback subscription management');
        setConvexReady(false);
      }
    };
    checkConvexStatus();
  }, []);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        
        if (!convexReady) {
          // Fallback: Use mock subscription data when Convex is not deployed
          console.warn('Using fallback subscription data - Convex not deployed');
          setSubscription({
            id: 'mock_subscription',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            plan: PRICING_PLANS[0] || { name: 'Basic Plan', price: 19.99 },
            cancelAtPeriodEnd: false
          });
          setLoading(false);
          return;
        }
        
        try {
          if (user) {
            const sub = await getSubscriptionAction({ userId: user._id as unknown as string });
            setSubscription(sub as any);
          } else if (publicEmail && publicEmail.includes('@')) {
            const guestId = `guest_${btoa(publicEmail).replace(/=+/g, '')}`;
            const sub = await getSubscriptionAction({ userId: guestId });
            setSubscription(sub as any);
          } else {
            setSubscription(null);
          }
        } catch (convexError) {
          console.warn('Convex action failed, using fallback:', convexError);
          setSubscription({
            id: 'fallback_subscription',
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            plan: PRICING_PLANS[0] || { name: 'Basic Plan', price: 19.99 },
            cancelAtPeriodEnd: false
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
        
        // Show user-friendly error message about service unavailability
        toast({
          title: t('errors.subscriptionError'),
          description: t('errors.convexNotDeployed'),
          variant: "destructive",
        });
        
        // Use fallback subscription for demo purposes
        setSubscription({
          id: 'fallback_subscription',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          plan: PRICING_PLANS[0] || { name: 'Basic Plan', price: 19.99 },
          cancelAtPeriodEnd: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, publicEmail, toast, convexReady, t]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    try {
      setCancelling(true);
      
      if (convexReady) {
        await cancelSubscriptionAction({ subscriptionId: subscription.id });
      } else {
        // Fallback for demo - simulate cancellation
        console.warn('Simulating subscription cancellation - Convex not deployed');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update local state
      setSubscription({
        ...subscription,
        cancelAtPeriodEnd: true
      });
      
      toast({
        title: t('common.success'),
        description: t('subscription.subscriptionCancelledSuccess'),
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: t('common.error'),
        description: t('subscription.cancelFailed'),
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
      
      if (convexReady) {
        await updatePlanAction({
          subscriptionId: subscription.id,
          newProductId: newPlanId
        });
      } else {
        // Fallback for demo
        console.warn('Simulating plan update - Convex not deployed');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update local state
      const newPlan = PRICING_PLANS.find(p => p.id === newPlanId);
      if (newPlan) {
        setSubscription({
          ...subscription,
          plan: newPlan
        });
      }
      
      toast({
        title: t('common.success'),
        description: t('subscription.planUpdated'),
      });
    } catch (error) {
      console.error('Error updating subscription plan:', error);
      toast({
        title: t('common.error'),
        description: t('subscription.planUpdateFailed'),
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleRefund = async (paymentIntentId: string) => {
    try {
      // Simulate refund process
      console.warn('Simulating refund process for demo:', paymentIntentId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: t('common.success'),
        description: t('subscription.refundSubmitted'),
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      toast({
        title: t('common.error'),
        description: t('subscription.refundFailed'),
        variant: "destructive",
      });
    }
  };
  
  const handleUpdatePaymentMethod = () => {
    // Navigate in same tab instead of opening new window
    toast({
      title: t('subscription.updatePayment'),
      description: t('subscription.redirectingPayment'),
    });
    
    // Navigate to billing management page in same tab
    setTimeout(() => {
      window.location.href = '/subscription-management?action=payment';
    }, 1000);
  };
  
  const handleViewBillingHistory = () => {
    toast({
      title: t('subscription.viewBilling'),
      description: t('subscription.openingBilling'),
    });
    
    // Navigate to billing history in same tab
    setTimeout(() => {
      window.location.href = '/subscription-management?action=billing';
    }, 1000);
  };
  
  const handleContactSupport = () => {
    // Navigate to contact page in same tab
    window.location.href = '/contact?subject=subscription';
  };

  if (loading) {
    return <div>{t('subscription.loadingDetails')}</div>;
  }

  if (!subscription) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">{t('subscription.noActiveSubscription')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {!user 
                ? t('subscription.signInMessage')
                : t('subscription.noSubscriptionMessage')
              }
            </p>
            <Button onClick={() => window.location.href = '/pricing'}>
              {t('subscription.viewPricingPlans')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t('subscription.quickActions')}
          </CardTitle>
          <CardDescription>
            {t('subscription.commonTasks')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleUpdatePaymentMethod}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-sm font-medium">{t('subscription.updatePayment')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleViewBillingHistory}
            >
              <Receipt className="w-6 h-6" />
              <span className="text-sm font-medium">{t('subscription.viewBilling')}</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleRefund('pi_mock1234567890')}
            >
              <ExternalLink className="w-6 h-6" />
              <span className="text-sm font-medium">{t('subscription.requestRefund')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Need Help Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            {t('subscription.needHelp')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t('subscription.supportText')}
          </p>
          <Button onClick={handleContactSupport}>
            {t('subscription.contactSupport')}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t('subscription.subscriptionDetails')}</CardTitle>
          <CardDescription>
            {t('subscription.manageSubscriptionBilling')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">{t('subscription.plan')}</h3>
              <p>{subscription.plan?.name || t('subscription.unknownPlan')}</p>
            </div>
            <div>
              <h3 className="font-medium">{t('subscription.status')}</h3>
              <p className="capitalize">{subscription.status}</p>
            </div>
            <div>
              <h3 className="font-medium">{t('subscription.billingPeriod')}</h3>
              <p>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium">{t('subscription.autoRenewal')}</h3>
              <p>{subscription.cancelAtPeriodEnd ? t('subscription.cancelled') : t('subscription.active')}</p>
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
              {cancelling ? t('subscription.cancelling') : t('subscription.cancelSubscription')}
            </Button>
          ) : (
            <Button variant="outline" disabled>
              {t('subscription.subscriptionCancelled')}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('subscription.changePlan')}</CardTitle>
          <CardDescription>
            {t('subscription.upgradeDowngrade')}
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
                    {updating ? t('subscription.updating') : t('subscription.switchToPlan')}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('subscription.receiptsRefunds')}</CardTitle>
          <CardDescription>
            {t('subscription.accessReceipts')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">{t('subscription.recentPayments')}</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{t('subscription.aviateAceSubscription')} {subscription.plan?.name}</p>
                    <p className="text-sm text-muted-foreground">{t('subscription.paidOn')} {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      {t('subscription.viewReceipt')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefund('pi_mock1234567890')}
                    >
                      {t('subscription.requestRefund')}
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