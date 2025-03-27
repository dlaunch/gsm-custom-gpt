import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface ModelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  additionalPrompts: string;
  setAdditionalPrompts: (prompts: string) => void;
}

export function ModelSettings({ 
  isOpen, 
  onClose, 
  additionalPrompts,
  setAdditionalPrompts
}: ModelSettingsProps) {
  const [localPrompts, setLocalPrompts] = useState(additionalPrompts);
  
  // Update local state when props change
  useEffect(() => {
    setLocalPrompts(additionalPrompts);
  }, [additionalPrompts]);
  
  const handleSave = () => {
    setAdditionalPrompts(localPrompts);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize GSM GPT</DialogTitle>
          <DialogDescription>
            Customize how GSM GPT responds to your requests.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="additionalPrompts">Add any other tasks or prompts for GSM GPT here</Label>
            <Textarea
              id="additionalPrompts"
              value={localPrompts}
              onChange={(e) => setLocalPrompts(e.target.value)}
              placeholder="E.g., Always include actionable steps, Focus on B2B marketing strategies, etc."
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
