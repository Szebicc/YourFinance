import { FinancialRecord } from "@/types/financial-record";

export async function getFinancialRecords(userId: string): Promise<FinancialRecord[]> {
  const res = await fetch(
    `/api/financial-records?userId=${encodeURIComponent(userId)}`
  );

  if (!res.ok) {
    throw new Error(`Failed to load records (${res.status})`);
  }

  return res.json();
}

export async function createFinancialRecord(
  record: Omit<FinancialRecord, "_id">
): Promise<FinancialRecord> {
  const res = await fetch("/api/financial-records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    throw new Error(`Failed to add record (${res.status})`);
  }

  return res.json();
}

export async function updateFinancialRecord(
  id: string,
  record: Partial<FinancialRecord>
): Promise<FinancialRecord> {
  const res = await fetch(`/api/financial-records/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  });

  if (!res.ok) {
    throw new Error(`Failed to update record (${res.status})`);
  }

  return res.json();
}

export async function deleteFinancialRecord(id: string): Promise<FinancialRecord> {
  const res = await fetch(`/api/financial-records/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Failed to delete record (${res.status})`);
  }

  return res.json();
}
