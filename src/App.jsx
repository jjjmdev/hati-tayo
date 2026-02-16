import './App.css'
import Calculator from './components/Calculator.jsx'

function App() {
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

        <Calculator />
      </section>
    </>
  )
}

export default App
