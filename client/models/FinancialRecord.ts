import { Schema, model, models, Document } from "mongoose";

export interface IFinancialRecord extends Document {
  userId: string;
  date: Date | null;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

const financialRecordSchema = new Schema<IFinancialRecord>(
  {
    userId: { type: String, required: true },
    date: { type: Date },
    description: { type: String },
    amount: { type: Number },
    category: { type: String },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

export const FinancialRecord =
  models.FinancialRecord ||
  model<IFinancialRecord>("FinancialRecord", financialRecordSchema);
