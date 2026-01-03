import { PriceSummary as PriceSummaryType } from "@/types/checkout";
import { PRICING } from "@/lib/pricing";
import { Users, Ticket, Shield, Tag, Receipt } from "lucide-react";

interface PriceSummaryProps {
  summary: PriceSummaryType;
}

export function PriceSummary({ summary }: PriceSummaryProps) {
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="checkout-card sticky top-4">
      <h2 className="section-title flex items-center gap-2">
        <Receipt className="w-5 h-5 text-primary" />
        Price Summary
      </h2>

      <div className="space-y-1">
        <div className="price-row">
          <span className="price-row-label flex items-center gap-2">
            <Users className="w-4 h-4" />
            Number of Travellers
          </span>
          <span className="price-row-value">{summary.numberOfTravellers}</span>
        </div>

        <div className="price-row">
          <span className="price-row-label flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Ticket ({formatCurrency(PRICING.ticketCostPerPerson)} × {summary.numberOfTravellers})
          </span>
          <span className="price-row-value">{formatCurrency(summary.ticketTotal)}</span>
        </div>

        <div className="price-row">
          <span className="price-row-label">
            GST ({PRICING.gstPercentage}% on tickets)
          </span>
          <span className="price-row-value">{formatCurrency(summary.gstAmount)}</span>
        </div>

        <div className="price-row">
          <span className="price-row-label flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Life Jacket ({formatCurrency(PRICING.lifeJacketCostPerPerson)} × {summary.numberOfTravellers})
          </span>
          <span className="price-row-value">{formatCurrency(summary.lifeJacketTotal)}</span>
        </div>

        {summary.discount > 0 && (
          <div className="price-row text-success">
            <span className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Coupon Discount
            </span>
            <span className="font-medium">-{formatCurrency(summary.discount)}</span>
          </div>
        )}

        <div className="price-row price-row-total">
          <span>Total Payable</span>
          <span className="text-primary">{formatCurrency(summary.finalAmount)}</span>
        </div>
      </div>
    </div>
  );
}
