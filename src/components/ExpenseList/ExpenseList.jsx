import './ExpenseList.css'
import { usePeople } from '../../hooks/usePeople'
import EmptyTable from '../EmptyTable/EmptyTable'
import { ShoppingCart, Trash2, Pencil } from 'lucide-react'
import { formatAmount } from '../../utils/utils'

function ExpenseList({ expenses, people, onDelete, onEdit }) {
  const { getPersonName, getPersonColor, getPersonInitial } = usePeople(people)

  if (expenses.length === 0) {
    return (
      <EmptyTable>
        <ShoppingCart />
        No expenses yet.
      </EmptyTable>
    )
  }

  return (
    <div className='expense-list-container'>
      <h3>Expenses ({expenses.length})</h3>
      <div className='expense-list'>
        {expenses.map((expense) => (
          <div key={expense.id} className='expense-card'>
            {/* Header: Icon + Name + Delete */}
            <div className='expense-card-header'>
              <span className='expense-name'>{expense.name}</span>
              <button
                className='btn-sm btn-info'
                onClick={() => onEdit(expense)}
              >
                <Pencil size={16} />
              </button>
              <button
                className='btn-sm btn-danger'
                onClick={() => onDelete(expense.id)}
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
                {formatAmount(expense.amount / expense.splitAmong.length)} each)
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
    </div>
  )
}
export default ExpenseList
