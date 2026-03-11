import './App.css'
import Calculator from './components/Calculator/Calculator.jsx'
import { BlNotification } from '@trendyol/baklava/dist/baklava-react.js'
import { useRef } from 'react'

function App() {
  const blNotification = useRef(null)

  const notify = ({
    caption,
    description,
    variant = 'warning',
    duration = 3,
  }) => {
    const api = blNotification.current
    if (api && typeof api.addNotification === 'function') {
      api.addNotification({ caption, description, variant, duration })
    }
  }

  return (
    <>
      <section className='main'>
        {/* Title & Date */}
        <div className='section-header'>
          <h2>Hati Tayo!</h2>
          <p className='section-description'>
            Split expenses fairly in 3 simple steps
          </p>
        </div>

        <Calculator notify={notify} />
      </section>
      <BlNotification ref={blNotification} />
    </>
  )
}

export default App
