import { Schema, model, models, Document } from "mongoose";

export interface IUserProfile extends Document {
  userId: string;
  // Stored as plain number in the DB; interpreted as the user's expected
  // total income for the current month (same currency as records).
  monthlyIncome: number;
}

const userProfileSchema = new Schema<IUserProfile>(
  {
    userId: { type: String, required: true, unique: true },
    monthlyIncome: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const UserProfile =
  models.UserProfile || model<IUserProfile>("UserProfile", userProfileSchema);

