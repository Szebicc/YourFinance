import type { Category, FinanceEntry, MoneyCents } from "./types"
import { groupExpensesByCategory, percent, sumByType, findCategory, formatMoney } from "./utils"

export interface Tip {
  id: string
  title: string
  description: string
  severity: "info" | "warning" | "success"
}

function topCategory(entries: FinanceEntry[], categories: Category[]) {
  const totals = groupExpensesByCategory(entries)
  let best: { id: string; total: MoneyCents } | null = null
  for (const [id, total] of totals) {
    if (!best || total > best.total) best = { id, total }
  }
  if (!best) return null
  const cat = findCategory(categories, best.id as any)
  return { category: cat, total: best.total }
}

export function buildTips(entries: FinanceEntry[], categories: Category[]): Tip[] {
  const tips: Tip[] = []
  const income = sumByType(entries, "income")
  const expenses = sumByType(entries, "expense")
  const balance = income - expenses

  if (income > 0 && expenses > 0) {
    const rate = percent(expenses, income)
    if (rate >= 90) {
      tips.push({
        id: "burn-rate",
        title: "High spending rate",
        description: `You’re spending about ${rate.toFixed(
          0
        )}% of your income. Consider lowering discretionary categories this week.`,
        severity: "warning",
      })
    } else if (rate <= 60) {
      tips.push({
        id: "healthy-rate",
        title: "Healthy spending rate",
        description: `Nice work — expenses are around ${rate.toFixed(
          0
        )}% of income. You have room to increase savings.`,
        severity: "success",
      })
    }
  }

  const top = topCategory(entries, categories)
  if (top && expenses > 0) {
    const share = percent(top.total, expenses)
    if (share >= 30) {
      tips.push({
        id: "top-category",
        title: `${top.category.label} is your biggest category`,
        description: `You’re spending ${share.toFixed(0)}% on ${
          top.category.label
        } (${formatMoney(top.total)}). Consider setting a weekly limit.`,
        severity: "info",
      })
    }
  }

  if (balance < 0) {
    tips.push({
      id: "negative-balance",
      title: "You’re over budget",
      description:
        "Your expenses are higher than your income for this range. Try tightening fixed costs or pausing non-essential subscriptions.",
      severity: "warning",
    })
  }

  if (tips.length === 0) {
    tips.push({
      id: "starter",
      title: "Keep tracking consistently",
      description:
        "Add a few more days of data to unlock more personalized insights and category-level patterns.",
      severity: "info",
    })
  }

  return tips
}

