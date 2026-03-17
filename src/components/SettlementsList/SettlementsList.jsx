import './SettlementsList.css'
import { formatAmount } from '../../utils/utils'
import { usePeople } from '../../hooks/usePeople'
import { ArrowRightLeft, Check } from 'lucide-react'

function SettlementsList({ settlements, people }) {
  const { getPersonName, getPersonColor } = usePeople(people)

  if (settlements.length === 0) {
    // All settled up (i.e. Calculates to equal)
    return (
      <section className='all-settled'>
        <div className='all-settled-icon'>
          <Check />
        </div>
        <div className='all-settled-text'>All settled up!</div>
        <div className='all-settled-subtext'>
          Everyone is even. No payments needed.
        </div>
      </section>
    )
  }

  return (
    <section className='results-summary'>
      <div className='results-summary'>
        <h4 className='section-title-center'>Settlements</h4>
      </div>
      <div className='settlements-list'>
        {settlements.map((settlement, index) => (
          <div key={index} className='settlement-card'>
            {/* From Person */}
            <div className='settlement-person'>
              <div
                className='settlement-avatar'
                style={{
                  backgroundColor: getPersonColor(settlement.from),
                }}
              >
                {getPersonName(settlement.from).charAt(0).toUpperCase()}
              </div>
              <span className='settlement-name'>
                {getPersonName(settlement.from)}
              </span>
            </div>

            {/* Action */}
            <div className='settlement-action'>
              <ArrowRightLeft size={16} className='settlement-arrow' />
              pays
            </div>

            {/* To Person */}
            <div className='settlement-person'>
              <div
                className='settlement-avatar'
                style={{
                  backgroundColor: getPersonColor(settlement.to),
                }}
              >
                {getPersonName(settlement.to).charAt(0).toUpperCase()}
              </div>
              <span className='settlement-name'>
                {getPersonName(settlement.to)}
              </span>
            </div>

            {/* Amount */}
            <div className='settlement-amount'>
              ₱{formatAmount(settlement.amount)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SettlementsList
