import './BalanceSummary.css'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount } from '../../utils/utils'
import { Wallet, CreditCard } from 'lucide-react'

// Calculate balances for each person
function calculateBalances(people, expenses) {
  const balances = {}

  // Initialize
  people.forEach((person) => {
    balances[person.id] = {
      paid: 0,
      spent: 0,
      net: 0,
    }
  })

  // Calculate
  expenses.forEach((expense) => {
    // What each person paid
    expense.paidBy.forEach((payer) => {
      if (balances[payer.personId]) {
        balances[payer.personId].paid += payer.amount
      }
    })

    // What each person owes
    expense.splits.forEach((split) => {
      if (balances[split.personId]) {
        balances[split.personId].spent += split.amount
      }
    })
  })

  // Calculate net (positive = owed money, negative = owes money)
  Object.keys(balances).forEach((personId) => {
    balances[personId].net = balances[personId].paid - balances[personId].spent
  })

  return balances
}

function BalanceSummary({ people, expenses }) {
  // Calculate balances
  const balances = calculateBalances(people, expenses)

  // Helpers
  const { getPersonColor } = usePeople(people)

  return (
    <div className='balance-summary'>
      <h4>Balance Summary</h4>
      <div className='summary-grid'>
        {people.map((person) => {
          const balance = balances[person.id]
          return (
            <div key={person.id} className='summary-card'>
              <div className='summary-card-header'>
                <div
                  className='summary-avatar'
                  style={{ backgroundColor: getPersonColor(person.id) }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className='summary-name'>{person.name}</span>
              </div>
              <div className='summary-stats'>
                <div className='summary-stat'>
                  <span className='summary-stat-label'>
                    <Wallet
                      size={12}
                      style={{ display: 'inline', marginRight: '4px' }}
                    />
                    Paid
                  </span>
                  <span className='summary-stat-value paid'>
                    ₱{formatAmount(balance.paid)}
                  </span>
                </div>
                <div className='summary-stat'>
                  <span className='summary-stat-label'>
                    <CreditCard
                      size={12}
                      style={{ display: 'inline', marginRight: '4px' }}
                    />
                    Spent
                  </span>
                  <span className='summary-stat-value spent'>
                    ₱{formatAmount(balance.spent)}
                  </span>
                </div>
                <div className='summary-stat'>
                  <span className='summary-stat-label'>Net</span>
                  <span
                    className={`summary-stat-value ${balance.net >= 0 ? 'positive' : 'negative'}`}
                  >
                    {balance.net >= 0 ? '+' : '-'}₱
                    {formatAmount(Math.abs(balance.net))}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BalanceSummary
