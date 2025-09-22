import {
  feature,
  product,
  featureItem,
  pricedFeatureItem,
  priceItem,
} from "autumn-js";

// Features
export const access = feature({
  id: "access",
  name: "Course Access",
  type: "boolean",
});

export const questions = feature({
  id: "questions",
  name: "Practice Questions",
  type: "single_use",
});

// Products
export const free = product({
  id: "free",
  name: "Free",
  items: [
    // Limited access to courses
    featureItem({
      feature_id: access.id,
      included_usage: 1,
    }),
    // Limited practice questions
    featureItem({
      feature_id: questions.id,
      included_usage: 10,
      interval: "month",
    }),
  ],
});

export const a320Premium = product({
  id: "a320-premium",
  name: "A320 Type Rating - Premium",
  items: [
    // Full access to A320 course
    featureItem({
      feature_id: access.id,
      included_usage: 1,
    }),
    // Unlimited practice questions
    featureItem({
      feature_id: questions.id,
      included_usage: 999999,
      interval: "month",
    }),
    // $29.99 per month
    priceItem({
      price: 29.99,
      interval: "month",
    }),
  ],
});

export const b737Premium = product({
  id: "b737-premium",
  name: "B737 Type Rating - Premium",
  items: [
    // Full access to B737 course
    featureItem({
      feature_id: access.id,
      included_usage: 1,
    }),
    // Unlimited practice questions
    featureItem({
      feature_id: questions.id,
      included_usage: 999999,
      interval: "month",
    }),
    // $29.99 per month
    priceItem({
      price: 29.99,
      interval: "month",
    }),
  ],
});

export const completePackage = product({
  id: "complete-package",
  name: "Complete Package - Annual",
  items: [
    // Full access to all courses
    featureItem({
      feature_id: access.id,
      included_usage: 999999,
    }),
    // Unlimited practice questions
    featureItem({
      feature_id: questions.id,
      included_usage: 999999,
      interval: "month",
    }),
    // $299.99 per year
    priceItem({
      price: 299.99,
      interval: "year",
    }),
  ],
});