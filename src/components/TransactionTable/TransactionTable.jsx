import './TransactionTable.css'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount } from '../../utils/utils'

function TransactionTable({ people, expenses }) {
  const { getPersonColor } = usePeople(people)

  if (!expenses || expenses.length === 0 || !people || people.length === 0) {
    return null
  }

  return (
    <section className='transaction-table-container'>
      <h4>Transaction Details</h4>
      <div className='table-wrapper'>
        <table className='transaction-table' id='tx-table'>
          <thead>
            <tr>
              <th className='expense-col'>Expense</th>
              <th className='amount-col'>Amount</th>
              {people.map((person) => (
                <th key={person.id} className='person-col'>
                  <div className='person-header'>
                    <div
                      className='person-avatar-small'
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
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className='expense-name-cell'>{expense.name}</td>
                <td className='amount-cell'>₱{formatAmount(expense.amount)}</td>
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
                    <td key={person.id} className='person-cell'>
                      <div className='person-amounts'>
                        {paid > 0 && (
                          <span className='paid-amount'>
                            +₱{formatAmount(paid)}
                          </span>
                        )}
                        {owes > 0 && (
                          <span className='owed-amount'>
                            -₱{formatAmount(owes)}
                          </span>
                        )}
                        {paid === 0 && owes === 0 && (
                          <span className='zero-amount'>-</span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
            {/* Total row */}
            <tr className='total-row'>
              <td className='expense-name-cell'>
                <strong>Total</strong>
              </td>
              <td className='amount-cell'>
                <strong>
                  ₱
                  {formatAmount(expenses.reduce((sum, e) => sum + e.amount, 0))}
                </strong>
              </td>
              {people.map((person) => {
                // Calculate total for this person across all expenses
                let totalPaid = 0
                let totalOwes = 0

                expenses.forEach((expense) => {
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
                  <td key={person.id} className='person-cell total-cell'>
                    <span
                      className={`total-net ${net >= 0 ? 'positive' : 'negative'}`}
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
