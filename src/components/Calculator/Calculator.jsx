import './Calculator.css'
import { BlStepper, BlStepperItem } from '@trendyol/baklava/dist/baklava-react'
import { useState, useEffect } from 'react'
import People from '../People/People.jsx'
import Expenses from '../Expenses/Expenses.jsx'
import Results from '../Results/Results.jsx'
import { getPeople } from '../../data.js'

function Calculator() {
  const [activeStep, setActiveStep] = useState(0)

  const [people, setPeople] = useState(getPeople())

  useEffect(() => {
    document.addEventListener('bl-stepper-change', (e) => {
      setActiveStep(e.detail.activeStep)
    })
  }, [])

  return (
    <div className='calculator-container'>
      <div className='calculator-header'>
        <BlStepper
          type='number'
          direction='horizontal'
          usage='clickable'
          id='stepper'
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
          />
        </BlStepper>
      </div>

      {/* <button onClick={() => setActiveStep(activeStep - 1)}>step down</button>
      <button onClick={() => setActiveStep(activeStep + 1)}>step up</button> */}

      <div className='calculator-body'>
        {
          {
            0: <People people={people} setPeople={setPeople} />,
            1: <Expenses />,
            2: <Results />,
          }[activeStep]
        }
      </div>
    </div>
  )
}

export default Calculator
