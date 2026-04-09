import './App.css'
import Calculator from './components/Calculator/Calculator.jsx'
import Results from './components/Results/Results.jsx'
import { BlNotification } from '@trendyol/baklava/dist/baklava-react.js'
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog.jsx'
import Navbar from './components/Navbar/Navbar.jsx'
import { useRef, useState, useEffect } from 'react'
import { getHatian } from './api/hatian'

function App() {
  const blNotification = useRef(null)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [shareId, setShareId] = useState(null)
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const isCreator = localStorage.getItem('createdHatian') === shareId

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

  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/^\/hati-tayo\/([^/]+)$/)

    if (match) {
      const extractedShareId = match[1]
      loadHatian(extractedShareId)
    }
  }, [])

  async function loadHatian(id) {
    setIsLoading(true)

    try {
      const result = await getHatian(id)
      console.log('Permission', result.permissions)

      if (result.success) {
        setShareId(id)
        setIsReadOnly(!result.permissions.editable)

        localStorage.setItem('people', JSON.stringify(result.data.people))
        localStorage.setItem('expenses', JSON.stringify(result.data.expenses))

        notify({
          caption: 'Loaded',
          description: 'Data loaded from shared link',
          variant: 'success',
        })
      } else {
        notify({
          caption: 'Error',
          description: result.error || 'Failed to load data',
          variant: 'danger',
        })
      }
    } catch (error) {
      notify({
        caption: 'Error',
        description: 'Could not connect to server',
        variant: 'danger',
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      <main className='app-main'>
        <Navbar
          shareId={shareId}
          setShareId={setShareId}
          isReadOnly={isReadOnly}
          setIsReadOnly={setIsReadOnly}
          notify={notify}
        />
        <section className='hero'>
          <div className='hero-content'>
            <h1>Friend, magbayad ka na.</h1>
            <p>Simpleng expense tracker para sa tropa.</p>
          </div>
        </section>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        ) : (
          <section id='calculator' className='calculator-section'>
            <Calculator
              notify={notify}
              setConfirmDialog={setConfirmDialog}
              shareId={shareId}
              isReadOnly={isReadOnly}
              isCreator={isCreator}
              setIsReadOnly={setIsReadOnly}
            />
          </section>
        )}
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
