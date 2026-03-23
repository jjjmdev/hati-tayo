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
      <section className='main'>
        {/* Title & Date */}
        <div className='section-header'>
          <h2>Hati Tayo!</h2>
          <p className='section-description'>
            Split expenses fairly in 3 simple steps
          </p>
        </div>

        <Calculator notify={notify} setConfirmDialog={setConfirmDialog} />
      </section>
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
