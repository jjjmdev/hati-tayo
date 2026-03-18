import './Results.css'
import { calcSettlements } from '../../utils/utils'
import { ArrowLeft, Receipt, Download } from 'lucide-react'
import SettlementsList from '../SettlementsList/SettlementsList'
import BalanceSummary from '../BalanceSummary/BalanceSummary'
import TransactionTable from '../TransactionTable/TransactionTable'
import EmptyTable from '../EmptyTable/EmptyTable'

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import domtoimage from 'dom-to-image-more'

function Result({ people, expenses, handleStep }) {
  // Calculate settlements
  const settlements = calcSettlements(people, expenses)

  const handleTableSave = async () => {
    const element = document.getElementById('tx-table')

    const dataUrl = await domtoimage.toPng(element)

    const link = document.createElement('a')
    link.download = 'hatian.png'
    link.href = dataUrl
    link.click()
  }

  const handleSummarySave = async () => {
    const element = document.getElementById('results-section')

    // Find and temporarily hide the transaction table
    const transactionTable = element.querySelector(
      '.transaction-table-container',
    )

    if (transactionTable) {
      transactionTable.style.display = 'none'
    }

    // Force width to 900px for capture
    const originalWidth = element.style.width
    element.style.width = '900px'

    // Add footer before capturing
    const footer = document.createElement('h4')
    footer.className = 'results-footer'
    footer.textContent = 'Hatian App by jjjmdev 🐼'
    element.appendChild(footer)

    const dataUrl = await domtoimage.toPng(element)

    // Restore transaction table visibility
    if (transactionTable) {
      transactionTable.style.display = ''
    }

    // Restore original width
    element.style.width = originalWidth

    // Remove footer after capturing
    element.removeChild(footer)

    const link = document.createElement('a')
    link.download = 'hatian-summary.png'
    link.href = dataUrl
    link.click()
  }

  return (
    // Cases:
    // No expenses yet
    // All settled / Calculates to equal
    // With settlement / Shows all
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {expenses.length === 0 ? (
        // No Expenses
        <EmptyTable>
          <Receipt />
          No transactions yet.
        </EmptyTable>
      ) : (
        <div className='results-container' id='results-section'>
          <BalanceSummary people={people} expenses={expenses} />
          <TransactionTable people={people} expenses={expenses} />
          <SettlementsList settlements={settlements} people={people} />
        </div>
      )}

      <div className='btns-container'>
        <button className='btn btn-cancel' onClick={() => handleStep(1)}>
          <ArrowLeft />
          Back
        </button>
        <div>
          {expenses.length > 0 && (
            <>
              <button
                className='btn btn-secondary'
                style={{ marginRight: '1rem' }}
                onClick={handleSummarySave}
              >
                Save Summary
                <Download size={18} />
              </button>
              <button className='btn btn-primary' onClick={handleTableSave}>
                Save Full
                <Download size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Result
