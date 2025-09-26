// Backend service for Autumn Payments integration
import { Autumn as autumn } from "autumn-js";

// Initialize Autumn with the secret key
// In a real implementation, you would use environment variables
const AUTUMN_SECRET_KEY = import.meta.env.VITE_AUTUMN_SECRET_KEY || 'am_sk_live_VSzgGP0BzjnvdMyuzvfO2irSoYx3teJHMw8X6FUghi';

console.log('Initializing Autumn with secret key:', AUTUMN_SECRET_KEY ? 'Key present' : 'No key');

// Create an instance of Autumn
const autumnInstance = new autumn({
  secretKey: AUTUMN_SECRET_KEY,
});

// Create a checkout session
export const createCheckoutSession = async (params: {
  productId: string;
  userId: string;
  email: string;
  ipAddress?: string;
}) => {
  try {
    console.log('Creating checkout session with params:', params);
    
    // Validate required parameters
    if (!params.productId) {
      throw new Error("Product ID is required");
    }
    
    if (!params.userId) {
      throw new Error("User ID is required");
    }
    
    if (!params.email) {
      throw new Error("Email is required");
    }
    
    // First, try to get the customer
    console.log('Looking up customer:', params.userId);
    let customerResult = await autumnInstance.customers.get(params.userId);
    console.log('Customer lookup result:', customerResult);
    
    // If customer doesn't exist, create a new one
    if (customerResult.error || !customerResult.data) {
      console.log('Customer does not exist, creating new customer');
      customerResult = await autumnInstance.customers.create({
        id: params.userId,
        email: params.email,
        name: params.email.split('@')[0],
      });
      
      console.log('Customer creation result:', customerResult);
      
      if (customerResult.error) {
        throw new Error(`Failed to create customer: ${customerResult.error.message}`);
      }
    }
    
    // Create a checkout session
    console.log('Creating checkout session with product:', params.productId);

    // Optional: verify product exists to produce clearer error messages
    try {
      const product = await (autumnInstance as any).products?.get?.(params.productId);
      console.log('Product lookup:', product);
    } catch (e) {
      console.warn('Product lookup failed (continuing to checkout):', e);
    }

    const checkoutSession = await autumnInstance.checkout({
      customer_id: params.userId,
      product_id: params.productId,
    });

    console.log('Checkout session result:', checkoutSession);

    if (checkoutSession.error) {
      throw new Error(`Checkout failed: ${checkoutSession.error.message}`);
    }

    // Check if we have a checkout URL
    if (!checkoutSession.data?.url) {
      throw new Error("No checkout URL returned from Autumn");
    }

    return {
      checkoutUrl: checkoutSession.data.url,
      sessionId: 'session_' + params.userId + '_' + params.productId
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    const message = (error?.response?.data?.error?.message) || error?.message || 'Unknown error';
    throw new Error('Failed to create checkout session: ' + message);
  }
};

// Handle webhook events
export const handleWebhook = async (payload: any, signature: string, secret: string) => {
  try {
    // Verify the webhook signature
    // In a real implementation, you would verify the webhook signature
    console.log('Webhook received:', payload);
    
    // Handle different event types
    switch (payload.type) {
      case 'checkout.session.completed':
        const session = payload.data.object;
        console.log('Checkout session completed:', session);
        
        // Update user subscription in database
        await updateUserSubscription(
          session.customer_id,
          session.product_id
        );
        break;
        
      case 'customer.subscription.deleted':
        const subscription = payload.data.object;
        console.log('Subscription cancelled:', subscription);
        // Handle subscription cancellation
        await cancelUserSubscription(subscription.customer_id);
        break;
        
      default:
        console.log(`Unhandled event type ${payload.type}`);
    }
    
    return { received: true };
  } catch (error) {
    console.error('Webhook error:', error);
    throw new Error('Webhook handler failed');
  }
};

// Update user subscription in database
const updateUserSubscription = async (userId: string, productId: string) => {
  try {
    // In a real implementation, you would update the user's subscription in your database
    console.log(`Updating subscription for user ${userId} to product ${productId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user subscription:', error);
    throw new Error('Failed to update user subscription');
  }
};

// Cancel user subscription
const cancelUserSubscription = async (userId: string) => {
  try {
    // In a real implementation, you would cancel the user's subscription in your database
    console.log(`Cancelling subscription for user ${userId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  } catch (error) {
    console.error('Error cancelling user subscription:', error);
    throw new Error('Failed to cancel user subscription');
  }
};

// Get subscription details
export const getSubscriptionDetails = async (userId: string) => {
  try {
    console.log(`Fetching subscription details for user ${userId}`);

    const customer = await autumnInstance.customers.get(userId);
    if (customer.error || !customer.data) {
      return null;
    }

    // Autumn demo: assume a single active subscription per customer in metadata
    // If your Autumn API provides subscriptions, fetch them here.
    return {
      id: `sub_${userId}`,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      productId: customer.data?.default_product_id || 'unknown',
      cancelAtPeriodEnd: false
    };
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return null;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    // In a real implementation, you would cancel a subscription using Autumn
    console.log(`Cancelling subscription ${subscriptionId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

// Update subscription plan
export const updateSubscriptionPlan = async (params: {
  subscriptionId: string;
  newProductId: string;
}) => {
  try {
    // In a real implementation, you would update a subscription plan using Autumn
    console.log(`Updating subscription ${params.subscriptionId} to product ${params.newProductId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true };
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    throw new Error('Failed to update subscription plan');
  }
};