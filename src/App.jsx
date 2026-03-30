import './App.css'
import Calculator from './components/Calculator/Calculator.jsx'
import { BlNotification } from '@trendyol/baklava/dist/baklava-react.js'
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog.jsx'
import { useRef, useState } from 'react'

function App() {
  const blNotification = useRef(null)
  const [confirmDialog, setConfirmDialog] = useState(null)

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
      <header className='site-navbar'>
        <div className='navbar-inner'>
          <a href='#' className='brand'>
            Hati Tayo 💰
          </a>
        </div>
      </header>

      <main className='app-main'>
        <section className='hero'>
          <div className='hero-content'>
            <h1>Friend, magbayad ka na.</h1>
            <p>Simpleng expense tracker para sa tropa.</p>
          </div>
        </section>

        <section id='calculator' className='calculator-section'>
          <Calculator notify={notify} setConfirmDialog={setConfirmDialog} />
        </section>
      </main>

      <BlNotification ref={blNotification} />
      <ConfirmDialog
        isOpen={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        details={confirmDialog?.details}
        onConfirm={() => {
          confirmDialog?.onConfirm?.()
          setConfirmDialog(null)
        }}
        onCancel={() => setConfirmDialog(null)}
        confirmText={confirmDialog?.confirmText || 'Confirm'}
        cancelText={confirmDialog?.cancelText || 'Cancel'}
        variant={confirmDialog?.variant || 'danger'}
      />
    </>
  )
}

export default App
