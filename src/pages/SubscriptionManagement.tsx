import React, { useMemo, useState } from 'react';
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
  Mail
} from 'lucide-react';
import { useAuth } from '@/hooks/useConvexAuth';
import SubscriptionManager from '@/components/SubscriptionManager';
import { useNavigate } from 'react-router-dom';
import { PRICING_PLANS } from '@/config/pricing';
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
  const [publicEmail, setPublicEmail] = useState("");

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
        <div className="mb-8">
<h1 className="text-3xl font-bold mb-2">{t('subscription.title')}</h1>
<p className="text-muted-foreground">{t('subscription.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SubscriptionManager publicEmail={publicEmail} />
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
<CardTitle>{t('subscription.availablePlans')}</CardTitle>
<CardDescription>{t('subscription.selectPlan')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user && (
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
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PRICING_PLANS.map((plan) => (
                    <div key={plan.id} className={`p-4 border rounded-lg ${highlightPlan(plan.id) ? 'ring-2 ring-primary' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{plan.name}</h3>
                        <Badge>€{plan.price.toFixed(2)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                      <Button
                        className="w-full"
                        onClick={async () => {
                          try {
                            let email = user?.email || publicEmail.trim();
                            let userId = (user?._id as unknown as string | undefined) || (email ? `guest_${btoa(email).replace(/=+/g, '')}` : undefined);
                            if (!email) {
                              alert('Introduce tu correo para continuar.');
                              return;
                            }
                            console.log('[UI] Creating checkout', { productId: plan.productId || plan.id, userId, email });
const result = await createCheckout({
                              productId: plan.productId || plan.id,
                              userId: userId!,
                              email: email!
                            });
                            console.log('[UI] Checkout result', result);
                            if ((result as any)?.error) {
                              alert((result as any).error);
                              return;
                            }
                            const url = (result as any)?.checkoutUrl;
                            if (url) {
                              localStorage.removeItem('selectedPlan');
                              window.location.assign(url);
                            } else {
                              alert('No se recibió URL de checkout.');
                            }
                          } catch (err: any) {
                            console.error('Checkout error:', err);
                            const msg = err?.message || 'No se pudo iniciar el checkout.';
                            alert(msg);
                          }
                        }}
                      >
{t('subscription.subscribe')}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
<CardTitle>{t('subscription.currentPlan')}</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{userSubscription.plan}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="default" className="bg-green-500">
                          {userSubscription.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Valid until {userSubscription.endDate}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
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
            
            <Card>
              <CardHeader>
<CardTitle>{t('subscription.quickActions')}</CardTitle>
                <CardDescription>Common subscription tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
{t('subscription.updatePaymentMethod')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
{t('subscription.viewBillingHistory')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
{t('subscription.requestRefund')}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
<CardTitle>{t('subscription.needHelp')}</CardTitle>
<CardDescription>{t('subscription.contactSupport')}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your subscription, our support team is here to help.
                </p>
                <Button className="w-full">Contact Support</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionManagement;
