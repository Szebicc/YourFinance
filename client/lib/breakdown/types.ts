export type MoneyCents = number

export type EntryType = "income" | "expense"

export type ExpenseCategoryId =
  | "food"
  | "rent"
  | "transport"
  | "entertainment"
  | "shopping"
  | "health"
  | "utilities"
  | "other"

export interface Category {
  id: ExpenseCategoryId
  label: string
  // Tailwind color token used for legend dots + chart.
  color: {
    bg: string
    stroke: string
    text: string
  }
}

export interface FinanceEntry {
  id: string
  type: EntryType
  // ISO date (yyyy-mm-dd) to keep mock data backend-friendly.
  date: string
  description: string
  amountCents: MoneyCents
  categoryId?: ExpenseCategoryId // only for expenses
}

export type GoalType = "monthly_savings" | "category_limit"

export interface GoalBase {
  id: string
  type: GoalType
  title: string
  // Optional notes shown as secondary text.
  note?: string
}

export interface MonthlySavingsGoal extends GoalBase {
  type: "monthly_savings"
  targetCents: MoneyCents
}

export interface CategoryLimitGoal extends GoalBase {
  type: "category_limit"
  categoryId: ExpenseCategoryId
  limitCents: MoneyCents
}

export type Goal = MonthlySavingsGoal | CategoryLimitGoal

export interface Filters {
  startDate?: string // yyyy-mm-dd
  endDate?: string // yyyy-mm-dd
  categoryId?: ExpenseCategoryId | "all"
}

