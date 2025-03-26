import { UserMessage } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: UserMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUserMessage = message.message.type === "human";
  
  return (
    <div className={cn(
      "flex",
      isUserMessage ? "justify-end" : "justify-start",
      "mb-4"
    )}>
      <div className={isUserMessage ? "user-bubble" : "ai-bubble"}>
        {isUserMessage ? (
          <p>{message.message.content}</p>
        ) : (
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
        )}
      </div>
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
