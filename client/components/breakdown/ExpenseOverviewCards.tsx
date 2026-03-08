"use client";

import { TrendingDownIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/breakdown/utils";

function StatCard({
  title,
  value,
  icon,
  subtle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtle?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={[
            "flex size-9 items-center justify-center rounded-lg border",
            subtle ? "bg-muted/50" : "bg-background",
          ].join(" ")}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
      </CardContent>
    </Card>
  );
}

export function ExpenseOverviewCards({
  totalIncomeCents,
  totalExpensesCents,
  balanceCents,
}: {
  totalIncomeCents: number;
  totalExpensesCents: number;
  balanceCents: number;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
      <StatCard
        title="Total income"
        value={formatMoney(totalIncomeCents)}
        icon={<TrendingUpIcon className="size-4 text-emerald-600" />}
        subtle
      />
      <StatCard
        title="Total expenses"
        value={formatMoney(totalExpensesCents)}
        icon={<TrendingDownIcon className="size-4 text-rose-600" />}
        subtle
      />
      <StatCard
        title="Remaining balance"
        value={formatMoney(balanceCents)}
        icon={<WalletIcon className="size-4 text-indigo-600" />}
        subtle
      />
    </div>
  );
}

