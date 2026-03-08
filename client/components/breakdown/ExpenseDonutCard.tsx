"use client";

import * as React from "react";
import { PieChartIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category, ExpenseCategoryId, MoneyCents } from "@/lib/breakdown/types";
import { findCategory, formatMoney, percent } from "@/lib/breakdown/utils";

import { ExpenseDonutChart } from "./ExpenseDonutChart";

type TotalsMap = Map<ExpenseCategoryId, MoneyCents>;

export function ExpenseDonutCard({
  categories,
  expensesByCategory,
  activeCategoryId,
  onHoverCategory,
  selectedCategoryId,
  onSelectCategory,
}: {
  categories: Category[];
  expensesByCategory: TotalsMap;
  activeCategoryId: ExpenseCategoryId | null;
  selectedCategoryId: ExpenseCategoryId | null;
  onHoverCategory: (id: ExpenseCategoryId | null) => void;
  onSelectCategory: (id: ExpenseCategoryId | null) => void;
}) {
  const rows = React.useMemo(() => {
    const all = Array.from(expensesByCategory.entries())
      .map(([id, total]) => ({
        id,
        total,
        category: findCategory(categories, id),
      }))
      .filter((x) => x.total > 0)
      .sort((a, b) => b.total - a.total);

    return all;
  }, [categories, expensesByCategory]);

  const total = rows.reduce((acc, r) => acc + r.total, 0);

  const active = activeCategoryId
    ? rows.find((r) => r.id === activeCategoryId) ?? null
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="size-4" />
          Expenses by category
        </CardTitle>
        <CardDescription>
          Hover to highlight. Click to pin a category.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center">
        <ExpenseDonutChart
          rows={rows.map((r) => ({ id: r.id, valueCents: r.total, stroke: r.category.color.stroke }))}
          activeId={activeCategoryId}
          selectedId={selectedCategoryId}
          onHover={onHoverCategory}
          onSelect={onSelectCategory}
        />

        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">Highlighted</div>
            <div className="mt-1 flex items-baseline justify-between gap-4">
              <div className="text-base font-semibold">
                {active?.category.label ?? "All categories"}
              </div>
              <div className="text-sm text-muted-foreground">
                {active ? `${percent(active.total, total).toFixed(0)}%` : "—"}
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">
              {active ? formatMoney(active.total) : formatMoney(total)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {selectedCategoryId
                ? "Pinned: click the same slice again to unpin."
                : "Tip: pin a category to keep it highlighted."}
            </div>
          </div>

          <div className="space-y-2">
            {rows.map((r) => {
              const isActive = r.id === activeCategoryId;
              const isSelected = r.id === selectedCategoryId;
              return (
                <button
                  key={r.id}
                  type="button"
                  className={[
                    "flex w-full items-center justify-between gap-4 rounded-lg border px-3 py-2 text-left transition-colors",
                    isActive ? "bg-accent" : "bg-background hover:bg-muted/50",
                  ].join(" ")}
                  onMouseEnter={() => onHoverCategory(r.id)}
                  onMouseLeave={() => onHoverCategory(null)}
                  onClick={() =>
                    onSelectCategory(isSelected ? null : (r.id as ExpenseCategoryId))
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: r.category.color.stroke }}
                    />
                    <div>
                      <div className="text-sm font-medium">
                        {r.category.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {percent(r.total, total).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">{formatMoney(r.total)}</div>
                </button>
              );
            })}

            {rows.length === 0 ? (
              <div className="rounded-lg border p-4 text-sm text-muted-foreground">
                No expenses in the selected range.
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

