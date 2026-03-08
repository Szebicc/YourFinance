"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, ReactNode } from "react";
import { FinancialRecord } from "@/types/financial-record";
import { FinancialRecordsContext } from "./FinancialRecordContext";
import {
  getFinancialRecords,
  createFinancialRecord,
  updateFinancialRecord,
  deleteFinancialRecord,
} from "@/lib/api/financial-records";

interface Props {
  children: ReactNode;
}

export const FinancialRecordsProvider = ({ children }: Props) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await getFinancialRecords(user.id);
      setRecords(data);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load financial records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user?.id]);

  const addRecord = async (record: Omit<FinancialRecord, "_id">) => {
    setError(null);
    try {
      const newRecord = await createFinancialRecord(record);
      setRecords((prev) => [...prev, newRecord]);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to add record.");
    }
  };

  const updateRecord = async (id: string, newRecord: Partial<FinancialRecord>) => {
    setError(null);
    try {
      const updated = await updateFinancialRecord(id, newRecord);
      setRecords((prev) =>
        prev.map((record) => (record._id === id ? updated : record))
      );
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to update record.");
    }
  };

  const deleteRecord = async (id: string) => {
    setError(null);
    try {
      const deleted = await deleteFinancialRecord(id);
      setRecords((prev) =>
        prev.filter((record) => record._id !== deleted._id)
      );
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete record.");
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, isLoading, error, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};