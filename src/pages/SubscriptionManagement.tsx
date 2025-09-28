import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  Award,
  DollarSign,
  ExternalLink,
  Mail,
  Receipt,
  HelpCircle,
  Star,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useConvexAuth';
import SubscriptionManager from '@/components/SubscriptionManager';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS, getTranslatedPlans } from '@/config/pricing';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const SubscriptionManagement = () => {
  const { user } = useAuth();
  const createCheckout = useAction(api.autumn.createCheckoutSession);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [publicEmail, setPublicEmail] = useState(() => {
    // Auto-detect user email if available
    return user?.email || "";
  });

  // Update email when user changes
  useEffect(() => {
    if (user?.email && user.email !== publicEmail) {
      setPublicEmail(user.email);
    }
  }, [user?.email]);

  // Pre-select a plan if user came from landing selection
  const preselectedPlanId = useMemo(() => {
    try {
      const saved = localStorage.getItem('selectedPlan');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return typeof parsed === 'string' ? parsed : parsed.id || null;
    } catch {
      return null;
    }
  }, []);

  // Get translated pricing plans
  const translatedPlans = getTranslatedPlans(PRICING_PLANS, t);
  
  const highlightPlan = (planId: string) => preselectedPlanId && preselectedPlanId === planId;
  
  // Mock user subscription data
  const userSubscription = {
    plan: 'A320 Type Rating - Premium',
    status: 'active',
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    features: [
      'Unlimited practice exams',
      'Advanced analytics',
      'Personalized study recommendations',
      'Offline access to materials'
    ]
  };

  // Quick Actions handlers
  const handleUpdatePayment = async () => {
    try {
      toast({
        title: t('quickActions.updating') || 'Updating payment method...',
        description: "Redirecting to payment update page...",
      });
      
      // Simulate actual payment update functionality
      const updateUrl = `https://billing.autumn.com/customer/payment-methods?customer_id=${user?.email || publicEmail}`;
      
      setTimeout(() => {
        window.open(updateUrl, '_blank');
      }, 1000);
    } catch (error) {
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to open payment update page',
        variant: 'destructive'
      });
    }
  };

  const handleViewBilling = async () => {
    try {
      toast({
        title: t('quickActions.viewingBilling') || 'Opening billing history...',
        description: "Loading your billing information...",
      });
      
      // Simulate actual billing history functionality
      const billingUrl = `https://billing.autumn.com/customer/invoices?customer_id=${user?.email || publicEmail}`;
      
      setTimeout(() => {
        window.open(billingUrl, '_blank');
      }, 1000);
    } catch (error) {
      toast({
        title: t('common.error') || 'Error',
        description: 'Failed to open billing history',
        variant: 'destructive'
      });
    }
  };

  const handleRequestRefund = async () => {
    try {
      const confirmMessage = 'Are you sure you want to request a refund? This action cannot be undone.';
      
      if (confirm(confirmMessage)) {
        // Simulate refund request processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: t('quickActions.refundSuccess') || 'Refund Request Submitted',
          description: "Your refund request will be processed within 3-5 business days.",
          variant: "default",
        });
      }
    } catch (error) {
      toast({
        title: t('common.error') || 'Error',
        description: t('quickActions.refundError') || 'Failed to process refund request',
        variant: 'destructive'
      });
    }
  };

  const handleContactSupport = () => {
    window.open('mailto:support@pilotprepflightx.com?subject=Subscription Support', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
                <Plane className="w-6 h-6" />
              </div>
              <div>
<h1 className="text-xl font-bold">{t('subscription.title')}</h1>
<p className="text-xs text-muted-foreground">{t('subscription.subtitle')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
<Button variant="outline" size="sm" onClick={() => navigate(user ? '/dashboard' : '/')}>{t('common.back')}</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('subscription.title')}</h1>
          <p className="text-xl text-muted-foreground mb-6">{t('subscription.subtitle')}</p>
          <div className="flex items-center justify-center gap-4">
            <Badge className="bg-primary/10 text-primary">
              <Zap className="w-4 h-4 mr-1" />
              {t('pricing.instantAccess')}
            </Badge>
            <Badge className="bg-success/10 text-success">
              <Star className="w-4 h-4 mr-1" />
              {t('pricing.premiumContent')}
            </Badge>
          </div>
        </div>

        {/* Pricing Plans Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">{t('subscription.availablePlans')}</h2>
          
          {!user && (
            <div className="max-w-md mx-auto mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('subscription.email')}</label>
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={publicEmail}
                      onChange={(e) => setPublicEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">{t('subscription.useEmailNote')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {translatedPlans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  highlightPlan(plan.id) ? 'ring-2 ring-primary shadow-xl scale-105' : ''
                } ${
                  plan.popular ? 'border-primary' : ''
                } ${
                  plan.bestValue ? 'border-success' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-primary text-primary-foreground rounded-l-none">
                      {t('pricing.popular')}
                    </Badge>
                  </div>
                )}
                {plan.bestValue && (
                  <div className="absolute -top-1 -right-1">
                    <Badge className="bg-success text-success-foreground rounded-l-none">
                      {t('pricing.bestValue')}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    {plan.durationMonths === 0 ? (
                      <Award className="w-8 h-8 text-primary" />
                    ) : plan.durationMonths >= 12 ? (
                      <Star className="w-8 h-8 text-primary" />
                    ) : (
                      <Zap className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    €{plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      {plan.durationMonths === 0 ? '' : 
                       plan.durationMonths >= 12 ? `/${t('pricing.perYear')}` : `/${t('pricing.perMonth')}`}
                    </span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full ${plan.popular || plan.bestValue ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular || plan.bestValue ? 'default' : 'outline'}
                    onClick={async () => {
                      try {
                        let email = user?.email || publicEmail.trim();
                        let userId = (user?._id as unknown as string | undefined) || (email ? `guest_${btoa(email).replace(/=+/g, '')}` : undefined);
                        if (!email) {
                          toast({
                            title: t('subscription.enterEmailToContinue'),
                            variant: "destructive"
                          });
                          return;
                        }
                        const result = await createCheckout({
                          productId: plan.productId || plan.id,
                          userId: userId!,
                          email: email!
                        });
                        if ((result as any)?.error) {
                          toast({
                            title: "Checkout Error",
                            description: (result as any).error,
                            variant: "destructive"
                          });
                          return;
                        }
                        const url = (result as any)?.checkoutUrl;
                        if (url) {
                          localStorage.removeItem('selectedPlan');
                          // Store return URL for after payment completion
                          localStorage.setItem('postPaymentRedirect', user ? '/dashboard' : '/login?returnUrl=/dashboard');
                          window.location.assign(url);
                        } else {
                          toast({
                            title: t('subscription.noCheckoutUrl'),
                            variant: "destructive"
                          });
                        }
                      } catch (err: any) {
                        console.error('Checkout error:', err);
                        toast({
                          title: t('subscription.checkoutError'),
                          description: err?.message,
                          variant: "destructive"
                        });
                      }
                    }}
                  >
                    {plan.price === 0 ? t('pricing.startFree') : t('pricing.selectPlan')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Subscription & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {t('subscription.currentPlan')}
              </CardTitle>
              <CardDescription>{t('subscription.activeSubscriptionDetails')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{userSubscription.plan}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="bg-green-500">
                        {t('subscription.statusActive')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {t('subscription.validUntil')} {userSubscription.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">{t('subscription.planFeatures')}</h4>
                  <ul className="space-y-2">
                    {userSubscription.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {t('quickActions.title') || t('subscription.quickActions')}
                </CardTitle>
                <CardDescription>{t('quickActions.description') || t('subscription.commonTasks')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-muted"
                  onClick={handleUpdatePayment}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {t('quickActions.updatePayment') || t('subscription.updatePaymentMethod')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-muted"
                  onClick={handleViewBilling}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  {t('quickActions.viewBilling') || t('subscription.viewBillingHistory')}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-muted"
                  onClick={handleRequestRefund}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  {t('quickActions.requestRefund') || t('subscription.requestRefund')}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  {t('subscription.needHelp')}
                </CardTitle>
                <CardDescription>{t('subscription.supportText')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  onClick={handleContactSupport}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {t('subscription.contactSupport')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Legacy Subscription Manager */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Subscription Management</CardTitle>
              <CardDescription>Detailed subscription controls and information</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionManager publicEmail={publicEmail} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagement;
