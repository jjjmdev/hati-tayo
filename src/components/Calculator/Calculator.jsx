import './Calculator.css'
import { useState } from 'react'
import Stepper from '../Stepper/Stepper.jsx'
import People from '../People/People.jsx'
import Expenses from '../Expenses/Expenses.jsx'
import Results from '../Results/Results.jsx'
import { getPeople, getExpenses, resetData } from '../../data.js'

function Calculator({ notify, setConfirmDialog }) {
  const [activeStep, setActiveStep] = useState(0)
  const [people, setPeople] = useState(getPeople())
  const [expenses, setExpenses] = useState(getExpenses())
  const [editingExpense, setEditingExpense] = useState(null)

  const handleStep = (toStep) => {
    // case: Going from 'People' to 'Expenses'
    if (!canStep(toStep)) {
      notify({
        caption: 'Add at least 2 people',
        description: 'You need 2 people before using Expenses/Results.',
      })
      return
    }

    setActiveStep(toStep)
  }

  const canStep = (toStep) => {
    // case: Going back
    if (toStep < activeStep) {
      return true
    }

    // Must have two people to navigate
    if (toStep > 0 && people.length < 2) {
      return false
    }

    return true
  }

  const handleReset = () => {
    resetData()
    setPeople(getPeople())
    setExpenses(getExpenses())
  }

  const handleEditExpense = (expense) => {
    const element = document.querySelector('.expenses-container')
    // with timeout to ensure render
    setTimeout(() => element?.scrollIntoView({ behavior: 'smooth' }), 0)
    setEditingExpense(expense)
  }

  return (
    <div className='calculator-container'>
      <div className='calculator-header'>
        <Stepper
          steps={['People', 'Expenses', 'Results']}
          activeStep={activeStep}
          onStepClick={handleStep}
          canStep={canStep}
        />
      </div>

      <div className='calculator-body'>
        {
          {
            0: (
              <People
                people={people}
                setPeople={setPeople}
                setExpenses={setExpenses}
                setConfirmDialog={setConfirmDialog}
                notify={notify}
                handleStep={handleStep}
                handleReset={handleReset}
              />
            ),
            1: (
              <Expenses
                people={people}
                expenses={expenses}
                setExpenses={setExpenses}
                editingExpense={editingExpense}
                onExpenseEdit={handleEditExpense}
                handleStep={handleStep}
                notify={notify}
                setConfirmDialog={setConfirmDialog}
              />
            ),
            2: (
              <Results
                people={people}
                expenses={expenses}
                handleStep={handleStep}
              />
            ),
          }[activeStep]
        }
      </div>
    </div>
  )
}

export default Calculator
