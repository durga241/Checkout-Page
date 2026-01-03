import { CouponDetails, PriceSummary } from "@/types/checkout";

export const PRICING = {
  ticketCostPerPerson: 1000,
  lifeJacketCostPerPerson: 100,
  gstPercentage: 18,
};

export const COUPONS: CouponDetails[] = [
  { code: "NEW10", minTravellers: 2, discount: 100 },
  { code: "NEW20", minTravellers: 4, discount: 200 },
];

export function validateCoupon(code: string, travellersCount: number): { valid: boolean; discount: number; message: string } {
  const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return { valid: false, discount: 0, message: "Invalid coupon code" };
  }

  if (travellersCount < coupon.minTravellers) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum ${coupon.minTravellers} travellers required for this coupon`,
    };
  }

  // Format the discount amount with Indian Rupee symbol
  const formattedDiscount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(coupon.discount).replace('₹', '₹');
  
  return { valid: true, discount: coupon.discount, message: `${formattedDiscount} discount applied!` };
}

export function calculatePricing(travellersCount: number, discount: number): PriceSummary {
  const ticketTotal = travellersCount * PRICING.ticketCostPerPerson;
  const gstAmount = (ticketTotal * PRICING.gstPercentage) / 100;
  const lifeJacketTotal = travellersCount * PRICING.lifeJacketCostPerPerson;

  const subtotal = ticketTotal + gstAmount + lifeJacketTotal;
  const finalAmount = Math.max(0, subtotal - discount);

  return {
    numberOfTravellers: travellersCount,
    ticketTotal,
    gstAmount,
    lifeJacketTotal,
    discount,
    finalAmount,
  };
}
