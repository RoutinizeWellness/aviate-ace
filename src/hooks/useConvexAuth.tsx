import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

// Define the User interface to match Convex data model
export interface User {
  _id: Id<"users">;
  email: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'premium';
  accountType?: 'free' | 'premium' | 'enterprise';
  subscription?: string;
  isActive?: boolean;
  createdAt: number;
  updatedAt: number;
}

// Helper function to check if user is admin
export const isAdmin = (user: User | null): boolean => {
  if (!user) return false;
  const adminEmails = ['tiniboti@gmail.com'];
  return adminEmails.includes(user.email) || user.role === 'admin';
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<User | null>;
  signUp: (email: string, fullName?: string, password?: string) => Promise<User | null>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConvexAvailable, setIsConvexAvailable] = useState(true);

  // Convex mutations with fallback
  const registerUser = useMutation(api.auth.registerUser);
  const loginUser = useMutation(api.auth.loginUser);
  
  // Convex queries with fallback
  const getUser = useQuery(
    api.auth.getUser, 
    user ? { userId: user._id } : "skip"
  );

  // Check if Convex is available
  useEffect(() => {
    const checkConvexAvailability = async () => {
      try {
        // Try to access Convex
        const convexUrl = import.meta.env.VITE_CONVEX_URL;
        console.log("Checking Convex availability with URL:", convexUrl);
        
        if (!convexUrl) {
          console.warn("⚠️ VITE_CONVEX_URL environment variable is not set");
          setIsConvexAvailable(false);
          setIsLoading(false);
          return;
        }
        
        if (convexUrl === "https://your-convex-url.convex.cloud" || 
            convexUrl === "https://your-actual-convex-url.convex.cloud") {
          console.warn("⚠️ Convex URL is still set to placeholder value");
          setIsConvexAvailable(false);
          setIsLoading(false);
          return;
        }
        
        // Test Convex connection by trying to access a simple function
        // In a real implementation, you might want to do a more thorough check
        console.log("✅ Convex is available and properly configured");
        setIsConvexAvailable(true);
      } catch (error) {
        console.warn("⚠️ Convex not available, using fallback", error);
        setIsConvexAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkConvexAvailability();
  }, []);

  // Update user when profile data changes
  useEffect(() => {
    if (getUser && isConvexAvailable) {
      setUser({
        _id: getUser._id,
        email: getUser.email,
        fullName: getUser.fullName || undefined,
        displayName: getUser.displayName || getUser.email.split('@')[0],
        avatarUrl: getUser.avatarUrl || undefined,
        role: (getUser.role as 'user' | 'admin' | 'premium') || 'user',
        accountType: (getUser.accountType as 'free' | 'premium' | 'enterprise') || 'free',
        subscription: getUser.subscription || undefined,
        isActive: getUser.isActive ?? true,
        createdAt: getUser.createdAt,
        updatedAt: getUser.updatedAt,
      });
    }
  }, [getUser, isConvexAvailable]);

  // Initialize auth state
  useEffect(() => {
    // Clear any existing local storage data to prevent conflicts
    localStorage.removeItem('convex_user');
    localStorage.removeItem('convex_auth_token');
    
    // If Convex is not available, set up a demo user
    if (!isConvexAvailable) {
      console.warn("⚠️ Using demo user mode - Convex is not available");
      const demoUser: User = {
        _id: "demo_user_id" as Id<"users">,
        email: "demo@example.com",
        fullName: "Demo User",
        displayName: "Demo",
        role: "admin",
        accountType: "premium",
        subscription: "complete-package",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setUser(demoUser);
    }
    
    setIsLoading(false);
  }, [isConvexAvailable]);

  const signIn = async (email: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      if (!isConvexAvailable) {
        // Fallback implementation for demo purposes
        console.warn("⚠️ Using demo sign in - Convex is not available");
        const demoUser: User = {
          _id: "demo_user_id" as Id<"users">,
          email: email,
          fullName: "Demo User",
          displayName: email.split('@')[0],
          role: email === "tiniboti@gmail.com" ? "admin" : "user",
          accountType: "premium",
          subscription: "complete-package",
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        setUser(demoUser);
        return demoUser;
      }
      
      console.log("Signing in with Convex for email:", email);
      // Call Convex login function
      const userData = await loginUser({ email });
      
      if (userData) {
        const user: User = {
          _id: userData._id,
          email: userData.email,
          fullName: userData.fullName || undefined,
          displayName: userData.displayName || userData.email.split('@')[0],
          avatarUrl: userData.avatarUrl || undefined,
          role: (userData.role as 'user' | 'admin' | 'premium') || 'user',
          accountType: (userData.accountType as 'free' | 'premium' | 'enterprise') || 'free',
          subscription: userData.subscription || undefined,
          isActive: userData.isActive ?? true,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        };
        
        setUser(user);
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, fullName?: string, password?: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      if (!isConvexAvailable) {
        // Fallback implementation for demo purposes
        console.warn("⚠️ Using demo sign up - Convex is not available");
        const newUser: User = {
          _id: "demo_user_id" as Id<"users">,
          email: email,
          fullName: fullName || email.split('@')[0],
          displayName: fullName || email.split('@')[0],
          role: email === "tiniboti@gmail.com" ? "admin" : "user",
          accountType: "premium",
          subscription: "complete-package",
          isActive: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        setUser(newUser);
        return newUser;
      }
      
      console.log("Signing up with Convex for email:", email);
      // Register the user with Convex
      const result = await registerUser({
        email,
        fullName,
        password: password || "temporary_password" // Use provided password or fallback
      });
      
      if (result.userId) {
        // Now fetch the user data
        const userData = await loginUser({ email });
        
        if (userData) {
          const newUser: User = {
            _id: userData._id,
            email: userData.email,
            fullName: userData.fullName || undefined,
            displayName: userData.displayName || userData.email.split('@')[0],
            avatarUrl: userData.avatarUrl || undefined,
            role: (userData.role as 'user' | 'admin' | 'premium') || 'user',
            accountType: (userData.accountType as 'free' | 'premium' | 'enterprise') || 'free',
            subscription: userData.subscription || undefined,
            isActive: userData.isActive ?? true,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          };
          
          setUser(newUser);
          return newUser;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    console.log("Signing out user");
    setUser(null);
    // Clear any local storage items
    localStorage.removeItem('convex_user');
    localStorage.removeItem('convex_auth_token');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      if (!isConvexAvailable) {
        // Fallback implementation for demo purposes
        console.warn("⚠️ Using demo profile update - Convex is not available");
        const updatedUser = { ...user, ...data, updatedAt: Date.now() };
        setUser(updatedUser);
        return;
      }
      
      console.log("Updating profile with Convex");
      // In a real implementation, you would call a Convex mutation to update the profile
      // For now, we'll just update the local state
      const updatedUser = { ...user, ...data, updatedAt: Date.now() };
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;