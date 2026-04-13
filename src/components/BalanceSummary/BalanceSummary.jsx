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
      <div className='balance-summary__grid'>
        {people.map((person) => {
          const balance = balances[person.id]
          return (
            <div
              key={person.id}
              className={`balance-summary__card ${balance.net >= 0 ? 'balance-summary__card--positive' : 'balance-summary__card--negative'}`}
            >
              <div className='balance-summary__header'>
                <div
                  className='balance-summary__avatar'
                  style={{ backgroundColor: getPersonColor(person.id) }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <span className='balance-summary__name'>{person.name}</span>
                {balance.net !== 0 && (
                  <span
                    className={`balance-summary__indicator ${balance.net >= 0 ? 'balance-summary__indicator--positive' : 'balance-summary__indicator--negative'}`}
                  >
                    {balance.net >= 0 ? 'gets back' : 'owes'}
                  </span>
                )}
              </div>
              <div className='balance-summary__stats'>
                <div className='balance-summary__stat'>
                  <span className='balance-summary__label'>
                    <Wallet
                      size={12}
                      style={{ display: 'inline', marginRight: '4px' }}
                    />
                    Paid
                  </span>
                  {balance.paid > 0 ? (
                    <span className='balance-summary__value balance-summary__value--paid'>
                      ₱{formatAmount(balance.paid)}
                    </span>
                  ) : (
                    <span className='balance-summary__value'>—</span>
                  )}
                </div>
                <div className='balance-summary__stat'>
                  <span className='balance-summary__label'>
                    <CreditCard
                      size={12}
                      style={{ display: 'inline', marginRight: '4px' }}
                    />
                    Spent
                  </span>
                  {balance.spent > 0 ? (
                    <span className='balance-summary__value balance-summary__value--spent'>
                      ₱{formatAmount(balance.spent)}
                    </span>
                  ) : (
                    <span className='balance-summary__value'>—</span>
                  )}
                </div>
                <div className='balance-summary__stat balance-summary__stat--net'>
                  <span className='balance-summary__label'>Net</span>
                  <span
                    className={`balance-summary__value ${balance.net >= 0 ? 'balance-summary__value--positive' : 'balance-summary__value--negative'}`}
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
