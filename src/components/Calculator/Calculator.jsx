import './Calculator.css'
import { BlStepper, BlStepperItem } from '@trendyol/baklava/dist/baklava-react'
import { useState } from 'react'
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
        <BlStepper
          type='number'
          direction='horizontal'
          usage='clickable'
          id='stepper'
          onBlStepperChange={(e) => handleStep(e.detail.activeStep)}
        >
          <BlStepperItem
            id='0'
            title='People'
            variant={activeStep == 0 ? 'active' : 'success'}
          />
          <BlStepperItem
            id='1'
            title='Expenses'
            variant={
              activeStep == 1
                ? 'active'
                : activeStep < 1
                  ? 'default'
                  : 'success'
            }
            className={canStep(1) ? '' : 'bl-stepper-item--blocked'}
            aria-disabled={!canStep(1)}
          />
          <BlStepperItem
            id='2'
            title='Results'
            variant={
              activeStep == 2
                ? 'active'
                : activeStep > 2
                  ? 'success'
                  : 'default'
            }
            className={canStep(2) ? '' : 'bl-stepper-item--blocked'}
            aria-disabled={!canStep(2)}
          />
        </BlStepper>
      </div>

      <div className='calculator-body'>
        {
          {
            0: (
              <People
                people={people}
                setPeople={setPeople}
                handleStep={handleStep}
                notify={notify}
                handleReset={handleReset}
                setConfirmDialog={setConfirmDialog}
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
