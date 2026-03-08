import type { Category, ExpenseCategoryId, Filters, FinanceEntry, MoneyCents } from "./types"

export function formatMoney(cents: MoneyCents, currency = "USD") {
  const dollars = cents / 100
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(dollars)
}

export function parseIsoDate(date: string) {
  // Parse yyyy-mm-dd in local time to avoid timezone off-by-one surprises.
  const [y, m, d] = date.split("-").map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function isWithinDateRange(entryDate: string, filters: Filters) {
  const entry = parseIsoDate(entryDate).getTime()
  const start = filters.startDate ? parseIsoDate(filters.startDate).getTime() : undefined
  const end = filters.endDate ? parseIsoDate(filters.endDate).getTime() : undefined

  if (typeof start === "number" && entry < start) return false
  if (typeof end === "number" && entry > end) return false
  return true
}

export function applyFilters(entries: FinanceEntry[], filters: Filters) {
  return entries.filter((e) => {
    if (!isWithinDateRange(e.date, filters)) return false
    if (filters.categoryId && filters.categoryId !== "all") {
      // Only expenses have categories.
      if (e.type !== "expense") return true
      return e.categoryId === filters.categoryId
    }
    return true
  })
}

export function sumByType(entries: FinanceEntry[], type: "income" | "expense") {
  return entries
    .filter((e) => e.type === type)
    .reduce((acc, e) => acc + e.amountCents, 0)
}

export function groupExpensesByCategory(entries: FinanceEntry[]) {
  const totals = new Map<ExpenseCategoryId, MoneyCents>()
  for (const e of entries) {
    if (e.type !== "expense") continue
    const id = e.categoryId ?? "other"
    totals.set(id, (totals.get(id) ?? 0) + e.amountCents)
  }
  return totals
}

export function findCategory(categories: Category[], id: ExpenseCategoryId) {
  const cat = categories.find((c) => c.id === id)
  if (!cat) {
    return {
      id,
      label: id,
      color: { bg: "bg-muted", stroke: "#a1a1aa", text: "text-muted-foreground" },
    } satisfies Category
  }
  return cat
}

export function percent(part: number, whole: number) {
  if (whole <= 0) return 0
  return (part / whole) * 100
}

