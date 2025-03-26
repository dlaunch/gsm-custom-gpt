import { cn } from "@/lib/utils";

interface ConversationItemProps {
  title: string;
  active: boolean;
  onClick: () => void;
}

export function ConversationItem({ title, active, onClick }: ConversationItemProps) {
  return (
    <div 
      className={cn("sidebar-conversation", active && "active")}
      onClick={onClick}
    >
      <p className="truncate text-sm">{title}</p>
    </div>
  );
}
