import type { Category, FinanceEntry, Goal } from "./types"

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "Food",
    color: { bg: "bg-emerald-500/15", stroke: "#10b981", text: "text-emerald-600" },
  },
  {
    id: "rent",
    label: "Rent",
    color: { bg: "bg-indigo-500/15", stroke: "#6366f1", text: "text-indigo-600" },
  },
  {
    id: "transport",
    label: "Transport",
    color: { bg: "bg-sky-500/15", stroke: "#0ea5e9", text: "text-sky-600" },
  },
  {
    id: "entertainment",
    label: "Entertainment",
    color: { bg: "bg-fuchsia-500/15", stroke: "#d946ef", text: "text-fuchsia-600" },
  },
  {
    id: "shopping",
    label: "Shopping",
    color: { bg: "bg-amber-500/15", stroke: "#f59e0b", text: "text-amber-600" },
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

// Mock entries: replace with backend fetch later.
export const MOCK_ENTRIES: FinanceEntry[] = [
  { id: "i-1", type: "income", date: "2026-02-01", description: "Salary", amountCents: 320_000 },
  { id: "i-2", type: "income", date: "2026-02-04", description: "Freelance", amountCents: 85_000 },

  { id: "e-1", type: "expense", date: "2026-02-01", description: "Rent", amountCents: 140_000, categoryId: "rent" },
  { id: "e-2", type: "expense", date: "2026-02-02", description: "Groceries", amountCents: 22_450, categoryId: "food" },
  { id: "e-3", type: "expense", date: "2026-02-03", description: "Metro pass", amountCents: 9_900, categoryId: "transport" },
  { id: "e-4", type: "expense", date: "2026-02-03", description: "Coffee", amountCents: 1_250, categoryId: "food" },
  { id: "e-5", type: "expense", date: "2026-02-04", description: "Internet", amountCents: 6_990, categoryId: "utilities" },
  { id: "e-6", type: "expense", date: "2026-02-04", description: "Movie night", amountCents: 3_600, categoryId: "entertainment" },
  { id: "e-7", type: "expense", date: "2026-02-05", description: "Pharmacy", amountCents: 4_200, categoryId: "health" },
  { id: "e-8", type: "expense", date: "2026-02-05", description: "Clothes", amountCents: 18_900, categoryId: "shopping" },
  { id: "e-9", type: "expense", date: "2026-02-05", description: "Restaurant", amountCents: 12_500, categoryId: "food" },
  { id: "e-10", type: "expense", date: "2026-02-06", description: "Taxi", amountCents: 3_800, categoryId: "transport" },
  { id: "e-11", type: "expense", date: "2026-02-06", description: "Subscription", amountCents: 1_999, categoryId: "entertainment" },
]

export const MOCK_GOALS: Goal[] = [
  {
    id: "g-1",
    type: "monthly_savings",
    title: "Save this month",
    note: "Keep a buffer for unexpected costs.",
    targetCents: 80_000,
  },
  {
    id: "g-2",
    type: "category_limit",
    title: "Food limit",
    categoryId: "food",
    limitCents: 45_000,
  },
]

