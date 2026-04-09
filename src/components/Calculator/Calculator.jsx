import './Calculator.css'
import { useState, useEffect, useRef } from 'react'
import Stepper from '../Stepper/Stepper.jsx'
import People from '../People/People.jsx'
import Expenses from '../Expenses/Expenses.jsx'
import Results from '../Results/Results.jsx'
import { getPeople, getExpenses, resetData } from '../../data.js'
import { getHatian, updateHatian } from '../../api/hatian'
import { useHatianSync } from '../../hooks/useHatianSync'

function Calculator({
  notify,
  setConfirmDialog,
  shareId,
  isReadOnly,
  setIsReadOnly,
  isCreator,
}) {
  const [activeStep, setActiveStep] = useState(isReadOnly ? 2 : 0)
  const [people, setPeople] = useState(getPeople())
  const [expenses, setExpenses] = useState(getExpenses())
  const [editingExpense, setEditingExpense] = useState(null)

  const saveTimeoutRef = useRef(null)
  const notifyRef = useRef(notify)
  notifyRef.current = notify

  useHatianSync({
    shareId,
    isReadOnly,
    isCreator,
    setIsReadOnly,
    setActiveStep,
    setPeople,
    setExpenses,
    notifyRef,
  })

  useEffect(() => {
    if (!shareId) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateHatian(shareId, getPeople(), getExpenses())
      } catch (error) {
        console.error('Auto-save failed:', error)
      }
    }, 1000)
  }, [people, expenses, shareId])

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
          isReadOnly={isReadOnly}
          isCreator={isCreator}
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
