import './TransactionTable.css'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount } from '../../utils/utils'
import { getCategoryById, expenseCategories } from '../../utils/constants'
import { useState } from 'react'

function TransactionTable({ people, expenses }) {
  const { getPersonColor } = usePeople(people)
  const [categoryFilter, setCategoryFilter] = useState('all')

  if (!expenses || expenses.length === 0 || !people || people.length === 0) {
    return null
  }

  const filteredExpenses =
    categoryFilter === 'all'
      ? expenses
      : expenses.filter((exp) => exp.category === categoryFilter)

  return (
    <section className='transaction-table'>
      <h4>Transaction Details</h4>
      <div className='transaction-table__filter'>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className='transaction-table__filter-select'
        >
          <option value='all'>All Categories</option>
          {expenseCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label}
            </option>
          ))}
        </select>
        {categoryFilter !== 'all' && (
          <span className='transaction-table__filter-count'>
            {filteredExpenses.length} of {expenses.length} expenses
          </span>
        )}
      </div>
      <div className='transaction-table__wrapper'>
        <table className='transaction-table__table' id='tx-table'>
          <thead>
            <tr>
              <th className='transaction-table__col--expense'>Expense</th>
              <th className='transaction-table__col--category'>Category</th>
              <th className='transaction-table__col--amount'>Amount</th>
              {people.map((person) => (
                <th key={person.id} className='transaction-table__col--person'>
                  <div className='transaction-table__person-header'>
                    <div
                      className='transaction-table__avatar'
                      style={{ backgroundColor: getPersonColor(person.id) }}
                    >
                      {person.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{person.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td className='transaction-table__cell--name'>
                  {expense.name}
                </td>
                <td className='transaction-table__cell--category'>
                  {expense.category ? (
                    <span
                      className='transaction-table__category-badge'
                      style={{
                        backgroundColor: getCategoryById(expense.category)
                          ?.color,
                      }}
                    >
                      {getCategoryById(expense.category)?.icon}{' '}
                      {getCategoryById(expense.category)?.label}
                    </span>
                  ) : (
                    <span className='transaction-table__no-category'>-</span>
                  )}
                </td>
                <td className='transaction-table__cell--amount'>
                  ₱{formatAmount(expense.amount)}
                </td>
                {people.map((person) => {
                  // Find what this person paid
                  const paidEntry = expense.paidBy.find(
                    (p) => p.personId === person.id,
                  )
                  const paid = paidEntry ? paidEntry.amount : 0

                  // Find what this person owes
                  const splitEntry = expense.splits.find(
                    (s) => s.personId === person.id,
                  )
                  const owes = splitEntry ? splitEntry.amount : 0

                  return (
                    <td
                      key={person.id}
                      className='transaction-table__cell--person'
                    >
                      <div className='transaction-table__amounts'>
                        {paid > 0 && (
                          <span className='transaction-table__amount--paid'>
                            +₱{formatAmount(paid)}
                          </span>
                        )}
                        {owes > 0 && (
                          <span className='transaction-table__amount--owed'>
                            -₱{formatAmount(owes)}
                          </span>
                        )}
                        {paid === 0 && owes === 0 && (
                          <span className='transaction-table__amount--zero'>
                            -
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
            {/* Total row */}
            <tr className='transaction-table__row--total'>
              <td className='transaction-table__cell--name'>
                <strong>Total</strong>
              </td>
              <td className='transaction-table__cell--category'></td>
              <td className='transaction-table__cell--amount transaction-table__cell--total'>
                <strong>
                  ₱
                  {formatAmount(
                    filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
                  )}
                </strong>
              </td>
              {people.map((person) => {
                // Calculate total for this person across all expenses
                let totalPaid = 0
                let totalOwes = 0

                filteredExpenses.forEach((expense) => {
                  const paidEntry = expense.paidBy.find(
                    (p) => p.personId === person.id,
                  )
                  const splitEntry = expense.splits.find(
                    (s) => s.personId === person.id,
                  )
                  if (paidEntry) totalPaid += paidEntry.amount
                  if (splitEntry) totalOwes += splitEntry.amount
                })

                const net = totalPaid - totalOwes

                return (
                  <td
                    key={person.id}
                    className='transaction-table__cell--person transaction-table__cell--total'
                  >
                    <span
                      className={`transaction-table__net ${net >= 0 ? 'transaction-table__net--positive' : 'transaction-table__net--negative'}`}
                    >
                      {net >= 0 ? '+' : '-'}₱{formatAmount(Math.abs(net))}
                    </span>
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default TransactionTable
