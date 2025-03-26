import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ModelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  chatModel: "OpenAI" | "Anthropic";
  setChatModel: (model: "OpenAI" | "Anthropic") => void;
}

export function ModelSettings({ 
  isOpen, 
  onClose, 
  chatModel, 
  setChatModel 
}: ModelSettingsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Model Settings</DialogTitle>
          <DialogDescription>
            Select which AI model you want to use for your conversations.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup 
            value={chatModel} 
            onValueChange={(value) => setChatModel(value as "OpenAI" | "Anthropic")}
            className="gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OpenAI" id="openai" />
              <Label htmlFor="openai" className="cursor-pointer">OpenAI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Anthropic" id="anthropic" />
              <Label htmlFor="anthropic" className="cursor-pointer">Anthropic</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
