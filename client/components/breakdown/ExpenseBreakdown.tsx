"use client";

import * as React from "react";
import { ListIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Category, ExpenseCategoryId, FinanceEntry } from "@/lib/breakdown/types";
import {
  findCategory,
  formatMoney,
  groupExpensesByCategory,
  percent,
} from "@/lib/breakdown/utils";

export function ExpenseBreakdown({
  categories,
  entries,
  activeCategoryId,
  onSelectCategory,
}: {
  categories: Category[];
  entries: FinanceEntry[];
  activeCategoryId: ExpenseCategoryId | null;
  onSelectCategory: (id: ExpenseCategoryId | null) => void;
}) {
  const expenseEntries = React.useMemo(
    () => entries.filter((e) => e.type === "expense"),
    [entries]
  );

  const totalsByCategory = React.useMemo(
    () => groupExpensesByCategory(entries),
    [entries]
  );

  const totalExpenses = React.useMemo(
    () => expenseEntries.reduce((acc, e) => acc + e.amountCents, 0),
    [expenseEntries]
  );

  const rows = React.useMemo(() => {
    const rows = Array.from(totalsByCategory.entries())
      .map(([categoryId, totalCents]) => {
        const category = findCategory(categories, categoryId);
        const count = expenseEntries.filter(
          (e) => (e.categoryId ?? "other") === categoryId
        ).length;

        return {
          categoryId,
          category,
          count,
          totalCents,
        };
      })
      .filter((r) => r.totalCents > 0)
      .sort((a, b) => b.totalCents - a.totalCents);

    return rows;
  }, [categories, expenseEntries, totalsByCategory]);

  const details = React.useMemo(() => {
    if (!activeCategoryId) return [];
    return expenseEntries
      .filter((e) => (e.categoryId ?? "other") === activeCategoryId)
      .slice()
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [activeCategoryId, expenseEntries]);

  const activeCategory = activeCategoryId
    ? findCategory(categories, activeCategoryId)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListIcon className="size-4" />
          Expense breakdown
        </CardTitle>
        <CardDescription>
          Expenses grouped by category. Click a row to drill down.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Share</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const isActive = r.categoryId === activeCategoryId;
                return (
                  <TableRow
                    key={r.categoryId}
                    className={isActive ? "bg-accent" : "cursor-pointer"}
                    onClick={() => onSelectCategory(isActive ? null : r.categoryId)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ background: r.category.color.stroke }}
                        />
                        <div className="font-medium">{r.category.label}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {r.count}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {percent(r.totalCents, totalExpenses).toFixed(0)}%
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatMoney(r.totalCents)}
                    </TableCell>
                  </TableRow>
                );
              })}

              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No expenses found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Details</div>
              <div className="mt-1 text-base font-semibold">
                {activeCategory ? activeCategory.label : "Select a category"}
              </div>
            </div>
            {activeCategoryId ? (
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => onSelectCategory(null)}
              >
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="text-muted-foreground">
                      {e.date}
                    </TableCell>
                    <TableCell className="font-medium">{e.description}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatMoney(e.amountCents)}
                    </TableCell>
                  </TableRow>
                ))}
                {activeCategoryId && details.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      No entries for this category in the current range.
                    </TableCell>
                  </TableRow>
                ) : null}
                {!activeCategoryId ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-muted-foreground">
                      Pick a category above to see individual expenses.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

