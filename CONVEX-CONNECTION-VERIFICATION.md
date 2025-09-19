# Convex Connection Verification

This document explains how to verify that the application is properly connected to the Convex backend deployment.

## Production Deployment

The application is configured to connect to the Convex backend at:
**https://accomplished-swordfish-668.convex.cloud**

You can access the Convex dashboard at:
[Convex Dashboard](https://dashboard.convex.dev/d/accomplished-swordfish-668)

## Verification Methods

### 1. Browser Console Logs

When the application loads, check the browser console for these messages:

```
✅ Convex client initialized successfully
```

If you see this message, Convex is properly connected.

### 2. Dashboard Status Indicator

The dashboard shows a Convex Status Indicator in the sidebar that displays:
- Connection status (Connected/Disconnected/Error)
- Backend URL
- Connection health

### 3. Environment Variables

Verify that the `VITE_CONVEX_URL` environment variable is set correctly:
```
VITE_CONVEX_URL=https://accomplished-swordfish-668.convex.cloud
```

### 4. Verification Scripts

Several scripts are available to verify the connection:

1. **Build-time verification**: Runs automatically during `npm run build`
2. **Manual verification**: Run `npm run verify:config` to check configuration
3. **Post-deployment check**: Run `node scripts/post-deploy-check.js`

## Fallback Mode

If Convex is temporarily unavailable, the application gracefully degrades to demo mode:
- User authentication uses mock data
- Exam questions are served from local data
- Progress tracking is simulated
- All features remain functional

You will see this warning in the console:
```
⚠️ Using demo user mode - Convex is not available
```

## Troubleshooting

### Common Issues

1. **Placeholder URLs**: If you see "VITE_CONVEX_URL is still set to placeholder value", update the environment variable.

2. **Network Errors**: If Convex is unreachable, check:
   - Internet connectivity
   - Firewall settings
   - Browser extensions blocking requests

3. **CORS Issues**: Ensure the Convex deployment is properly configured to accept requests from your domain.

### Verification Steps

1. Open the deployed application
2. Open browser developer tools (F12)
3. Check the Console tab for Convex initialization messages
4. Look for the Convex Status Indicator in the dashboard
5. Test features that require backend connectivity

## Netlify Deployment

For Netlify deployments, the environment variable is set in `netlify.toml`:
```toml
[context.production.environment]
  VITE_CONVEX_URL = "https://accomplished-swordfish-668.convex.cloud"
```

## Manual Testing

You can manually test the Convex connection by visiting:
`/convex-status.html` on your deployed site

This page shows:
- Deployment information
- Configuration status
- Verification steps
- Troubleshooting guidance

## Contact

If you continue to experience issues with Convex connectivity:
1. Check the Convex dashboard for deployment status
2. Verify environment variables are set correctly
3. Contact the development team for assistance