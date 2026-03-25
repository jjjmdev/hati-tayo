import './ExpenseList.css'
import { usePeople } from '../../hooks/usePeople'
import EmptyTable from '../EmptyTable/EmptyTable'
import { formatAmount } from '../../utils/utils'
import { getCategoryById, expenseCategories } from '../../utils/constants'
import { ShoppingCart, Trash2, Pencil } from 'lucide-react'
import { useState } from 'react'

function ExpenseList({ expenses, people, onDelete, onEdit, setConfirmDialog }) {
  const { getPersonName, getPersonColor, getPersonInitial } = usePeople(people)
  const [categoryFilter, setCategoryFilter] = useState('all')

  if (expenses.length === 0) {
    return (
      <EmptyTable>
        <ShoppingCart />
        No expenses yet.
      </EmptyTable>
    )
  }

  const filteredExpenses =
    categoryFilter === 'all'
      ? expenses
      : expenses.filter((exp) => exp.category === categoryFilter)

  return (
    <div className='expense-list-container'>
      <div className='expense-list-header'>
        <h3>Expenses ({expenses.length})</h3>
        <div className='expense-filter'>
          {categoryFilter !== 'all' && (
            <span className='filter-count'>
              Showing {filteredExpenses.length} of {expenses.length}
            </span>
          )}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='category-filter-select'
          >
            <option value='all'>All Categories</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className='expense-list'>
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className='expense-card'>
              {/* Header: Icon + Name + Delete */}
              <div className='expense-card-header'>
                <span className='expense-name'>
                  {expense.name}
                  {expense.category && (
                    <span
                      className='category-badge'
                      style={{
                        backgroundColor: getCategoryById(expense.category)
                          ?.color,
                      }}
                    >
                      {getCategoryById(expense.category)?.icon}{' '}
                      {getCategoryById(expense.category)?.label}
                    </span>
                  )}
                </span>
                <button
                  className='btn-sm btn-info'
                  onClick={() => onEdit(expense)}
                >
                  <Pencil size={16} />
                </button>
                <button
                  className='btn-sm btn-danger'
                  onClick={() => {
                    setConfirmDialog({
                      title: `Delete "${expense.name}"?`,
                      message: 'This expense will be permanently deleted.',
                      details: [`Amount: ₱${expense.amount}`],
                      onConfirm: () => onDelete(expense.id),
                      variant: 'danger',
                    })
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Amount */}
              <div className='expense-total'>
                <span className='expense-amount'>
                  ₱{formatAmount(expense.amount)}
                </span>
                <span className='expense-split-amount'>
                  (₱
                  {formatAmount(
                    expense.amount / expense.splitAmong.length,
                  )}{' '}
                  each)
                </span>
              </div>

              {/* Paid By */}
              <div className='expense-row'>
                <span className='expense-label'>Paid by</span>
                <div className='expense-tags'>
                  {expense.paidBy.map((payer, idx) => (
                    <span key={idx} className='expense-tag'>
                      <span
                        className='tag-avatar'
                        style={{
                          backgroundColor: getPersonColor(payer.personId),
                        }}
                      >
                        {getPersonInitial(payer.personId)}
                      </span>
                      <span>{getPersonName(payer.personId)}</span>
                      <span className='tag-amount'>
                        ₱{formatAmount(payer.amount)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Split Among */}
              <div className='expense-row'>
                <span className='expense-label'>Split among</span>
                <div className='expense-tags'>
                  {expense.splitAmong.map((personId) => (
                    <span key={personId} className='expense-tag'>
                      <span
                        className='tag-avatar'
                        style={{ backgroundColor: getPersonColor(personId) }}
                      >
                        {getPersonInitial(personId)}
                      </span>
                      <span>{getPersonName(personId)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyTable>
          <ShoppingCart />
          No expenses in this category.
        </EmptyTable>
      )}
    </div>
  )
}
export default ExpenseList
