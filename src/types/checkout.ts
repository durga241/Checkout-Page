export interface Traveller {
  id: string;
  name: string;
  contactNumber: string;
  thumbprintCaptured: boolean;
}

export interface PricingDetails {
  ticketCostPerPerson: number;
  lifeJacketCostPerPerson: number;
  gstPercentage: number;
}

export interface CouponDetails {
  code: string;
  minTravellers: number;
  discount: number;
}

export interface PriceSummary {
  numberOfTravellers: number;
  ticketTotal: number;
  gstAmount: number;
  lifeJacketTotal: number;
  discount: number;
  finalAmount: number;
}
