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
  bestValue?: boolean;
  nameKey: string;
  descriptionKey: string;
  featureKeys: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  // Free Plan
  {
    id: 'pilotprepflightx_gratuito',
    name: 'PilotPrepFlightX - Gratuito',
    description: 'Acceso limitado a cursos y preguntas',
    nameKey: 'plans.free.name',
    descriptionKey: 'plans.free.description',
    price: 0,
    currency: 'EUR',
    duration: 'Unlimited',
    durationMonths: 0,
    aircraftType: 'LIMITED',
    features: [
      'Acceso limitado a contenido teórico',
      'Máximo 5 preguntas de práctica por día',
      'Progreso básico de seguimiento',
      'Acceso a contenido introductorio'
    ],
    featureKeys: [
      'features.free.1',
      'features.free.2',
      'features.free.3',
      'features.free.4'
    ],
    productId: 'pilotprepflightx_gratuito'
  },
  // 1 Month Plan
  {
    id: 'pilotprepflightx_-_1_mes',
    name: 'PilotPrepFlightX - 1 mes',
    description: 'Acceso completo por 1 mes',
    nameKey: 'plans.1month.name',
    descriptionKey: 'plans.1month.description',
    price: 29,
    currency: 'EUR',
    duration: '1 Month',
    durationMonths: 1,
    aircraftType: 'ALL',
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas',
      'Soporte prioritario'
    ],
    featureKeys: [
      'features.premium.1',
      'features.premium.2',
      'features.premium.3',
      'features.premium.4',
      'features.premium.5'
    ],
    productId: 'pilotprepflightx_-_1_mes'
  },
  // 3 Months Plan
  {
    id: 'pilotprepflightx_-_3_meses',
    name: 'PilotPrepFlightX - 3 meses',
    description: 'Acceso completo por 3 meses con descuento',
    nameKey: 'plans.3months.name',
    descriptionKey: 'plans.3months.description',
    price: 79,
    currency: 'EUR',
    duration: '3 Months',
    durationMonths: 3,
    aircraftType: 'ALL',
    popular: true,
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas',
      'Soporte prioritario',
      'Ahorro del 10% comparado con plan mensual'
    ],
    featureKeys: [
      'features.premium.1',
      'features.premium.2',
      'features.premium.3',
      'features.premium.4',
      'features.premium.5',
      'features.premium.6'
    ],
    productId: 'pilotprepflightx_-_3_meses'
  },
  // 6 Months Plan
  {
    id: 'pilotprepflightx_-_6_meses',
    name: 'PilotPrepFlightX - 6 meses',
    description: 'Acceso completo por 6 meses con mayor descuento',
    nameKey: 'plans.6months.name',
    descriptionKey: 'plans.6months.description',
    price: 140,
    currency: 'EUR',
    duration: '6 Months',
    durationMonths: 6,
    aircraftType: 'ALL',
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas',
      'Soporte prioritario 24/7',
      'Acceso offline a materiales',
      'Ahorro del 20% comparado con plan mensual'
    ],
    featureKeys: [
      'features.premium.1',
      'features.premium.2',
      'features.premium.3',
      'features.premium.4',
      'features.premium.7',
      'features.premium.8',
      'features.premium.9'
    ],
    productId: 'pilotprepflightx_-_6_meses'
  },
  // 1 Year Plan
  {
    id: 'pilotprepflightx_-_1_ano',
    name: 'PilotPrepFlightX - 1 año',
    description: 'Acceso completo por 1 año con máximo descuento',
    nameKey: 'plans.1year.name',
    descriptionKey: 'plans.1year.description',
    price: 250,
    currency: 'EUR',
    duration: '1 Year',
    durationMonths: 12,
    aircraftType: 'ALL',
    bestValue: true,
    features: [
      'Acceso completo a A320 y B737',
      'Simulacros ilimitados',
      'Analíticas avanzadas',
      'Recomendaciones de estudio personalizadas',
      'Soporte prioritario 24/7',
      'Acceso offline a materiales',
      'Actualizaciones de contenido regulares',
      'Acceso anticipado a nuevo contenido',
      'Ahorro del 30% comparado con plan mensual'
    ],
    featureKeys: [
      'features.premium.1',
      'features.premium.2',
      'features.premium.3',
      'features.premium.4',
      'features.premium.7',
      'features.premium.8',
      'features.premium.10',
      'features.premium.11',
      'features.premium.12'
    ],
    productId: 'pilotprepflightx_-_1_ano'
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

export const getBestValuePlans = () => {
  return PRICING_PLANS.filter(plan => plan.bestValue);
};

export const getPlansByAircraftAndDuration = (aircraftType: string, durationMonths: number) => {
  return PRICING_PLANS.filter(plan =>
    (plan.aircraftType === aircraftType || plan.aircraftType === 'ALL') &&
    plan.durationMonths === durationMonths
  );
};

// Helper function to get translated plan data
export const getTranslatedPlan = (plan: PricingPlan, t: (key: string) => string) => {
  return {
    ...plan,
    name: t(plan.nameKey),
    description: t(plan.descriptionKey),
    features: plan.featureKeys.map(key => t(key))
  };
};

export const getTranslatedPlans = (plans: PricingPlan[], t: (key: string) => string) => {
  return plans.map(plan => getTranslatedPlan(plan, t));
};