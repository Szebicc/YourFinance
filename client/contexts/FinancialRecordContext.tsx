"use client";

import { createContext, useContext } from "react";
import { FinancialRecord } from "@/types/financial-record";

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  isLoading: boolean;
  error: string | null;
  addRecord: (record: Omit<FinancialRecord, "_id">) => Promise<void>;
  updateRecord: (id: string, record: Partial<FinancialRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export const FinancialRecordsContext =
  createContext<FinancialRecordsContextType | undefined>(undefined);

export const useFinancialRecords = () => {
  const ctx = useContext(FinancialRecordsContext);
  if (!ctx) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }
  return ctx;
};