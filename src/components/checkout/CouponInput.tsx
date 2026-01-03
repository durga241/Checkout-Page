import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Check, AlertCircle, Loader2, Tag, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface CouponInputProps {
  onApplyCoupon: (code: string) => { valid: boolean; message: string };
  appliedCoupon: string | null;
  onRemoveCoupon: () => void;
}

export function CouponInput({
  onApplyCoupon,
  appliedCoupon,
  onRemoveCoupon,
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = onApplyCoupon(code);
      setMessage({
        type: result.valid ? "success" : "error",
        text: result.message,
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while applying the coupon. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setMessage(null);
    onRemoveCoupon();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !appliedCoupon) {
      handleApply();
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center justify-center">
            <Percent className="w-4 h-4 text-primary" />
          </div>
          <Input
            placeholder="Enter coupon code"
            value={appliedCoupon || code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!!appliedCoupon || isLoading}
            className={cn(
              "flex-1 pl-10 pr-28 h-12 rounded-lg transition-all duration-200 border-2",
              appliedCoupon 
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700" 
                : message?.type === "error" 
                  ? "border-red-500 focus-visible:ring-red-200 focus-visible:ring-1" 
                  : "border-border focus-visible:ring-2 focus-visible:ring-primary/20"
            )}
          />
          
          {appliedCoupon ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemove}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 text-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-foreground border border-input hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500 rounded-md transition-colors shadow-sm"
            >
              Remove
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleApply}
              disabled={!code.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-md shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Apply
            </Button>
          )}
        </div>

        {message && (
          <div
            className={cn(
              "mt-2 text-sm flex items-start gap-2 p-3 rounded-md border",
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-100 dark:border-red-800"
            )}
          >
            {message.type === "success" ? (
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {!appliedCoupon && !message && (
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
            <span>Try:</span>
            <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">NEW10</span>
            <span>(min 2 travellers) or</span>
            <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">NEW20</span>
            <span>(min 4 travellers)</span>
          </p>
        )}
      </div>
    </div>
  );
}
