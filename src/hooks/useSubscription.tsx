import { useAuth } from '@/hooks/useConvexAuth';

export type SubscriptionType = 'A320' | 'BOEING_737' | 'ALL';

export const useSubscription = () => {
  const { user } = useAuth();

  // Check if user has access to specific aircraft type
  const hasAccessTo = (aircraftType: string): boolean => {
    if (!user) return false;
    
    // Admin emails have access to everything
    const adminEmails = ['tiniboti@gmail.com'];
    if (adminEmails.includes(user.email?.toLowerCase() || '')) {
      return true;
    }
    
    // Check user's subscription
    const userSubscription = user.subscription || 'A320'; // Default to A320
    
    if (userSubscription === 'ALL') return true;
    
    // Map aircraft types to subscriptions
    switch (aircraftType.toUpperCase()) {
      case 'A320_FAMILY':
      case 'A320':
      case 'AIRBUS_A320':
        return userSubscription === 'A320';
      case 'BOEING_737':
      case 'B737':
      case 'BOEING737':
        return userSubscription === 'BOEING_737';
      case 'COMMERCIAL_AIRCRAFT':
      case 'GENERAL_AVIATION':
      case 'REGULATORY':
        return true; // General content available to all
      default:
        return true; // Default allow access for unspecified types
    }
  };

  // Get user's current subscription
  const getCurrentSubscription = (): SubscriptionType => {
    if (!user) return 'A320';
    
    // Admin emails have access to everything
    const adminEmails = ['tiniboti@gmail.com'];
    if (adminEmails.includes(user.email?.toLowerCase() || '')) {
      return 'ALL';
    }
    
    return (user.subscription as SubscriptionType) || 'A320';
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    if (!user) return false;
    const adminEmails = ['tiniboti@gmail.com'];
    return adminEmails.includes(user.email?.toLowerCase() || '');
  };

  // Filter content based on subscription
  const filterBySubscription = <T extends { aircraftType?: string }>(items: T[]): T[] => {
    return items.filter(item => 
      item.aircraftType ? hasAccessTo(item.aircraftType) : true
    );
  };

  // Get subscription display name
  const getSubscriptionDisplayName = (): string => {
    const subscription = getCurrentSubscription();
    switch (subscription) {
      case 'A320':
        return 'Airbus A320 Family';
      case 'BOEING_737':
        return 'Boeing 737';
      case 'ALL':
        return 'All Aircraft Types';
      default:
        return 'Unknown Subscription';
    }
  };

  return {
    hasAccessTo,
    getCurrentSubscription,
    isAdmin,
    filterBySubscription,
    getSubscriptionDisplayName,
    userSubscription: getCurrentSubscription()
  };
};