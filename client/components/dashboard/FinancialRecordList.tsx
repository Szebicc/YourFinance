"use client";

import { useMemo, useState } from "react";
import { useFinancialRecords } from "@/hooks/use-financial-records";
import { FinancialRecord } from "@/types/financial-record";
import { CATEGORIES, PAYMENT_METHODS } from "@/constants/categories";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatDate = (value: FinancialRecord["date"]) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;

    const query = searchQuery.toLowerCase();
    return records.filter(
      (record) =>
        record.description?.toLowerCase().includes(query) ||
        record.category?.toLowerCase().includes(query) ||
        record.paymentMethod?.toLowerCase().includes(query)
    );
  }, [records, searchQuery]);

  const rows = useMemo<FinancialRecord[]>(
    () => filteredRecords ?? [],
    [filteredRecords]
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    description: "",
    category: "",
    paymentMethod: "",
    amount: "",
  });

  const totalAmount = useMemo(
    () => rows.reduce((sum, record) => sum + Number(record.amount ?? 0), 0),
    [rows]
  );

  const handleEditClick = (record: FinancialRecord) => {
    const dateObj =
      record.date instanceof Date
        ? record.date
        : record.date
        ? new Date(record.date)
        : null;

    setEditingId(record._id ?? null);
    setEditForm({
      date: dateObj ? dateObj.toISOString().slice(0, 10) : "",
      description: record.description ?? "",
      category: record.category ?? "",
      paymentMethod: record.paymentMethod ?? "",
      amount: String(record.amount ?? ""),
    });
  };

  const handleEditChange = (field: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  const handleEditSave = async () => {
    if (!editingId) return;
    const payload = {
      ...editForm,
      amount: Number(editForm.amount),
      date: editForm.date ? new Date(editForm.date) : null,
    };
    await updateRecord(editingId, payload);
    setEditingId(null);
  };

  const handleDelete = async (record: FinancialRecord) => {
    const confirmed = window.confirm(
      `Delete "${record.description || "this record"}"?`
    );
    if (!confirmed || !record._id) return;
    await deleteRecord(record._id);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold">Your records</CardTitle>
          <CardDescription>
            {rows.length} total records ·{" "}
            {currencyFormatter.format(totalAmount)} total
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            width={18}
            height={18}
          />
          <Input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No records yet. Add your first transaction to get started.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((record) => {
                  const isEditing = editingId === record._id;
                  return (
                    <TableRow
                      key={record._id ?? `${record.description}-${record.date}`}
                    >
                      <TableCell>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editForm.date}
                            onChange={(e) =>
                              handleEditChange("date", e.target.value)
                            }
                            className="w-full"
                          />
                        ) : (
                          formatDate(record.date)
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <div className="space-y-1">
                            <Input
                              value={editForm.description}
                              onChange={(e) =>
                                handleEditChange("description", e.target.value)
                              }
                              className="w-full"
                            />
                            <p className="text-xs text-muted-foreground">
                              Editing record
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="font-medium">
                              {record.description || "Untitled"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {record.date
                                ? (record.date instanceof Date
                                    ? record.date
                                    : new Date(record.date)
                                  ).toLocaleString()
                                : "Manual entry"}
                            </p>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            value={editForm.category}
                            onValueChange={(value) =>
                              handleEditChange("category", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="secondary">
                            {record.category || "Uncategorized"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            value={editForm.paymentMethod}
                            onValueChange={(value) =>
                              handleEditChange("paymentMethod", value)
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              {PAYMENT_METHODS.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {record.paymentMethod || "—"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editForm.amount}
                            onChange={(e) =>
                              handleEditChange("amount", e.target.value)
                            }
                            className="text-right w-full"
                          />
                        ) : (
                          <span className="font-semibold">
                            {currencyFormatter.format(
                              Number(record.amount ?? 0)
                            )}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {isEditing ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleEditCancel}
                            >
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleEditSave}>
                              Save
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEditClick(record)}
                              aria-label="Edit record"
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(record)}
                              aria-label="Delete record"
                            >
                              🗑️
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
