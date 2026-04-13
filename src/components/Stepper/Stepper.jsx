import './Stepper.css'
import { Users, ShoppingCart, PhilippinePeso } from 'lucide-react'

const stepIcons = [Users, ShoppingCart, PhilippinePeso]

function Stepper({
  steps,
  activeStep,
  onStepClick,
  canStep,
  isReadOnly,
  isCreator,
}) {
  if (isReadOnly && !isCreator) {
    activeStep = steps.length - 1
  }

  return (
    <div className='stepper'>
      {steps.map((step, index) => {
        const isActive = index === activeStep
        const isCompleted = index < activeStep
        const isClickable = isReadOnly && !isCreator ? false : canStep(index)
        const isBlocked = !isClickable && !isActive
        const Icon = stepIcons[index]

        return (
          <div
            key={index}
            className={`stepper__item ${isActive ? 'stepper__item--active' : ''} ${isCompleted ? 'stepper__item--completed' : ''} ${isBlocked ? 'stepper__item--blocked' : ''}`}
            onClick={() => isClickable && onStepClick(index)}
          >
            <div className='stepper__circle'>
              {isCompleted ? (
                <span className='stepper__check'>✓</span>
              ) : (
                <Icon size={18} />
              )}
            </div>
            <span className='stepper__label'>{step}</span>
            {index < steps.length - 1 && (
              <div
                className={`stepper__line ${isCompleted ? 'stepper__line--completed' : ''}`}
              ></div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Stepper
