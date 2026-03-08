"use client";

import { FilterIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Category, Filters } from "@/lib/breakdown/types";

export function ExpenseFilters({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FilterIcon className="size-4" />
          Filters
        </CardTitle>
        <CardDescription>
          Narrow the breakdown by date range and category.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start date</label>
            <Input
              type="date"
              value={filters.startDate ?? ""}
              onChange={(e) => onChange({ ...filters, startDate: e.target.value || undefined })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">End date</label>
            <Input
              type="date"
              value={filters.endDate ?? ""}
              onChange={(e) => onChange({ ...filters, endDate: e.target.value || undefined })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            value={filters.categoryId ?? "all"}
            onValueChange={(value) =>
              onChange({
                ...filters,
                categoryId: value as Filters["categoryId"],
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            Tip: Click a category in the chart to pin it.
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange({ categoryId: "all" })}
          >
            <RotateCcwIcon className="size-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

