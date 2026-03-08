"use client";

import * as React from "react";

import type { ExpenseCategoryId, MoneyCents } from "@/lib/breakdown/types";
import { percent } from "@/lib/breakdown/utils";

type Row = {
  id: ExpenseCategoryId;
  valueCents: MoneyCents;
  stroke: string;
};

export function ExpenseDonutChart({
  rows,
  activeId,
  selectedId,
  onHover,
  onSelect,
}: {
  rows: Row[];
  activeId: ExpenseCategoryId | null;
  selectedId: ExpenseCategoryId | null;
  onHover: (id: ExpenseCategoryId | null) => void;
  onSelect: (id: ExpenseCategoryId | null) => void;
}) {
  const [animated, setAnimated] = React.useState(false);

  React.useEffect(() => {
    const t = window.setTimeout(() => setAnimated(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  const total = rows.reduce((acc, r) => acc + r.valueCents, 0);
  const size = 156;
  const strokeWidth = 18;
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;

  // Build segments using a stacked circle-dash technique.
  let offset = 0;

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Expenses by category donut chart"
        className="select-none"
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="transparent"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />

          {rows.map((row) => {
            const pct = percent(row.valueCents, total);
            const len = (pct / 100) * c;
            const dashArray = `${animated ? len : 0} ${c - len}`;
            const dashOffset = -offset;
            offset += len;

            const isActive = activeId === row.id;
            const isDimmed = activeId ? activeId !== row.id : false;
            const isSelected = selectedId === row.id;

            return (
              <circle
                key={row.id}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="transparent"
                stroke={row.stroke}
                strokeWidth={isActive || isSelected ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                strokeLinecap="butt"
                className={[
                  "cursor-pointer transition-[opacity,stroke-width,stroke-dasharray] duration-500",
                  isDimmed ? "opacity-35" : "opacity-100",
                ].join(" ")}
                onMouseEnter={() => onHover(row.id)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onSelect(isSelected ? null : row.id)}
              />
            );
          })}
        </g>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - strokeWidth / 2 - 6}
          fill="hsl(var(--background))"
        />

        <text
          x="50%"
          y="48%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-foreground text-sm font-semibold"
        >
          {activeId ? "Selected" : "Total"}
        </text>
        <text
          x="50%"
          y="60%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          {rows.length} categories
        </text>
      </svg>
    </div>
  );
}

