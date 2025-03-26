import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  chatModel: "OpenAI" | "Anthropic";
  setChatModel: (model: "OpenAI" | "Anthropic") => void;
  modelVersion: string;
  setModelVersion: (version: string) => void;
  compact?: boolean;
}

type ModelOption = {
  value: string;
  label: string;
  provider: "OpenAI" | "Anthropic";
  isNew?: boolean;
  isFeatured?: boolean;
};

export function ModelSelector({
  chatModel,
  setChatModel,
  modelVersion,
  setModelVersion,
  compact = false
}: ModelSelectorProps) {
  const models: ModelOption[] = [
    // OpenAI Models
    { value: "gpt-4o", label: "GPT-4o", provider: "OpenAI", isFeatured: true },
    { value: "gpt-4o-mini", label: "GPT-4o Mini", provider: "OpenAI" },
    { value: "o3-mini", label: "OpenAI o3-mini", provider: "OpenAI" },
    { value: "o1", label: "OpenAI o1", provider: "OpenAI" },
    { value: "o1-mini", label: "OpenAI o1-mini", provider: "OpenAI" },
    
    // Anthropic Models
    { value: "claude-3-7-sonnet-20250219", label: "Claude 3.7 Sonnet", provider: "Anthropic", isNew: true, isFeatured: true },
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku", provider: "Anthropic" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", provider: "Anthropic" },
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus", provider: "Anthropic" },
    { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet", provider: "Anthropic" },
  ];

  const selectedModel = models.find(model => model.value === modelVersion) || models[0];
  
  // Get a simplified display name for the compact view
  const getDisplayName = () => {
    if (selectedModel.provider === "OpenAI") {
      // Extract the model name without version numbers
      return selectedModel.label.split(' ')[0];
    } else {
      // For Anthropic, just show "Claude"
      return "Claude";
    }
  };

  const handleSelectModel = (model: ModelOption) => {
    setModelVersion(model.value);
    setChatModel(model.provider);
  };

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 px-2 text-xs font-medium border border-border/50 rounded-md hover:bg-accent/50 flex items-center gap-1"
          >
            <div className={cn(
              "w-1.5 h-1.5 rounded-full",
              selectedModel.provider === "OpenAI" ? "bg-emerald-500" : "bg-purple-500"
            )} />
            {getDisplayName()}
            <ChevronDown className="h-3 w-3 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[240px] max-h-[400px] overflow-y-auto" align="start">
          <DropdownMenuLabel className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OpenAI Models</span>
          </DropdownMenuLabel>
          {models
            .filter(model => model.provider === "OpenAI")
            .map(model => (
              <DropdownMenuItem 
                key={model.value}
                className={cn(
                  "flex items-center justify-between py-1.5 text-sm",
                  modelVersion === model.value && "bg-accent"
                )}
                onClick={() => handleSelectModel(model)}
              >
                <div className="flex items-center gap-2">
                  <span>{model.label}</span>
                  {model.isNew && (
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-1 py-0.5 rounded-full">New</span>
                  )}
                  {model.isFeatured && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                {modelVersion === model.value && <Check className="h-3.5 w-3.5" />}
              </DropdownMenuItem>
            ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Anthropic Models</span>
          </DropdownMenuLabel>
          {models
            .filter(model => model.provider === "Anthropic")
            .map(model => (
              <DropdownMenuItem 
                key={model.value}
                className={cn(
                  "flex items-center justify-between py-1.5 text-sm",
                  modelVersion === model.value && "bg-accent"
                )}
                onClick={() => handleSelectModel(model)}
              >
                <div className="flex items-center gap-2">
                  <span>{model.label}</span>
                  {model.isNew && (
                    <span className="text-[10px] bg-blue-500/10 text-blue-600 px-1 py-0.5 rounded-full">New</span>
                  )}
                  {model.isFeatured && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                {modelVersion === model.value && <Check className="h-3.5 w-3.5" />}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="relative bg-background/80 backdrop-blur-sm border border-border rounded-lg shadow-sm z-10 mt-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between px-3 py-5 h-auto text-left font-normal"
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                selectedModel.provider === "OpenAI" ? "bg-emerald-500" : "bg-purple-500"
              )} />
              <span className="text-sm font-medium">{selectedModel.label}</span>
              {selectedModel.isNew && (
                <span className="text-xs bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full">New</span>
              )}
              {selectedModel.isFeatured && (
                <span className="text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full">Featured</span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{selectedModel.provider}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[280px] max-h-[400px] overflow-y-auto" align="start">
          <DropdownMenuLabel className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>OpenAI Models</span>
          </DropdownMenuLabel>
          {models
            .filter(model => model.provider === "OpenAI")
            .map(model => (
              <DropdownMenuItem 
                key={model.value}
                className={cn(
                  "flex items-center justify-between py-2",
                  modelVersion === model.value && "bg-accent"
                )}
                onClick={() => handleSelectModel(model)}
              >
                <div className="flex items-center gap-2">
                  <span>{model.label}</span>
                  {model.isNew && (
                    <span className="text-xs bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full">New</span>
                  )}
                  {model.isFeatured && (
                    <span className="text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                {modelVersion === model.value && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuLabel className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Anthropic Models</span>
          </DropdownMenuLabel>
          {models
            .filter(model => model.provider === "Anthropic")
            .map(model => (
              <DropdownMenuItem 
                key={model.value}
                className={cn(
                  "flex items-center justify-between py-2",
                  modelVersion === model.value && "bg-accent"
                )}
                onClick={() => handleSelectModel(model)}
              >
                <div className="flex items-center gap-2">
                  <span>{model.label}</span>
                  {model.isNew && (
                    <span className="text-xs bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full">New</span>
                  )}
                  {model.isFeatured && (
                    <span className="text-xs bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full">Featured</span>
                  )}
                </div>
                {modelVersion === model.value && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
