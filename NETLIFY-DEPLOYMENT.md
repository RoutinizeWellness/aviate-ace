# Netlify Deployment Guide

This guide explains how to deploy the application to Netlify with proper Convex integration.

## Prerequisites

1. Make sure you have a Netlify account
2. Ensure Convex is properly set up and deployed
3. Have your Stripe publishable key ready

## Automated Deployment

### Using the Deployment Script

Run the deployment preparation script:

```bash
node deploy-to-netlify.js
```

This script will:
1. Deploy Convex functions
2. Update environment variables
3. Build the application

## Manual Deployment

### 1. Deploy Convex Functions

First, deploy your Convex functions:

```bash
npx convex deploy
```

### 2. Update Environment Variables

After deploying Convex, update your environment variables in Netlify:

1. Get your Convex URL from `.env.local`:
   ```
   VITE_CONVEX_URL=https://your-deployment.convex.cloud
   ```

2. In Netlify dashboard:
   - Go to Site settings → Build & deploy → Environment
   - Add the following environment variables:
     - `VITE_CONVEX_URL` - Your Convex deployment URL
     - `VITE_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

### 3. Configure Build Settings

In Netlify dashboard:
- Build command: `npm run build`
- Publish directory: `dist`

### 4. Deploy

Push your changes to GitHub, or drag and drop your `dist` folder to Netlify.

## Environment Variables

The following environment variables are required for proper operation:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
```

## Troubleshooting

### Convex Connection Issues

If Convex is not connecting on Netlify:

1. Verify `VITE_CONVEX_URL` is set correctly in Netlify environment variables
2. Check that Convex functions are deployed:
   ```bash
   npx convex status
   ```
3. Ensure the URL doesn't have trailing slashes

### Stripe Issues

If Stripe is not working:

1. Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set correctly
2. Check that price IDs in `src/config/pricing.ts` match your Stripe dashboard
3. Ensure you're using live keys for production (test keys for development)

### Build Issues

If the build fails:

1. Check that all dependencies are installed:
   ```bash
   npm install
   ```
2. Verify Node.js version (should be 18.x)
3. Check for TypeScript errors:
   ```bash
   npm run build
   ```

## Continuous Deployment

To set up continuous deployment:

1. Connect your GitHub repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`
4. Add environment variables in Netlify dashboard
5. Enable automatic deploys from your preferred branch

## Custom Domain

To use a custom domain:

1. In Netlify dashboard, go to Domain management
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatically provided by Netlify)

## Monitoring

Monitor your deployment:

1. Check Netlify deploy logs
2. Monitor Convex function calls in the Convex dashboard
3. Check Stripe dashboard for payment processing