import React from 'react';
import TestConvex from '@/components/TestConvex';
import TestStripeIntegration from '@/components/TestStripeIntegration';

const IntegrationTest = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Integration Tests</h1>
        <p className="text-muted-foreground">Testing Convex and Stripe integrations</p>
      </header>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Convex Integration</h2>
          <TestConvex />
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Stripe Integration</h2>
          <TestStripeIntegration />
        </section>
      </div>
    </div>
  );
};

export default IntegrationTest;