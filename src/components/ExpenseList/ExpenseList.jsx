import { Trash2 } from 'lucide-react'
import { formatAmount } from '../../utils/utils'
import { bgColors } from '../../utils/constants'
import './ExpenseList.css'

function ExpenseList({ expenses, people, onDelete }) {
  const getPersonName = (id) => people.find((p) => p.id === id)?.name || ''
  const getPersonColor = (id) => {
    const index = people.findIndex((p) => p.id === id)
    return bgColors[index % bgColors.length]
  }

  if (expenses.length === 0) {
    return <EmptyTable>...</EmptyTable>
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
                className='btn-danger btn-danger-sm'
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
                      {getPersonName(payer.personId).charAt(0).toUpperCase()}
                    </span>
                    <span>{getPersonName(payer.personId)}</span>
                    <span className='tag-amount'>
                      ₱{formatAmount(payer.amount.toFixed(0))}
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
                      {getPersonName(personId).charAt(0).toUpperCase()}
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
