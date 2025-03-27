import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMessage } from "@/lib/supabase";
import { sendMessage, getMessages, subscribeToMessages } from "@/lib/chat-service";
import { ChatMessage, LoadingMessage } from "./ChatMessage";
import { ChatSidebar } from "./ChatSidebar";
import { Send, BookText, FileText, Settings } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";
import { ModelSettings } from "./ModelSettings";
import { ModelSelector } from "./ModelSelector";

export function ChatInterface() {
  const [sessionId, setSessionId] = useState<string>(() => {
    // Get the session ID from localStorage (which is set on login)
    const savedSessionId = localStorage.getItem("currentSessionId");
    return savedSessionId || uuidv4();
  });
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chatModel, setChatModel] = useState<"OpenAI" | "Anthropic">("OpenAI");
  const [modelVersion, setModelVersion] = useState<string>("");
  const [additionalPrompts, setAdditionalPrompts] = useState<string>(() => {
    return localStorage.getItem("gsmAdditionalPrompts") || "";
  });
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousSessionIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (chatModel === "OpenAI") {
      setModelVersion("gpt-4o");
    } else if (chatModel === "Anthropic") {
      setModelVersion("claude-3-7-sonnet-20250219");
    }
  }, [chatModel]);
  
  // Save additional prompts to localStorage when they change
  useEffect(() => {
    localStorage.setItem("gsmAdditionalPrompts", additionalPrompts);
  }, [additionalPrompts]);
  
  // Handle scrolling when messages change or when shouldScrollToBottom is true
  useEffect(() => {
    if (shouldScrollToBottom && messageEndRef.current && !isLoadingMessages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom, isLoadingMessages]);
  
  // Load messages when sessionId changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoadingMessages(true);
      
      // Check if this is a session change
      const isSessionChange = previousSessionIdRef.current !== null && 
                             previousSessionIdRef.current !== sessionId;
      
      // Update the previous session ID
      previousSessionIdRef.current = sessionId;
      
      // Save the current session ID to localStorage
      localStorage.setItem("currentSessionId", sessionId);
      
      try {
        const messagesData = await getMessages(sessionId);
        
        // Update messages state
        setMessages(messagesData);
        
        // Determine if we should scroll to bottom
        // Only scroll to bottom for new conversations or session changes
        if (isSessionChange || messagesData.length === 0) {
          setShouldScrollToBottom(true);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      } finally {
        // Set loading to false after a short delay to ensure DOM has updated
        setTimeout(() => {
          setIsLoadingMessages(false);
        }, 50);
      }
    };
    
    loadMessages();
    
    // Set up subscription for real-time updates
    const subscription = subscribeToMessages(sessionId, (newMessage) => {
      // Only add AI messages from the subscription
      // User messages are added directly in the handleSendMessage function
      if (newMessage.message.type === "ai") {
        setMessages((prev) => {
          const exists = prev.some(msg => msg.id === newMessage.id);
          if (exists) {
            return prev;
          }
          const updatedMessages = [...prev, newMessage];
          // Scroll to bottom when receiving a new AI message
          setShouldScrollToBottom(true);
          return updatedMessages;
        });
      }
      setIsLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [sessionId]);
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessageObj: UserMessage = {
      id: uuidv4(),
      session_id: sessionId,
      message: {
        content: inputValue,
        type: "human"
      }
    };
    
    // Add the user message to the messages state
    setMessages(prev => [...prev, userMessageObj]);
    
    // Scroll to bottom when sending a message
    setShouldScrollToBottom(true);
    
    setInputValue("");
    setIsLoading(true);
    
    const modelParams: Record<string, string> = {};
    if (chatModel === "OpenAI") {
      modelParams.openaiModel = modelVersion;
    } else if (chatModel === "Anthropic") {
      modelParams.anthropicModel = modelVersion;
    }
    
    // Add additional prompts to the payload if they exist
    if (additionalPrompts.trim()) {
      modelParams.additionalPrompts = additionalPrompts.trim();
    }
    
    const success = await sendMessage(inputValue, sessionId, chatModel, modelParams);
    
    if (!success) {
      setIsLoading(false);
      toast.error("Failed to send message. Please try again.");
    }
  };
  
  const handleNewConversation = () => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setMessages([]);
    setShouldScrollToBottom(true);
  };
  
  const handleSessionSelect = (selectedSessionId: string) => {
    if (selectedSessionId !== sessionId) {
      setSessionId(selectedSessionId);
    }
  };

  const handlePromptShortcut = (promptTemplate: string) => {
    if (isLoading) return;
    setInputValue(promptTemplate);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const isNewConversation = messages.length === 0;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <ChatSidebar 
        activeSessionId={sessionId} 
        onSelectSession={handleSessionSelect}
        onNewConversation={handleNewConversation}
      />
      
      <div className="flex-1 flex flex-col h-full relative">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-xl font-semibold">Growth Stage Marketing AI</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6 flex flex-col"
          style={{ position: 'relative' }}
        >
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-16">
              <LoadingMessage />
            </div>
          ) : isNewConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Header content stays at the top */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2 text-foreground/80">GSM Custom GPT</h2>
                <p className="text-muted-foreground mb-6">Start a conversation with your AI assistant</p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2" 
                    onClick={() => handlePromptShortcut("Create a comprehensive blog post about the following topic: ")}
                  >
                    <BookText className="h-4 w-4" />
                    Create a blog post
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2" 
                    onClick={() => handlePromptShortcut("Create a detailed whitepaper on the following subject: ")}
                  >
                    <FileText className="h-4 w-4" />
                    Create a whitepaper
                  </Button>
                </div>
              </div>
              
              {/* Chatbox at the top of the remaining space (flex-start) instead of centered */}
              <div className="flex-1 flex items-start justify-center">
                <div className="max-w-3xl w-full">
                  <form 
                    onSubmit={handleSendMessage} 
                    className="flex flex-col w-full"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                          <ModelSelector
                            chatModel={chatModel}
                            setChatModel={setChatModel}
                            modelVersion={modelVersion}
                            setModelVersion={setModelVersion}
                            compact={true}
                          />
                        </div>
                        <Input
                          ref={inputRef}
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 bg-background border-border focus-visible:ring-primary rounded-xl py-6 pl-[120px]"
                          disabled={isLoading}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isLoading || !inputValue.trim()}
                        className="transition-all duration-200 ease-in-out"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-5xl mx-auto w-full">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isLoading && <LoadingMessage />}
                
                <div ref={messageEndRef} />
              </div>
            </>
          )}
        </div>
        
        {/* Input form for ongoing conversation - fixed at the bottom */}
        {!isNewConversation && (
          <div className="p-4 border-t border-border w-full">
            <div className="relative max-w-5xl mx-auto">
              <form 
                onSubmit={handleSendMessage} 
                className="flex flex-col w-full"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                      <ModelSelector
                        chatModel={chatModel}
                        setChatModel={setChatModel}
                        modelVersion={modelVersion}
                        setModelVersion={setModelVersion}
                        compact={true}
                      />
                    </div>
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-background border-border focus-visible:ring-primary rounded-xl py-6 pl-[120px]"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading || !inputValue.trim()}
                    className="transition-all duration-200 ease-in-out"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      
      <ModelSettings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        additionalPrompts={additionalPrompts}
        setAdditionalPrompts={setAdditionalPrompts}
      />
    </div>
  );
}
