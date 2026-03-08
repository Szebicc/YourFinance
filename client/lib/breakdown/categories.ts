import type { Category, ExpenseCategoryId } from "./types"

export const BREAKDOWN_CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Food",
    color: {
      bg: "bg-emerald-500/15",
      stroke: "#10b981",
      text: "text-emerald-600",
    },
  },
  {
    id: "rent",
    label: "Rent",
    color: {
      bg: "bg-indigo-500/15",
      stroke: "#6366f1",
      text: "text-indigo-600",
    },
  },
  {
    id: "transport",
    label: "Transport",
    color: { bg: "bg-sky-500/15", stroke: "#0ea5e9", text: "text-sky-600" },
  },
  {
    id: "entertainment",
    label: "Entertainment",
    color: {
      bg: "bg-fuchsia-500/15",
      stroke: "#d946ef",
      text: "text-fuchsia-600",
    },
  },
  {
    id: "shopping",
    label: "Shopping",
    color: {
      bg: "bg-amber-500/15",
      stroke: "#f59e0b",
      text: "text-amber-600",
    },
  },
  {
    id: "health",
    label: "Health",
    color: { bg: "bg-rose-500/15", stroke: "#f43f5e", text: "text-rose-600" },
  },
  {
    id: "utilities",
    label: "Utilities",
    color: { bg: "bg-zinc-500/15", stroke: "#71717a", text: "text-zinc-600" },
  },
  {
    id: "other",
    label: "Other",
    color: { bg: "bg-teal-500/15", stroke: "#14b8a6", text: "text-teal-600" },
  },
]

// Heuristic until your backend stores "type" explicitly.
// Includes salary, freelance, bonus, gifts, and other common income sources.
const INCOME_CATEGORY_LABELS = new Set([
  "salary",
  "income",
  "freelance",
  "bonus",
  "gifts",
  "dividends",
  "interest",
  "refund",
  "rebate",
  "side income",
  "other income",
])

export function isIncomeCategoryLabel(label: string | undefined | null) {
  const v = (label ?? "").trim().toLowerCase()
  return INCOME_CATEGORY_LABELS.has(v)
}

export function mapCategoryLabelToId(label: string | undefined | null): ExpenseCategoryId {
  const v = (label ?? "").trim().toLowerCase()
  if (v === "food") return "food"
  if (v === "rent") return "rent"
  if (v === "transport") return "transport"
  if (v === "utilities") return "utilities"
  if (v === "entertainment") return "entertainment"
  if (v === "shopping") return "shopping"
  if (v === "health") return "health"
  if (v === "other") return "other"

  // Map a few common variants.
  if (v.includes("grocery") || v.includes("restaurant") || v.includes("coffee")) return "food"

  // Income categories (Salary, Freelance, Bonus, Gifts) map to "other" for expense views
  if (INCOME_CATEGORY_LABELS.has(v)) return "other"

  return "other"
}

