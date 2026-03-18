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

  const handleSaveImage = async () => {
    const element = document.getElementById('results-section')

    // Find and temporarily remove constraints from calculator-container
    const calculatorContainer = document.querySelector('.calculator-container')
    const originalStyles = {
      maxWidth: calculatorContainer?.style.maxWidth,
      overflow: calculatorContainer?.style.overflow,
      width: calculatorContainer?.style.width,
    }

    // Apply export-friendly styles
    if (calculatorContainer) {
      calculatorContainer.style.maxWidth = 'none'
      calculatorContainer.style.overflow = 'visible'
      calculatorContainer.style.width = 'auto'
    }

    // Add footer before capturing
    const footer = document.createElement('h4')
    footer.className = 'results-footer'
    footer.textContent = 'Hatian App by jjjmdev 🐼'
    element.appendChild(footer)

    const dataUrl = await domtoimage.toPng(element, {
      quality: 1,
      width: element.scrollWidth,
      height: element.scrollHeight,
      style: {
        maxWidth: 'none',
        overflow: 'visible',
      },
    })

    // Remove footer after capturing
    element.removeChild(footer)

    // Restore calculator-container styles
    if (calculatorContainer) {
      calculatorContainer.style.maxWidth = originalStyles.maxWidth || ''
      calculatorContainer.style.overflow = originalStyles.overflow || ''
      calculatorContainer.style.width = originalStyles.width || ''
    }

    const link = document.createElement('a')
    link.download = 'hatian.png'
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
