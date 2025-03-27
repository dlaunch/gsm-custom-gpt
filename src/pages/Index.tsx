import { useAuth } from "@/lib/auth-provider";
import { AuthForm } from "@/components/AuthForm";
import { ChatInterface } from "@/components/ChatInterface";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';

const Index = () => {
  const { user, loading } = useAuth();
  const hasLoggedInRef = useRef(false);
  
  // Create a new conversation when user logs in
  useEffect(() => {
    if (user && !hasLoggedInRef.current) {
      // Mark that we've handled the login
      hasLoggedInRef.current = true;
      
      // Generate a new session ID and store it
      const newSessionId = uuidv4();
      localStorage.setItem("currentSessionId", newSessionId);
      
      // Clear any existing messages in localStorage to ensure a fresh start
      localStorage.removeItem("lastMessages");
      
      console.log("User logged in, created new conversation with ID:", newSessionId);
    } else if (!user) {
      // Reset the ref when user logs out
      hasLoggedInRef.current = false;
    }
  }, [user]);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {user ? <ChatInterface /> : <div className="h-screen flex items-center justify-center p-4"><AuthForm /></div>}
    </div>
  );
};

export default Index;
