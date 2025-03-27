import { UserMessage } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useRef } from "react";
import { ClipboardCopy, Check } from "lucide-react";

interface ChatMessageProps {
  message: UserMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUserMessage = message.message.type === "human";
  const [copied, setCopied] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleCopy = () => {
    if (!textAreaRef.current) return;
    
    // Select the text
    textAreaRef.current.select();
    textAreaRef.current.setSelectionRange(0, 99999);
    
    try {
      // Use document.execCommand which has better compatibility
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  return (
    <div className="mb-4">
      <div className={cn(
        "flex",
        isUserMessage ? "justify-end" : "justify-start"
      )}>
        <div className={isUserMessage ? "user-bubble" : "ai-bubble"}>
          {isUserMessage ? (
            <p>{message.message.content}</p>
          ) : (
            <>
              <ReactMarkdown
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  // Apply styling to the markdown content through components
                  p: ({ children }) => <p className="prose-p">{children}</p>,
                  ul: ({ children }) => <ul className="prose-ul list-disc ml-4 my-2">{children}</ul>,
                  ol: ({ children }) => <ol className="prose-ol list-decimal ml-4 my-2">{children}</ol>,
                  code: ({ children }) => <code className="prose-code bg-muted px-1 py-0.5 rounded">{children}</code>,
                  pre: ({ children }) => <pre className="prose-pre bg-muted p-2 rounded my-2 overflow-x-auto">{children}</pre>,
                  a: ({ href, children }) => <a href={href} className="prose-a text-primary underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                }}
              >
                {message.message.content}
              </ReactMarkdown>
              <textarea
                ref={textAreaRef}
                value={message.message.content}
                readOnly
                className="sr-only"
                aria-hidden="true"
              />
            </>
          )}
        </div>
      </div>
      
      {!isUserMessage && (
        <div className="mt-1 ml-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 transition-all duration-200"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ClipboardCopy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy to clipboard</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="flex justify-start mb-4">
      <div className="ai-bubble flex items-center space-x-2">
        <div className="loading-dot" style={{ animationDelay: "0ms" }}></div>
        <div className="loading-dot" style={{ animationDelay: "300ms" }}></div>
        <div className="loading-dot" style={{ animationDelay: "600ms" }}></div>
      </div>
    </div>
  );
}
