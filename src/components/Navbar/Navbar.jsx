import './Navbar.css'
import { Link } from 'lucide-react'
import { createHatian, updateHatianPermissions } from '../../api/hatian.js'

function Navbar({ shareId, setShareId, isReadOnly, setIsReadOnly, notify }) {
  const handleCreateShareLink = async () => {
    const people = JSON.parse(localStorage.getItem('people') || '[]')
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')

    if (people.length === 0) {
      notify({
        caption: 'No data',
        description: 'Add people first before creating a share link',
        variant: 'warning',
      })
      return
    }

    try {
      const result = await createHatian(people, expenses, true)

      if (result.success) {
        const newShareId = result.shareId
        const shareUrl = `${window.location.origin}/hati-tayo/${newShareId}`

        await navigator.clipboard.writeText(shareUrl)
        window.history.pushState({}, '', `/hati-tayo/${newShareId}`)
        setShareId(newShareId)
        localStorage.setItem('createdHatian', newShareId)
        notify({
          caption: 'Link created!',
          description: 'URL copied to clipboard',
          variant: 'success',
        })
      } else {
        notify({
          caption: 'Error',
          description: result.error || 'Failed to create link',
          variant: 'danger',
        })
      }
    } catch (error) {
      notify({
        caption: 'Error',
        description: 'Failed to create link',
        variant: 'danger',
      })
    }
  }

  return (
    <nav className='navbar'>
      <div className='navbar__container'>
        <div className='navbar__brand'>hati tayo.</div>

        <div className='navbar__actions'>
          {shareId && localStorage.getItem('createdHatian') === shareId && (
            <button
              className='navbar__btn btn--secondary btn--sm'
              onClick={async () => {
                await updateHatianPermissions(shareId, isReadOnly)
                setIsReadOnly(!isReadOnly)
                notify({
                  caption: isReadOnly ? 'Now editable' : 'Now view-only',
                  variant: 'success',
                })
              }}
            >
              {isReadOnly ? 'Make Editable' : 'Make View Only'}
            </button>
          )}

          {shareId ? (
            <button
              className='navbar__btn btn--outline btn--sm'
              onClick={async () => {
                const shareUrl = `${window.location.origin}/hati-tayo/${shareId}`
                await navigator.clipboard.writeText(shareUrl)
                notify({ caption: 'Link copied!', variant: 'success' })
              }}
            >
              Copy Link
            </button>
          ) : (
            <button
              className='navbar__btn btn--secondary btn--sm'
              onClick={handleCreateShareLink}
            >
              Share <Link size={14} />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
