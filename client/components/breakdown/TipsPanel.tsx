"use client";

import { LightbulbIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category, FinanceEntry } from "@/lib/breakdown/types";
import { buildTips } from "@/lib/breakdown/insights";

function severityVariant(sev: "info" | "warning" | "success") {
  switch (sev) {
    case "warning":
      return "destructive";
    case "success":
      return "secondary";
    default:
      return "outline";
  }
}

export function TipsPanel({
  categories,
  entries,
}: {
  categories: Category[];
  entries: FinanceEntry[];
}) {
  const tips = buildTips(entries, categories);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="size-4" />
          Tips & insights
        </CardTitle>
        <CardDescription>
          Personalized suggestions generated from your spending patterns (mock).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {tips.map((t) => (
          <div key={t.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-semibold">{t.title}</div>
              <Badge variant={severityVariant(t.severity)}>{t.severity}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{t.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

