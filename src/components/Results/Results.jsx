import './Results.css'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount, calcSettlements } from '../../utils/utils'
import { Check, ArrowRightLeft, Receipt } from 'lucide-react'
import BalanceSummary from '../BalanceSummary/BalanceSummary'
import TransactionTable from '../TransactionTable/TransactionTable'

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function Result({ people, expenses }) {
  // Calculate settlements
  const settlements = calcSettlements(people, expenses)

  // Helpers
  const { getPersonName, getPersonColor } = usePeople(people)

  // No expenses yet
  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className='results-container'
      >
        <div className='no-expenses'>
          <div className='no-expenses-icon'>
            <Receipt />
          </div>
          <div className='no-expenses-text'>No expenses yet</div>
          <div className='no-expenses-subtext'>
            Add some expenses to see the summary
          </div>
        </div>
      </motion.div>
    )
  }

  // All settled up
  if (settlements.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className='results-container'
      >
        <BalanceSummary people={people} expenses={expenses} />

        {/* Transaction Table */}
        <TransactionTable people={people} expenses={expenses} />

        <div className='all-settled'>
          <div className='all-settled-icon'>
            <Check />
          </div>
          <div className='all-settled-text'>All settled up!</div>
          <div className='all-settled-subtext'>
            Everyone is even. No payments needed.
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className='results-container'
    >
      <BalanceSummary people={people} expenses={expenses} />

      {/* Transaction Table */}
      <TransactionTable people={people} expenses={expenses} />

      {/* Settlements List */}
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
                style={{ backgroundColor: getPersonColor(settlement.from) }}
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
                style={{ backgroundColor: getPersonColor(settlement.to) }}
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
    </motion.div>
  )
}

export default Result
