import './ConfirmDialog.css'
import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

function ConfirmDialog({
  isOpen,
  title,
  message,
  details,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onCancel) {
        onCancel()
      }
    }

    // Only add listener when dialog is open
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <motion.div
      className='confirm-dialog'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className='confirm-dialog__content'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='confirm-dialog__header'>
          <AlertTriangle
            className={`confirm-dialog__icon confirm-dialog__icon--${variant}`}
          />
          <h4>{title}</h4>
          <button className='confirm-dialog__close' onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <p className='confirm-dialog__message'>{message}</p>

        {details && details.length > 0 && (
          <ul className='confirm-dialog__details'>
            {details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        <div className='confirm-dialog__actions'>
          <button className='btn btn--cancel' onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn btn--${variant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ConfirmDialog
