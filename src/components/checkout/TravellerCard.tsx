import { useState } from "react";
import { Traveller } from "@/types/checkout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Fingerprint, Check, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TravellerCardProps {
  traveller: Traveller;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, updates: Partial<Traveller>) => void;
  onDelete: (id: string) => void;
  errors: { name?: string; contactNumber?: string; thumbprint?: string };
}

export function TravellerCard({
  traveller,
  index,
  canDelete,
  onUpdate,
  onDelete,
  errors,
}: TravellerCardProps) {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleThumbprintCapture = () => {
    setIsCapturing(true);
    // Simulate thumbprint capture
    setTimeout(() => {
      onUpdate(traveller.id, { thumbprintCaptured: true });
      setIsCapturing(false);
    }, 1500);
  };

  return (
    <div className="traveller-card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">Traveller {index + 1}</span>
        </div>
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(traveller.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`name-${traveller.id}`} className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id={`name-${traveller.id}`}
            placeholder="Enter full name"
            value={traveller.name}
            onChange={(e) => onUpdate(traveller.id, { name: e.target.value })}
            className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`contact-${traveller.id}`} className="text-sm font-medium">
            Contact Number *
          </Label>
          <Input
            id={`contact-${traveller.id}`}
            placeholder="10-digit mobile number"
            value={traveller.contactNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 10);
              onUpdate(traveller.id, { contactNumber: value });
            }}
            className={cn(errors.contactNumber && "border-destructive focus-visible:ring-destructive")}
          />
          {errors.contactNumber && <p className="text-xs text-destructive">{errors.contactNumber}</p>}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label className="text-sm font-medium">Thumbprint Verification *</Label>
        <div className="flex items-center gap-3">
          {traveller.thumbprintCaptured ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 text-success">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Thumbprint Captured</span>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleThumbprintCapture}
              disabled={isCapturing}
              className="gap-2"
            >
              <Fingerprint className={cn("w-5 h-5", isCapturing && "animate-pulse")} />
              {isCapturing ? "Capturing..." : "Capture Thumbprint"}
            </Button>
          )}
        </div>
        {errors.thumbprint && <p className="text-xs text-destructive">{errors.thumbprint}</p>}
      </div>
    </div>
  );
}
