export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  durationMonths: number;
  features: string[];
  aircraftType: string;
  productId?: string;
  popular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  // Launch offer plans (global access)
  {
    id: 'pilotprep-1m',
    name: '1 mes',
    description: 'Oferta de lanzamiento: acceso completo por 1 mes',
    price: 19.99,
    currency: 'EUR',
    duration: '1 Month',
    durationMonths: 1,
    aircraftType: 'ALL',
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas'
    ],
    productId: 'pilotprepflightx_-_1_mes'
  },
  {
    id: 'pilotprep-3m',
    name: '3 meses',
    description: 'Oferta de lanzamiento: 10% de descuento por 3 meses',
    price: 19.99 * 3 * 0.9,
    currency: 'EUR',
    duration: '3 Months',
    durationMonths: 3,
    aircraftType: 'ALL',
    popular: true,
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas'
    ],
    productId: 'pilotprepflightx_-_3_meses'
  },
    name: 'A320 Type Rating - 3 Months',
    description: 'Extended preparation package for Airbus A320 type rating',
    price: 39.99,
    currency: 'EUR',
    duration: '3 Months',
    durationMonths: 3,
    aircraftType: 'A320_FAMILY',
    popular: true,
    features: [
      'Access to A320 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode',
      'Extended study time'
    ],
    productId: 'a320-3months'
  },
  {
    id: 'pilotprep-6m',
    name: '6 meses',
    description: 'Oferta de lanzamiento: 20% de descuento por 6 meses',
    price: 19.99 * 6 * 0.8,
    currency: 'EUR',
    duration: '6 Months',
    durationMonths: 6,
    aircraftType: 'ALL',
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas'
    ],
    productId: 'pilotprepflightx_-_6_meses'
  },
    name: 'A320 Type Rating - 6 Months',
    description: 'Comprehensive preparation package for Airbus A320 type rating',
    price: 59.99,
    currency: 'EUR',
    duration: '6 Months',
    durationMonths: 6,
    aircraftType: 'A320_FAMILY',
    features: [
      'Access to A320 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode',
      'Extended study time',
      'Progress tracking over time'
    ],
    productId: 'a320-6months'
  },
  {
    id: 'pilotprep-12m',
    name: '1 año',
    description: 'Oferta de lanzamiento: 30% de descuento por 12 meses',
    price: 19.99 * 12 * 0.7,
    currency: 'EUR',
    duration: '1 Year',
    durationMonths: 12,
    aircraftType: 'ALL',
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas'
    ],
    productId: 'pilotprepflightx_-_1_ao'
  },
    name: 'A320 Type Rating - 1 Year',
    description: 'Complete annual access to Airbus A320 type rating preparation',
    price: 89.99,
    currency: 'EUR',
    duration: '1 Year',
    durationMonths: 12,
    aircraftType: 'A320_FAMILY',
    features: [
      'Access to A320 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode',
      'Full year access',
      'Progress tracking over time',
      'Regular content updates'
    ],
    productId: 'a320-1year'
}
];
  // End plans
    id: 'b737-1month',
    name: 'B737 Type Rating - 1 Month',
    description: 'Complete preparation package for Boeing 737 type rating',
    price: 19.99,
    currency: 'EUR',
    duration: '1 Month',
    durationMonths: 1,
    aircraftType: 'B737_FAMILY',
    features: [
      'Access to B737 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode'
    ],
    productId: 'b737-1month'
  },
  {
    id: 'b737-3months',
    name: 'B737 Type Rating - 3 Months',
    description: 'Extended preparation package for Boeing 737 type rating',
    price: 39.99,
    currency: 'EUR',
    duration: '3 Months',
    durationMonths: 3,
    aircraftType: 'B737_FAMILY',
    popular: true,
    features: [
      'Access to B737 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode',
      'Extended study time'
    ],
    productId: 'b737-3months'
  },
  {
    id: 'b737-6months',
    name: 'B737 Type Rating - 6 Months',
    description: 'Comprehensive preparation package for Boeing 737 type rating',
    price: 59.99,
    currency: 'EUR',
    duration: '6 Months',
    durationMonths: 6,
    aircraftType: 'B737_FAMILY',
    features: [
      'Access to B737 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode',
      'Extended study time',
      'Progress tracking over time'
    ],
    productId: 'b737-6months'
  },
  {
    id: 'b737-1year',
    name: 'B737 Type Rating - 1 Year',
    description: 'Complete annual access to Boeing 737 type rating preparation',
    price: 89.99,
    currency: 'EUR',
    duration: '1 Year',
    durationMonths: 12,
    aircraftType: 'B737_FAMILY',
    features: [
      'Access to B737 theory lessons',
      'Unlimited practice exams',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      'Priority email support',
      'Offline access to materials',
      'Exam simulation mode',
      'Full year access',
      'Progress tracking over time',
      'Regular content updates'
    ],
    productId: 'b737-1year'
  },
  // Complete Package Plans
  {
    id: 'complete-1month',
    name: 'Complete Package - 1 Month',
    description: 'Full access to all aircraft types and premium features',
    price: 29.99,
    currency: 'EUR',
    duration: '1 Month',
    durationMonths: 1,
    aircraftType: 'ALL',
    features: [
      'Access to all aircraft type ratings',
      'All premium features for all aircraft',
      'Unlimited practice exams for all aircraft',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      '24/7 priority support',
      'Offline access to all materials',
      'Exam simulation mode for all aircraft'
    ],
    productId: 'complete-1month'
  },
  {
    id: 'complete-3months',
    name: 'Complete Package - 3 Months',
    description: 'Extended access to all aircraft types and premium features',
    price: 59.99,
    currency: 'EUR',
    duration: '3 Months',
    durationMonths: 3,
    aircraftType: 'ALL',
    popular: true,
    features: [
      'Access to all aircraft type ratings',
      'All premium features for all aircraft',
      'Unlimited practice exams for all aircraft',
      'Advanced analytics and progress tracking',
      'Personalized study recommendations',
      '24/7 priority support',
      'Offline access to all materials',
      'Exam simulation mode for all aircraft',
      'Extended study time'
    ],
    productId: 'complete-3months'
  },
  {
    id: 'complete-6months',
    name: 'Complete Package - 6 Months',
    description: 'Comprehensive access to all aircraft types and premium features',
    price: 99.99,
    currency: 'EUR',
    duration: '6 Months',
    durationMonths: 6,
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
      'Extended study time',
      'Progress tracking over time'
    ],
    productId: 'complete-6months'
  },
  {
    id: 'complete-1year',
    name: 'Complete Package - 1 Year',
    description: 'Full annual access to all aircraft types and premium features',
    price: 149.99,
    currency: 'EUR',
    duration: '1 Year',
    durationMonths: 12,
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
      'Full year access',
      'Progress tracking over time',
      'Regular content updates',
      'Early access to new content'
    ],
    productId: 'complete-1year'
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

export const getPlansByDuration = (durationMonths: number) => {
  return PRICING_PLANS.filter(plan => plan.durationMonths === durationMonths);
};

export const getPopularPlans = () => {
  return PRICING_PLANS.filter(plan => plan.popular);
};

export const getPlansByAircraftAndDuration = (aircraftType: string, durationMonths: number) => {
  return PRICING_PLANS.filter(plan =>
    (plan.aircraftType === aircraftType || plan.aircraftType === 'ALL') &&
    plan.durationMonths === durationMonths
  );
};