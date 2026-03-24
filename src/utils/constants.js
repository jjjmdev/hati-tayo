export const bgColors = [
  '#7c3aed',
  '#10b981',
  '#ef4444',
  '#f59e0b',
  '#3b82f6',
  '#ec4899',
  '#14b8a6',
  '#84cc16',
  '#a855f7',
  '#6366f1',
  '#f97316',
  '#06b6d4',
  '#22c55e',
]

export const expenseCategories = [
  { id: 'food', label: 'Food', color: '#f59e0b', icon: '🍔' },
  { id: 'transport', label: 'Transport', color: '#3b82f6', icon: '🚗' },
  { id: 'accommodation', label: 'Accommodation', color: '#8b5cf6', icon: '🏨' },
  { id: 'entertainment', label: 'Entertainment', color: '#ec4899', icon: '🎬' },
  { id: 'shopping', label: 'Shopping', color: '#10b981', icon: '🛍️' },
  { id: 'other', label: 'Other', color: '#6b7280', icon: '📦' },
]

export function getCategoryById(id) {
  return expenseCategories.find((c) => c.id === id) || null
}
