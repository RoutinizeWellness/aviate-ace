// Webhook handler for Stripe events
// This would typically be implemented as a serverless function

import { handleWebhook } from './backend';
import { NextFunction, Request, Response } from 'express';

// In a real implementation, you would get this from environment variables
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock1234567890';

// Mock Express request handler
export const stripeWebhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // In a real implementation, you would get the raw body and signature
    const sig = req.headers['stripe-signature'] as string;
    const rawBody = JSON.stringify(req.body);
    
    // Handle the webhook event
    const result = await handleWebhook(rawBody, sig, WEBHOOK_SECRET);
    
    // Send success response
    res.status(200).json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Mock serverless function handler (for Vercel, Netlify, etc.)
export const stripeWebhookServerless = async (req: any, res: any) => {
  try {
    // In a real implementation, you would get the raw body and signature
    const sig = req.headers['stripe-signature'];
    const rawBody = req.body;
    
    // Handle the webhook event
    const result = await handleWebhook(rawBody, sig, WEBHOOK_SECRET);
    
    // Send success response
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, {
      status: 400,
    });
  }
};

// For development/testing purposes
export const testWebhook = async () => {
  try {
    // Create a mock payload
    const mockPayload = {
      id: 'evt_mock1234567890',
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_mock1234567890',
          amount: 9999,
          currency: 'usd',
          customer: 'cus_mock123',
          metadata: {
            userId: 'user_mock123',
            planId: 'a320-basic'
          }
        }
      }
    };
    
    // Handle the mock event
    const result = await handleWebhook(
      JSON.stringify(mockPayload),
      'mock_signature',
      WEBHOOK_SECRET
    );
    
    console.log('Test webhook result:', result);
    return result;
  } catch (error) {
    console.error('Test webhook error:', error);
    throw error;
  }
};