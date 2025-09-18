import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  email: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (email: string, password: string, fullName?: string) => Promise<User | null>;
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

// Helper function to generate proper Convex IDs
const generateConvexId = (table: string): string => {
  // Generate a proper Convex-like ID with base32-like encoding
  // Convex IDs are in the format: table_ followed by 16 base32 characters
  const base32Chars = 'abcdefghijklmnopqrstuvwxyz234567';
  let result = '';
  
  // Generate 16 random characters from the base32 charset
  for (let i = 0; i < 16; i++) {
    const randomIndex = Math.floor(Math.random() * base32Chars.length);
    result += base32Chars[randomIndex];
  }
  
  const generatedId = `${table}_${result}`;
  console.log(`Generated Convex ID for ${table}:`, generatedId);
  return generatedId;
};

// Helper function to check if an ID looks like a Convex ID
const isValidConvexId = (id: string): boolean => {
  // Convex IDs have format: table_name_ followed by 16 base32 characters
  const isValid = /^[a-z]+_[a-z2-7]{16}$/.test(id);
  console.log(`ID ${id} validation result:`, isValid);
  return isValid;
};

// Helper function to convert old IDs to Convex-like IDs
const convertToConvexId = (oldId: string, table: string): string => {
  if (isValidConvexId(oldId)) {
    return oldId; // Already a valid Convex-like ID
  }
  // Convert to Convex-like format
  const newId = generateConvexId(table);
  console.log(`Converting invalid ID ${oldId} to valid Convex ID:`, newId);
  return newId;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('convex_user');
    console.log('Checking stored user:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('Loaded user from localStorage:', parsedUser);
        
        // Ensure the user ID is in the correct Convex format
        if (parsedUser._id) {
          console.log('Checking ID format for:', parsedUser._id);
          console.log('ID is valid:', isValidConvexId(parsedUser._id));
          
          if (!isValidConvexId(parsedUser._id)) {
            const convertedUser = {
              ...parsedUser,
              _id: convertToConvexId(parsedUser._id, 'users'),
              updatedAt: Date.now(),
            };
            console.log('Converting invalid ID to:', convertedUser._id);
            setUser(convertedUser);
            localStorage.setItem('convex_user', JSON.stringify(convertedUser));
          } else {
            setUser(parsedUser);
          }
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('convex_user');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      // Generate a proper Convex ID for the user
      const userId = generateConvexId('users');
      console.log('Generated new user ID:', userId);
      
      const user: User = {
        _id: userId,
        email,
        displayName: email.split('@')[0],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      setUser(user);
      localStorage.setItem('convex_user', JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<User | null> => {
    try {
      setIsLoading(true);
      
      // Generate a proper Convex ID for the new user
      const userId = generateConvexId('users');
      console.log('Generated new user ID:', userId);
      
      const newUser: User = {
        _id: userId,
        email,
        fullName,
        displayName: fullName || email.split('@')[0],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      
      setUser(newUser);
      localStorage.setItem('convex_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setUser(null);
    localStorage.removeItem('convex_user');
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = { ...user, ...data, updatedAt: Date.now() };
      setUser(updatedUser);
      localStorage.setItem('convex_user', JSON.stringify(updatedUser));
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