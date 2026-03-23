import './ConfirmDialog.css'
import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

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
  if (!isOpen) return null

  return (
    <motion.div
      className='confirm-dialog-overlay'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        className='confirm-dialog-content'
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className='confirm-dialog-header'>
          <AlertTriangle className={`confirm-dialog-icon ${variant}`} />
          <h4>{title}</h4>
          <button className='confirm-dialog-close' onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <p className='confirm-dialog-message'>{message}</p>

        {details && details.length > 0 && (
          <ul className='confirm-dialog-details'>
            {details.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}

        <div className='confirm-dialog-btns'>
          <button className='btn btn-cancel' onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn btn-${variant}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ConfirmDialog
