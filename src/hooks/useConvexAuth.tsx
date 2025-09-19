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
  signUp: (email: string, fullName?: string) => Promise<User | null>;
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

  // Convex mutations
  const registerUser = useMutation(api.auth.registerUser);
  const loginUser = useMutation(api.auth.loginUser);
  
  // Convex queries
  const getUser = useQuery(
    api.auth.getUser, 
    user ? { userId: user._id } : "skip"
  );

  // Update user when profile data changes
  useEffect(() => {
    if (getUser) {
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
  }, [getUser]);

  // Initialize auth state
  useEffect(() => {
    // Clear any existing local storage data to prevent conflicts
    localStorage.removeItem('convex_user');
    localStorage.removeItem('convex_auth_token');
    
    setIsLoading(false);
  }, []);

  const signIn = async (email: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
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

  const signUp = async (email: string, fullName?: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      // Register the user with Convex
      const result = await registerUser({ 
        email, 
        fullName,
        password: "temporary_password" // In a real app, this would be a real password
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
    setUser(null);
    // Clear any local storage items
    localStorage.removeItem('convex_user');
    localStorage.removeItem('convex_auth_token');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
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