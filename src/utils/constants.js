export const bgColors = [
  '#3f6212',
  '#a21caf',
  '#7f1d1d',
  '#14532d',
  '#312e81',
  '#92400e',
  '#be185d',
  '#365314',
  '#6b21a8',
  '#c2410c',
  '#1e3a8a',
  '#9f1239',
  '#4d7c0f',
  '#a16207',
  '#7e22ce',
  '#831843',
]

export const expenseCategories = [
  { id: 'food', label: 'Food', color: '#c2410c', icon: '🍔' },
  { id: 'transport', label: 'Transport', color: '#1e3a8a', icon: '🚗' },
  { id: 'accommodation', label: 'Accommodation', color: '#6b21a8', icon: '🏨' },
  { id: 'entertainment', label: 'Entertainment', color: '#3f6212', icon: '🎬' },
  { id: 'shopping', label: 'Shopping', color: '#831843', icon: '🛍️' },
  { id: 'other', label: 'Other', color: '#14532d', icon: '📦' },
]

export function getCategoryById(id) {
  return expenseCategories.find((c) => c.id === id) || null
}
