import './Calculator.css'
import { BlStepper, BlStepperItem } from '@trendyol/baklava/dist/baklava-react'
import { useState } from 'react'
import People from '../People/People.jsx'
import Expenses from '../Expenses/Expenses.jsx'
import Results from '../Results/Results.jsx'
import { getPeople } from '../../data.js'

function Calculator({ notify }) {
  const [activeStep, setActiveStep] = useState(0)
  const [people, setPeople] = useState(getPeople())

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
    if (toStep == 1 && people.length < 2) {
      return false
    }

    return true
  }

  return (
    <div className='calculator-container'>
      <div className='calculator-header'>
        <BlStepper
          type='number'
          direction='horizontal'
          usage='non-clickable'
          id='stepper'
        >
          <BlStepperItem
            id='0'
            title='People'
            variant={activeStep == 0 ? 'active' : 'success'}
            onClick={() => handleStep(0)}
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
            onClick={() => handleStep(1)}
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
            onClick={() => handleStep(2)}
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
              />
            ),
            1: <Expenses />,
            2: <Results />,
          }[activeStep]
        }
      </div>
    </div>
  )
}

export default Calculator
