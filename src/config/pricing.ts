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

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'a320-basic',
    name: 'A320 Type Rating - Basic',
    description: 'Essential preparation materials for Airbus A320 type rating',
    price: 99.99,
    currency: 'USD',
    aircraftType: 'A320_FAMILY',
    features: [
      'Access to A320 theory lessons',
      'Practice exams (limited attempts)',
      'Basic progress tracking',
      'Email support'
    ],
    stripePriceId: 'price_a320_basic_test' // Replace with actual Stripe price ID
  },
  {
    id: 'a320-premium',
    name: 'A320 Type Rating - Premium',
    description: 'Complete preparation package for Airbus A320 type rating',
    price: 199.99,
    currency: 'USD',
    aircraftType: 'A320_FAMILY',
    features: [
      'All Basic features',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode'
    ],
    stripePriceId: 'price_a320_premium_test' // Replace with actual Stripe price ID
  },
  {
    id: 'b737-basic',
    name: 'B737 Type Rating - Basic',
    description: 'Essential preparation materials for Boeing 737 type rating',
    price: 99.99,
    currency: 'USD',
    aircraftType: 'BOEING_737',
    features: [
      'Access to B737 theory lessons',
      'Practice exams (limited attempts)',
      'Basic progress tracking',
      'Email support'
    ],
    stripePriceId: 'price_b737_basic_test' // Replace with actual Stripe price ID
  },
  {
    id: 'b737-premium',
    name: 'B737 Type Rating - Premium',
    description: 'Complete preparation package for Boeing 737 type rating',
    price: 199.99,
    currency: 'USD',
    aircraftType: 'BOEING_737',
    features: [
      'All Basic features',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode'
    ],
    stripePriceId: 'price_b737_premium_test' // Replace with actual Stripe price ID
  },
  {
    id: 'complete-package',
    name: 'Complete Package',
    description: 'Full access to all aircraft types and premium features',
    price: 299.99,
    currency: 'USD',
    aircraftType: 'ALL',
    features: [
      'Access to all aircraft type ratings',
      'All premium features for all aircraft',
      'Unlimited practice exams for all aircraft',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      '24/7 priority support',
      'Offline access to all materials',
      'Exam simulation mode for all aircraft',
      'Early access to new content'
    ],
    stripePriceId: 'price_complete_package_test' // Replace with actual Stripe price ID
  }
];

export const getPlanByAircraftType = (aircraftType: string) => {
  return PRICING_PLANS.filter(plan => 
    plan.aircraftType === aircraftType || plan.aircraftType === 'ALL'
  );
};

export const getPlanById = (id: string) => {
  return PRICING_PLANS.find(plan => plan.id === id);
};