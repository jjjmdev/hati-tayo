import './Stepper.css'
import { Users, ShoppingCart, PhilippinePeso } from 'lucide-react'

const stepIcons = [Users, ShoppingCart, PhilippinePeso]

function Stepper({ steps, activeStep, onStepClick, canStep }) {
  return (
    <div className='stepper'>
      {steps.map((step, index) => {
        const isActive = index === activeStep
        const isCompleted = index < activeStep
        const isClickable = canStep(index)
        const isBlocked = !isClickable && !isActive
        const Icon = stepIcons[index]

        return (
          <div
            key={index}
            className={`stepper-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isBlocked ? 'blocked' : ''}`}
            onClick={() => isClickable && onStepClick(index)}
          >
            <div className='stepper-circle'>
              {isCompleted ? (
                <span className='stepper-check'>✓</span>
              ) : (
                <Icon size={18} />
              )}
            </div>
            <span className='stepper-label'>{step}</span>
            {index < steps.length - 1 && (
              <div
                className={`stepper-line ${isCompleted ? 'completed' : ''}`}
              ></div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
