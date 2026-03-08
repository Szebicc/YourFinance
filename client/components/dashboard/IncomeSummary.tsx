"use client";

import * as React from "react";
import { CalendarIcon, CheckCircleIcon, CircleIcon, TrendingUpIcon } from "lucide-react";

import { useFinancialRecords } from "@/hooks/use-financial-records";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatMoney } from "@/lib/breakdown/utils";
import { isIncomeCategoryLabel } from "@/lib/breakdown/categories";
import type { FinancialRecord } from "@/types/financial-record";

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function normalizeDate(value: FinancialRecord["date"]) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isSalaryCategory(label: string | undefined | null) {
  return (label ?? "").trim().toLowerCase() === "salary";
}

export function IncomeSummary() {
  const { records } = useFinancialRecords();
  const { profile } = useUserProfile();

  const now = React.useMemo(() => new Date(), []);

  const { actualIncome, monthlyTarget, salaryRecordedThisMonth } = React.useMemo(() => {
    let monthIncome = 0;
    let hasSalaryRecord = false;

    for (const record of records) {
      const date = normalizeDate(record.date);
      if (!date || !isSameMonth(date, now)) continue;

      if (isIncomeCategoryLabel(record.category)) {
        monthIncome += Number(record.amount ?? 0);
      }
      if (isSalaryCategory(record.category)) {
        hasSalaryRecord = true;
      }
    }

    return {
      actualIncome: monthIncome,
      monthlyTarget: profile?.monthlyIncome ?? 0,
      salaryRecordedThisMonth: hasSalaryRecord,
    };
  }, [now, profile?.monthlyIncome, records]);

  const remaining = monthlyTarget - actualIncome;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base font-semibold">
            This month&apos;s income
          </CardTitle>
          <CardDescription className="flex items-center gap-1 text-xs">
            <CalendarIcon className="size-3" />
            {now.toLocaleString(undefined, {
              month: "long",
              year: "numeric",
            })}
          </CardDescription>
        </div>
        <div className="flex size-9 items-center justify-center rounded-lg border bg-muted/60">
          <TrendingUpIcon className="size-4 text-emerald-600" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
            <span className="text-sm text-muted-foreground">
              Salary recorded this month
            </span>
            {salaryRecordedThisMonth ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <CheckCircleIcon className="size-4" />
                Yes
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CircleIcon className="size-4" />
                Not yet
              </span>
            )}
        </div>

        <div>
          <div className="text-xs text-muted-foreground">Actual income</div>
          <div className="text-xl font-semibold">
            {formatMoney(Math.round(actualIncome * 100))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="text-muted-foreground">Expected salary</div>
            <div className="font-medium">
              {formatMoney(Math.round(monthlyTarget * 100))}
            </div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-muted-foreground">
              {remaining >= 0 ? "Remaining to target" : "Above target"}
            </div>
            <div className="font-medium">
              {formatMoney(Math.abs(Math.round(remaining * 100)))}
            </div>
          </div>
        </div>

        <p className="mt-1 text-xs text-muted-foreground">
          Income from records with Salary, Freelance, Bonus, Gifts, etc.
        </p>
      </CardContent>
    </Card>
  );
}

