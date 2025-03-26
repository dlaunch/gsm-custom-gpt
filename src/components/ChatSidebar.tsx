import { useState, useEffect } from "react";
import { getConversations } from "@/lib/chat-service";
import { ConversationItem } from "./ConversationItem";
import { ChevronLeft, ChevronRight, MessageSquare, X, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import { v4 as uuidv4 } from 'uuid';

interface ChatSidebarProps {
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  onNewConversation: () => void;
}

export function ChatSidebar({ activeSessionId, onSelectSession, onNewConversation }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Array<{ session_id: string; title: string }>>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      const data = await getConversations();
      setConversations(data);
    };

    fetchConversations();
    
    // Refresh conversations every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNewConversation = () => {
    onNewConversation();
  };

  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col w-12 bg-sidebar border-r border-border animate-fade-in">
        <div className="p-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsCollapsed(false)} 
            className="w-8 h-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            className="w-8 h-8"
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-64 bg-sidebar border-r border-border animate-fade-in">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-primary mr-2" />
          <h2 className="font-medium text-sidebar-foreground">Conversations</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsCollapsed(true)} 
          className="w-8 h-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-2">
        <Button 
          variant="outline" 
          onClick={handleNewConversation}
          className="w-full justify-start text-sm"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.session_id}
            title={conversation.title}
            active={conversation.session_id === activeSessionId}
            onClick={() => onSelectSession(conversation.session_id)}
          />
        ))}
      </div>
      
      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          onClick={signOut} 
          className="w-full justify-start text-sm"
        >
          <X className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
