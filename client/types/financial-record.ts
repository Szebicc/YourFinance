export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: string | Date | null;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}
