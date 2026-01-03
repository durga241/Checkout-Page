import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { Traveller } from "@/types/checkout";
import { validateCoupon, calculatePricing } from "@/lib/pricing";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { TravellerCard } from "@/components/checkout/TravellerCard";
import { DateSelector } from "@/components/checkout/DateSelector";
import { CouponInput } from "@/components/checkout/CouponInput";
import { PriceSummary } from "@/components/checkout/PriceSummary";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, CreditCard, Users } from "lucide-react";

function createEmptyTraveller(): Traveller {
  return {
    id: uuidv4(),
    name: "",
    contactNumber: "",
    thumbprintCaptured: false,
  };
}

interface TravellerErrors {
  [key: string]: {
    name?: string;
    contactNumber?: string;
    thumbprint?: string;
  };
}

export default function Index() {
  const { toast } = useToast();
  const [travellers, setTravellers] = useState<Traveller[]>([createEmptyTraveller()]);
  const [travelDate, setTravelDate] = useState<Date | undefined>();
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState<TravellerErrors>({});
  const [dateError, setDateError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if all travellers have completed thumbprint
  const allThumbprintsCaptured = useMemo(() => {
    return travellers.every(t => t.thumbprintCaptured);
  }, [travellers]);

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    return allThumbprintsCaptured && travelDate !== undefined;
  }, [allThumbprintsCaptured, travelDate]);

  const priceSummary = useMemo(() => {
    return calculatePricing(travellers.length, discount);
  }, [travellers.length, discount]);

  const handleAddTraveller = () => {
    setTravellers([...travellers, createEmptyTraveller()]);
  };

  const handleUpdateTraveller = (id: string, updates: Partial<Traveller>) => {
    setTravellers(
      travellers.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    // Clear errors for this field
    if (errors[id]) {
      setErrors({
        ...errors,
        [id]: {
          ...errors[id],
          ...(updates.name !== undefined && { name: undefined }),
          ...(updates.contactNumber !== undefined && { contactNumber: undefined }),
          ...(updates.thumbprintCaptured !== undefined && { thumbprint: undefined }),
        },
      });
    }
  };

  const handleDeleteTraveller = (id: string) => {
    const newTravellers = travellers.filter((t) => t.id !== id);
    setTravellers(newTravellers);

    // Re-validate coupon with new traveller count
    if (appliedCoupon) {
      const result = validateCoupon(appliedCoupon, newTravellers.length);
      if (!result.valid) {
        setAppliedCoupon(null);
        setDiscount(0);
        toast({
          title: "Coupon Removed",
          description: result.message,
          variant: "destructive",
        });
      }
    }
  };

  const [couponError, setCouponError] = useState<string | null>(null);

  const handleApplyCoupon = (code: string) => {
    const result = validateCoupon(code, travellers.length);
    if (result.valid) {
      setAppliedCoupon(code);
      setDiscount(result.discount);
      setCouponError(null);
    } else {
      setCouponError(result.message);
    }
    return result;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponError(null);
  };

  const validateForm = (): boolean => {
    const newErrors: TravellerErrors = {};
    let hasErrors = false;

    travellers.forEach((t) => {
      const travellerErrors: { name?: string; contactNumber?: string; thumbprint?: string } = {};

      if (!t.name.trim()) {
        travellerErrors.name = "Name is required";
        hasErrors = true;
      } else if (t.name.trim().length < 2) {
        travellerErrors.name = "Name must be at least 2 characters";
        hasErrors = true;
      }

      if (!t.contactNumber) {
        travellerErrors.contactNumber = "Contact number is required";
        hasErrors = true;
      } else if (t.contactNumber.length !== 10) {
        travellerErrors.contactNumber = "Contact number must be 10 digits";
        hasErrors = true;
      }

      if (!t.thumbprintCaptured) {
        travellerErrors.thumbprint = "Thumbprint verification is required";
        hasErrors = true;
      }

      if (Object.keys(travellerErrors).length > 0) {
        newErrors[t.id] = travellerErrors;
      }
    });

    setErrors(newErrors);

    if (!travelDate) {
      setDateError("Please select a travel date");
      hasErrors = true;
    } else {
      setDateError(undefined);
    }

    return !hasErrors;
  };

  const resetForm = () => {
    // Reset all form state
    setTravellers([createEmptyTraveller()]);
    setTravelDate(undefined);
    setAppliedCoupon(null);
    setDiscount(0);
    setErrors({});
    setDateError(undefined);
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      // Save the success message before resetting the form
      const successMessage = `Your adventure for ${travellers.length} traveller(s) on ${travelDate?.toLocaleDateString()} is booked!`;
      
      // Reset the form
      resetForm();
      
      // Show success message
      setIsSubmitting(false);
      toast({
        title: "Booking Confirmed! 🎉",
        description: successMessage,
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <CheckoutHeader />

      <main className="container py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="checkout-card">
              <h2 className="section-title">Select Travel Date</h2>
              <DateSelector
                date={travelDate}
                onDateChange={(date) => {
                  setTravelDate(date);
                  setDateError(undefined);
                }}
                error={dateError}
              />
            </div>

            {/* Traveller Details */}
            <div className="checkout-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title mb-0 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Traveller Details
                </h2>
                <span className="text-sm text-muted-foreground">
                  {travellers.length} traveller{travellers.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-4">
                {travellers.map((traveller, index) => (
                  <TravellerCard
                    key={traveller.id}
                    traveller={traveller}
                    index={index}
                    canDelete={travellers.length > 1}
                    onUpdate={handleUpdateTraveller}
                    onDelete={handleDeleteTraveller}
                    errors={errors[traveller.id] || {}}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={handleAddTraveller}
                className="w-full mt-4 gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Another Traveller
              </Button>
            </div>

            {/* Coupon Section */}
            <div className="checkout-card">
              <div className="space-y-2">
                <CouponInput
                  onApplyCoupon={handleApplyCoupon}
                  appliedCoupon={appliedCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />
                {couponError && (
                  <p className="text-sm text-destructive">{couponError}</p>
                )}
              </div>
            </div>

            {/* Mobile Price Summary */}
            <div className="lg:hidden">
              <PriceSummary summary={priceSummary} />
            </div>
          </div> {/* Close lg:col-span-2 */}

          {/* Sidebar - Desktop Price Summary with Pay Button */}
          <div className="hidden lg:block space-y-4">
            <div className="checkout-card">
              <PriceSummary summary={priceSummary} />
              <div className="mt-6 space-y-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting || !allThumbprintsCaptured}
                  className="w-full gap-2 text-lg py-4 transition-all duration-200 relative"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Pay ₹{priceSummary.finalAmount.toLocaleString("en-IN")}
                    </>
                  )}
                </Button>

                {!allThumbprintsCaptured && (
                  <p className="text-sm text-destructive text-center mt-2">
                    Please complete thumbprint verification for all travellers
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="lg:hidden space-y-4">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting || !allThumbprintsCaptured}
              className="w-full gap-2 text-lg py-4 transition-all duration-200 relative"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ₹{priceSummary.finalAmount.toLocaleString("en-IN")}
                </>
              )}
            </Button>

            {!allThumbprintsCaptured && (
              <p className="text-sm text-destructive text-center mt-2">
                Please complete thumbprint verification for all travellers
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
