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
    <div className='expense-list__container'>
      <div className='expense-list__header'>
        <h3>Expenses ({expenses.length})</h3>
        <div className='expense-list__filter'>
          {categoryFilter !== 'all' && (
            <span className='expense-list__filter-count'>
              Showing {filteredExpenses.length} of {expenses.length}
            </span>
          )}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className='expense-list__filter-select'
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
        <div className='expense-list__items'>
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className='expense-list__item'>
              {/* Header: Icon + Name + Delete */}
              <div className='expense-list__item-header'>
                <span className='expense-list__item-name'>
                  {expense.name}
                  {expense.category && (
                    <span
                      className='expense-list__category-badge'
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
                  className='btn--sm btn--info btn--shown-on-hover'
                  onClick={() => onEdit(expense)}
                >
                  <Pencil size={15} />
                </button>
                <button
                  className='btn--sm btn--danger btn--shown-on-hover'
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
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Amount */}
              <div className='expense-list__item-total'>
                <span className='expense-list__item-amount'>
                  ₱{formatAmount(expense.amount)}
                </span>
                <span className='expense-list__item-split'>
                  (₱
                  {formatAmount(
                    expense.amount / expense.splitAmong.length,
                  )}{' '}
                  each)
                </span>
              </div>

              {/* Paid By */}
              <div className='expense-list__row'>
                <span className='expense-list__label'>Paid by</span>
                <div className='expense-list__tags'>
                  {expense.paidBy.map((payer, idx) => (
                    <span key={idx} className='expense-list__tag'>
                      <span
                        className='expense-list__tag-avatar'
                        style={{
                          backgroundColor: getPersonColor(payer.personId),
                        }}
                      >
                        {getPersonInitial(payer.personId)}
                      </span>
                      <span>{getPersonName(payer.personId)}</span>
                      <span className='expense-list__tag-amount'>
                        ₱{formatAmount(payer.amount)}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Split Among */}
              <div className='expense-list__row'>
                <span className='expense-list__label'>Split among</span>
                <div className='expense-list__tags'>
                  {expense.splitAmong.map((personId) => (
                    <span key={personId} className='expense-list__tag'>
                      <span
                        className='expense-list__tag-avatar'
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
