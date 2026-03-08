"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PiggyBankIcon,
  WalletIcon,
  TrendingDownIcon,
} from "lucide-react";

import { ModeToggle } from "@/components/themes/ModeToggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFinancialRecords } from "@/hooks/use-financial-records";
import { BREAKDOWN_CATEGORIES, isIncomeCategoryLabel, mapCategoryLabelToId } from "@/lib/breakdown/categories";
import type { ExpenseCategoryId, Filters, FinanceEntry, Goal } from "@/lib/breakdown/types";
import {
  applyFilters,
  groupExpensesByCategory,
  sumByType,
} from "@/lib/breakdown/utils";
import type { FinancialRecord } from "@/types/financial-record";

import { ExpenseFilters } from "./ExpenseFilters";
import { ExpenseOverviewCards } from "./ExpenseOverviewCards";
import { ExpenseDonutCard } from "./ExpenseDonutCard";
import { ExpenseBreakdown } from "./ExpenseBreakdown";
import { GoalsSection } from "./GoalsSection";
import { TipsPanel } from "./TipsPanel";

function isoDateOnly(value: FinancialRecord["date"]) {
  if (!value) return "1970-01-01";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "1970-01-01";
  // yyyy-mm-dd
  return d.toISOString().slice(0, 10);
}

function toCents(amount: number) {
  // Keeps behavior stable for decimals and avoids float drift.
  return Math.round((Number(amount) || 0) * 100);
}

function normalizeRecords(records: FinancialRecord[]): FinanceEntry[] {
  return records.map((r, idx) => {
    const isIncome = isIncomeCategoryLabel(r.category);
    const amountCents = Math.abs(toCents(r.amount));
    const categoryId = isIncome ? undefined : mapCategoryLabelToId(r.category);

    return {
      id: r._id ?? `record-${idx}`,
      type: isIncome ? "income" : "expense",
      date: isoDateOnly(r.date),
      description: r.description ?? "",
      amountCents,
      categoryId,
    };
  });
}

export function BreakdownPage() {
  const { records, isLoading, error } = useFinancialRecords();

  const [filters, setFilters] = React.useState<Filters>({
    categoryId: "all",
  });

  // Goals are still local for now (no backend table yet),
  // but progress is computed from the user's real records.
  const [goals, setGoals] = React.useState<Goal[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<ExpenseCategoryId | null>(null);
  const [hoveredCategoryId, setHoveredCategoryId] =
    React.useState<ExpenseCategoryId | null>(null);

  const allEntries = React.useMemo(() => normalizeRecords(records), [records]);

  const filteredEntries = React.useMemo(
    () => applyFilters(allEntries, filters),
    [allEntries, filters]
  );

  const totalIncome = React.useMemo(
    () => sumByType(filteredEntries, "income"),
    [filteredEntries]
  );
  const totalExpenses = React.useMemo(
    () => sumByType(filteredEntries, "expense"),
    [filteredEntries]
  );
  const balance = totalIncome - totalExpenses;

  const expensesByCategory = React.useMemo(
    () => groupExpensesByCategory(filteredEntries),
    [filteredEntries]
  );

  const activeCategoryId = hoveredCategoryId ?? selectedCategoryId;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-8 lg:py-12">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" size="icon-sm">
                  <Link href="/" aria-label="Back to dashboard">
                    <ArrowLeftIcon className="size-4" />
                  </Link>
                </Button>
                <div>
                  <CardTitle className="text-2xl font-semibold tracking-tight">
                    Breakdown
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Track expenses by category, set goals, and get actionable
                    insights.
                  </CardDescription>
                </div>
              </div>
              <div className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex">
                <span className="inline-flex items-center gap-2">
                  <WalletIcon className="size-4" />
                  Income
                </span>
                <span className="inline-flex items-center gap-2">
                  <TrendingDownIcon className="size-4" />
                  Expenses
                </span>
                <span className="inline-flex items-center gap-2">
                  <PiggyBankIcon className="size-4" />
                  Goals
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="overview" className="flex-1 sm:flex-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="breakdown" className="flex-1 sm:flex-none">
                Breakdown
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex-1 sm:flex-none">
                Goals
              </TabsTrigger>
              <TabsTrigger value="tips" className="flex-1 sm:flex-none">
                Tips & Insights
              </TabsTrigger>
            </TabsList>
          </div>

          {error ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-base">Couldn’t load your records</CardTitle>
                <CardDescription>{error}</CardDescription>
              </CardHeader>
            </Card>
          ) : null}

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <ExpenseOverviewCards
                totalIncomeCents={totalIncome}
                totalExpensesCents={totalExpenses}
                balanceCents={balance}
              />
              <ExpenseDonutCard
                categories={BREAKDOWN_CATEGORIES}
                expensesByCategory={expensesByCategory}
                activeCategoryId={activeCategoryId}
                onHoverCategory={setHoveredCategoryId}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-lg border p-4 text-sm text-muted-foreground">
                Loading your financial records…
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="breakdown">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
              <ExpenseFilters
                categories={BREAKDOWN_CATEGORIES}
                filters={filters}
                onChange={setFilters}
              />
              <ExpenseBreakdown
                categories={BREAKDOWN_CATEGORIES}
                entries={filteredEntries}
                activeCategoryId={activeCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </div>
          </TabsContent>

          <TabsContent value="goals">
            <GoalsSection
              categories={BREAKDOWN_CATEGORIES}
              goals={goals}
              onGoalsChange={setGoals}
              entries={filteredEntries}
              totalIncomeCents={totalIncome}
              totalExpensesCents={totalExpenses}
            />
          </TabsContent>

          <TabsContent value="tips">
            <TipsPanel categories={BREAKDOWN_CATEGORIES} entries={filteredEntries} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

