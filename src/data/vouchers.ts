export interface Voucher {
  code: string;
  discountType: "percent" | "fixed" | "freeshipping";
  value: number; // e.g. 10 for 10%
  description: string;
  expiryDays: number;
  emoji: string;
}

export const vouchers: Voucher[] = [
  {
    code: "SAVE10",
    discountType: "percent",
    value: 10,
    description: "10% off your entire order",
    expiryDays: 3,
    emoji: "🎁"
  },
  {
    code: "FREESHIP",
    discountType: "freeshipping",
    value: 0,
    description: "Free shipping on any order",
    expiryDays: 7,
    emoji: "🏷️"
  }
];
