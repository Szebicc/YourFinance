export const CATEGORIES = [
  "Food",
  "Rent",
  "Salary",
  "Freelance",
  "Bonus",
  "Gifts",
  "Utilities",
  "Entertainment",
  "Other",
] as const;

export const PAYMENT_METHODS = [
  "Credit Card",
  "Cash",
  "Bank Transfer",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
