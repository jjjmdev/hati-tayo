import './Results.css'
import { calcSettlements } from '../../utils/utils'
import { ArrowLeft, Receipt, Download } from 'lucide-react'
import SettlementsList from '../SettlementsList/SettlementsList'
import BalanceSummary from '../BalanceSummary/BalanceSummary'
import TransactionTable from '../TransactionTable/TransactionTable'
import EmptyTable from '../EmptyTable/EmptyTable'

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import html2canvas from 'html2canvas'

function Result({ people, expenses, handleStep }) {
  // Calculate settlements
  const settlements = calcSettlements(people, expenses)

  const handleSaveImage = async () => {
    const element = document.getElementById('results-section')
    const canvas = await html2canvas(element, {
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById('results-section')
        // Create footer
        const footer = clonedDoc.createElement('h4')
        footer.className = 'results-footer'
        footer.textContent = 'Hatian App by jjjmdev 🐼'
        clonedElement.appendChild(footer)
      },
    })

    const image = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'hatian.png'
    link.href = image
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
        {expenses.length > 0 && (
          <button className='btn btn-primary' onClick={handleSaveImage}>
            Save Image
            <Download size={18} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default Result
