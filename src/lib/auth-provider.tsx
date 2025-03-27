import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Get environment variables or use fallbacks
const getEnvVariable = (key: string, defaultValue: string = ''): string => {
  // For Vite, environment variables are prefixed with VITE_
  const envValue = import.meta.env[`VITE_${key}`];
  return envValue !== undefined ? envValue : defaultValue;
};

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hardcoded credentials for development
const HARDCODED_EMAIL = getEnvVariable('DEV_USERNAME');
const HARDCODED_PASSWORD = getEnvVariable('DEV_PASSWORD');

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            setUser({
              id: userData.user.id,
              email: userData.user.email || '',
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with:', { email });
      
      // Check for hardcoded credentials
      if (email === HARDCODED_EMAIL && password === HARDCODED_PASSWORD) {
        console.log('Using hardcoded credentials for development');
        
        // Set a mock user
        setUser({
          id: 'hardcoded-user-id',
          email: HARDCODED_EMAIL
        });
        
        // Create a new conversation ID for the user
        const newSessionId = uuidv4();
        localStorage.setItem("currentSessionId", newSessionId);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in using development credentials.",
        });
        
        return;
      }
      
      // If not using hardcoded credentials, try Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (data?.user) {
        console.log('Sign in successful');
        
        // Create a new conversation ID for the user
        const newSessionId = uuidv4();
        localStorage.setItem("currentSessionId", newSessionId);
        
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting to sign up with:', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Set this to false if you don't want email confirmation
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        toast({
          title: "Registration error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      if (data.user) {
        console.log('Sign up successful');
        
        // Create a new conversation ID for the user
        const newSessionId = uuidv4();
        localStorage.setItem("currentSessionId", newSessionId);
        
        toast({
          title: "Registration successful",
          description: "Please check your email for verification.",
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      
      // Clear any session-related data
      localStorage.removeItem("currentSessionId");
      localStorage.removeItem("lastMessages");
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
