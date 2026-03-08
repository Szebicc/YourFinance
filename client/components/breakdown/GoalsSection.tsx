"use client";

import * as React from "react";
import { PlusIcon, TargetIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Category, ExpenseCategoryId, FinanceEntry, Goal } from "@/lib/breakdown/types";
import { findCategory, formatMoney, groupExpensesByCategory } from "@/lib/breakdown/utils";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now().toString(16)}`
}

function GoalCard({
  title,
  note,
  progressPct,
  leftLabel,
  rightLabel,
  accent,
}: {
  title: string;
  note?: string;
  progressPct: number;
  leftLabel: string;
  rightLabel: string;
  accent?: "good" | "warn";
}) {
  const clamped = Math.max(0, Math.min(100, progressPct));
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        {note ? (
          <CardDescription className="text-sm">{note}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress
          value={clamped}
          className={[
            accent === "warn" ? "[&_[data-slot=progress-indicator]]:bg-rose-600" : "",
          ].join(" ")}
        />
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>{leftLabel}</span>
          <span className="font-medium text-foreground">{rightLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function GoalsSection({
  categories,
  goals,
  onGoalsChange,
  entries,
  totalIncomeCents,
  totalExpensesCents,
}: {
  categories: Category[];
  goals: Goal[];
  onGoalsChange: (goals: Goal[]) => void;
  entries: FinanceEntry[];
  totalIncomeCents: number;
  totalExpensesCents: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [goalType, setGoalType] = React.useState<Goal["type"]>("monthly_savings");
  const [title, setTitle] = React.useState("");
  const [target, setTarget] = React.useState<string>("");
  const [categoryId, setCategoryId] = React.useState<ExpenseCategoryId>("food");

  const expensesByCategory = React.useMemo(
    () => groupExpensesByCategory(entries),
    [entries]
  );

  const savingsCents = totalIncomeCents - totalExpensesCents;

  function resetForm() {
    setGoalType("monthly_savings");
    setTitle("");
    setTarget("");
    setCategoryId("food");
  }

  function addGoal() {
    const amountCents = Math.max(0, Math.round((Number(target) || 0) * 100));
    if (!title.trim() || amountCents <= 0) return;

    const next: Goal =
      goalType === "monthly_savings"
        ? {
            id: uid("g"),
            type: "monthly_savings",
            title: title.trim(),
            targetCents: amountCents,
          }
        : {
            id: uid("g"),
            type: "category_limit",
            title: title.trim(),
            categoryId,
            limitCents: amountCents,
          };

    onGoalsChange([next, ...goals]);
    setOpen(false);
    resetForm();
  }

  function removeGoal(id: string) {
    onGoalsChange(goals.filter((g) => g.id !== id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="size-4" />
            Goals
          </CardTitle>
          <CardDescription>
            Set targets like monthly savings or category spending limits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <PlusIcon className="size-4" />
                Add goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a goal</DialogTitle>
                <DialogDescription>
                  This uses mock data for now. Later you can save goals to your backend.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goal type</label>
                  <Select
                    value={goalType}
                    onValueChange={(v) => setGoalType(v as Goal["type"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly_savings">Monthly savings</SelectItem>
                      <SelectItem value="category_limit">Category limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Save this month"
                  />
                </div>

                {goalType === "category_limit" ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={categoryId}
                      onValueChange={(v) => setCategoryId(v as ExpenseCategoryId)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {goalType === "monthly_savings" ? "Target savings ($)" : "Limit ($)"}
                  </label>
                  <Input
                    inputMode="decimal"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g. 800"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addGoal}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="text-xs text-muted-foreground">
            These goals are stored in local component state (mock). Refresh will reset them.
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {goals.map((g) => {
          if (g.type === "monthly_savings") {
            const pct = g.targetCents > 0 ? (savingsCents / g.targetCents) * 100 : 0;
            const accent = savingsCents < 0 ? "warn" : undefined;
            return (
              <div key={g.id} className="space-y-2">
                <GoalCard
                  title={g.title}
                  note={g.note}
                  progressPct={pct}
                  leftLabel={`Saved: ${formatMoney(savingsCents)}`}
                  rightLabel={`Target: ${formatMoney(g.targetCents)}`}
                  accent={accent}
                />
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => removeGoal(g.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          }

          const spent = expensesByCategory.get(g.categoryId) ?? 0;
          const pct = g.limitCents > 0 ? (spent / g.limitCents) * 100 : 0;
          const cat = findCategory(categories, g.categoryId);
          const over = spent > g.limitCents;

          return (
            <div key={g.id} className="space-y-2">
              <GoalCard
                title={g.title}
                note={`${cat.label} limit`}
                progressPct={pct}
                leftLabel={`Spent: ${formatMoney(spent)}`}
                rightLabel={`Limit: ${formatMoney(g.limitCents)}`}
                accent={over ? "warn" : "good"}
              />
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                  onClick={() => removeGoal(g.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          );
        })}

        {goals.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No goals yet. Add one to start tracking progress.
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

