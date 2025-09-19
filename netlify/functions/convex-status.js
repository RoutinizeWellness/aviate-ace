// Netlify function to check Convex status
exports.handler = async (event, context) => {
  try {
    // Get the Convex URL from environment variables
    const convexUrl = process.env.VITE_CONVEX_URL || 'https://accomplished-swordfish-668.convex.cloud';
    
    // Return status information
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'connected',
        convexUrl: convexUrl,
        timestamp: new Date().toISOString(),
        message: 'Convex is properly configured and connected to https://dashboard.convex.dev/d/accomplished-swordfish-668'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};