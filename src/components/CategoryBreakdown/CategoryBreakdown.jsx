import './CategoryBreakdown.css'
import { getCategoryById } from '../../utils/constants'
import { formatAmount } from '../../utils/utils'

// Calculate spending by category
function calculateCategoryTotals(expenses) {
  const totals = {}
  let hasAnyCategory = false

  expenses.forEach((expense) => {
    if (expense.category) {
      hasAnyCategory = true
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      totals[expense.category] += expense.amount
    }
  })

  return { totals, hasAnyCategory }
}

function CategoryBreakdown({ expenses }) {
  const { totals: categoryTotals, hasAnyCategory } =
    calculateCategoryTotals(expenses)

  return (
    <>
      {hasAnyCategory && (
        <section className='category-breakdown'>
          <h4>Spending by Category</h4>
          <div className='category-breakdown__bars'>
            {Object.entries(categoryTotals)
              .sort(([, a], [, b]) => b - a) // Sort by amount descending
              .map(([categoryId, amount]) => {
                const category = getCategoryById(categoryId)
                const totalExpenses = Object.values(categoryTotals).reduce(
                  (a, b) => a + b,
                  0,
                )
                const percentage = ((amount / totalExpenses) * 100).toFixed(1)

                return (
                  <div key={categoryId} className='category-breakdown__row'>
                    <div className='category-breakdown__label'>
                      <span className='category-breakdown__icon'>
                        {category?.icon}
                      </span>
                      <span>{category?.label}</span>
                    </div>
                    <div className='category-breakdown__track'>
                      <div
                        className='category-breakdown__fill'
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: category?.color,
                        }}
                      ></div>
                    </div>
                    <div className='category-breakdown__amount'>
                      <span>₱{formatAmount(amount)}</span>
                      <span className='category-breakdown__percent'>
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </section>
      )}
    </>
  )
}

export default CategoryBreakdown
