import { TestConvexConnection } from '../components/TestConvexConnection';

export const ConvexTestPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Convex Test Page</h1>
      <TestConvexConnection />
    </div>
  );
};