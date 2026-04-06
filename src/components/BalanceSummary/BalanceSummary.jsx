import './BalanceSummary.css'
import { calculateBalances } from '../../data'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount } from '../../utils/utils'
import { Wallet, CreditCard } from 'lucide-react'
import { useMemo } from 'react'

function BalanceSummary({ people, expenses }) {
  // Calculate balances
  const balances = useMemo(
    () => calculateBalances(people, expenses),
    [people, expenses],
  )

  // Helpers
  const { getPersonColor } = usePeople(people)

  return (
    <section className='balance-summary'>
      <h4>Balance Summary</h4>
      <div className='summary-grid'>
        {people.map((person) => {
          const balance = balances[person.id]
          return (
            <div
              key={person.id}
              className={`summary-card ${balance.net >= 0 ? 'gets-paid' : 'owes-money'}`}
            >
              <div className='summary-card-header'>
                <div
                  className='summary-avatar'
                  style={{ backgroundColor: getPersonColor(person.id) }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className='summary-name'>{person.name}</span>
                {balance.net !== 0 && (
                  <span
                    className={`net-indicator ${balance.net >= 0 ? 'positive' : 'negative'}`}
                  >
                    {balance.net >= 0 ? 'gets back' : 'owes'}
                  </span>
                )}
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
                  {balance.paid > 0 ? (
                    <span className='summary-stat-value paid'>
                      ₱{formatAmount(balance.paid)}
                    </span>
                  ) : (
                    <span className='summary-stat-value'>—</span>
                  )}
                </div>
                <div className='summary-stat'>
                  <span className='summary-stat-label'>
                    <CreditCard
                      size={12}
                      style={{ display: 'inline', marginRight: '4px' }}
                    />
                    Spent
                  </span>
                  {balance.spent > 0 ? (
                    <span className='summary-stat-value spent'>
                      ₱{formatAmount(balance.spent)}
                    </span>
                  ) : (
                    <span className='summary-stat-value'>—</span>
                  )}
                </div>
                <div className='summary-stat net-row'>
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
    </section>
  )
}

export default BalanceSummary
