import './Calculator.css'
import {
  BlInput,
  BlStepper,
  BlStepperItem,
} from '@trendyol/baklava/dist/baklava-react'
import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function Calculator() {
  const [activeStep, setActiveStep] = useState(0)

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
            0: <People />,
            1: <Expenses />,
            2: <Results />,
          }[activeStep]
        }
      </div>
    </div>
  )
}

function People() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      People
    </motion.div>
  )
}

function Expenses() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      Expenses
    </motion.div>
  )
}

function Results() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      Results
    </motion.div>
  )
}

export default Calculator
