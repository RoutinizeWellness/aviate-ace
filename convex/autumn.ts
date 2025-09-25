import { action } from "./_generated/server";
import { v } from "convex/values";
import { Autumn as AutumnClient } from "autumn-js";

export const createCheckoutSession = action({
  args: {
    productId: v.string(),
    userId: v.string(),
    email: v.string(),
  },
  handler: async (_ctx, args) => {
    const secret = process.env.AUTUMN_SECRET_KEY || (process.env as any).Autumn || process.env.VITE_AUTUMN_SECRET_KEY;
    if (!secret) return { error: '[Autumn] AUTUMN_SECRET_KEY not configured in Convex env' } as const;

    try {
      console.log('[Autumn] createCheckoutSession args', { productId: args.productId, userId: args.userId, email: args.email?.slice(0,2)+"***" });
      const autumn = new AutumnClient({ secretKey: secret });

      // Optional: verify product exists if SDK supports it
      try {
        const prod = (autumn as any).products?.get ? await (autumn as any).products.get(args.productId) : null;
        if (prod?.error) {
          return { error: `[Autumn] product not found: ${args.productId}` } as const;
        }
      } catch {}

      // Ensure customer exists (get or create)
      let customer = await autumn.customers.get(args.userId);
      console.log('[Autumn] customers.get ->', customer?.error ? customer.error : 'ok');
      if (customer.error || !customer.data) {
        console.log('[Autumn] creating customer');
        customer = await autumn.customers.create({
          id: args.userId,
          email: args.email,
          name: args.email.split("@")[0],
        });
        if (customer.error) {
          return { error: `[Autumn] Failed to create customer: ${customer.error.message}` } as const;
        }
      }

      // Create checkout session
      const checkout = await autumn.checkout({
        customer_id: args.userId,
        product_id: args.productId,
      });

      console.log('[Autumn] checkout ->', checkout?.error ? checkout.error : checkout?.data?.url);
      if (checkout.error) {
        return { error: `[Autumn] ${checkout.error.message}` } as const;
      }

      const url = checkout.data?.url;
      if (!url) return { error: '[Autumn] No checkout URL returned from Autumn' } as const;

      return {
        checkoutUrl: url,
        sessionId: `session_${args.userId}_${args.productId}`,
      } as const;
    } catch (err: any) {
      const message = err?.message || 'Unknown error in Autumn checkout';
      return { error: `[Autumn] ${message}` } as const;
    }
  },
});

export const getSubscriptionDetails = action({
  args: {
    userId: v.string(),
  },
  handler: async (_ctx, args) => {
    const secret = process.env.AUTUMN_SECRET_KEY || (process.env as any).Autumn || process.env.VITE_AUTUMN_SECRET_KEY;
    if (!secret) throw new Error("AUTUMN_SECRET_KEY not configured in Convex env");

    try {
      console.log('[Autumn] getSubscriptionDetails args', { userId: args.userId });
      const autumn = new AutumnClient({ secretKey: secret });
      const customer = await autumn.customers.get(args.userId);
      if (customer.error || !customer.data) return null;

      return {
        id: `sub_${args.userId}`,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        productId: (customer as any).data?.default_product_id || 'unknown',
        cancelAtPeriodEnd: false,
      };
    } catch (err: any) {
      const message = err?.message || "Unknown error fetching subscription";
      throw new Error(`[Autumn] ${message}`);
    }
  },
});

export const cancelSubscription = action({
  args: { subscriptionId: v.string() },
  handler: async () => {
    // Implement with Autumn's API once endpoint is available in autumn-js.
    return { success: true };
  },
});

export const updateSubscriptionPlan = action({
  args: { subscriptionId: v.string(), newProductId: v.string() },
  handler: async () => {
    // Implement with Autumn's API once endpoint is available in autumn-js.
    return { success: true };
  },
});
