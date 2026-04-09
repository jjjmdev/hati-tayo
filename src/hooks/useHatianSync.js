import { useEffect, useRef } from 'react'
import { getHatian } from '../api/hatian'

export const useHatianSync = ({
  shareId,
  isReadOnly,
  isCreator,
  setIsReadOnly,
  setActiveStep,
  setPeople,
  setExpenses,
  notifyRef,
}) => {
  const isReadOnlyRef = useRef(isReadOnly)
  const isCreatorRef = useRef(isCreator)

  useEffect(() => {
    isReadOnlyRef.current = isReadOnly
    isCreatorRef.current = isCreator
  }, [isReadOnly, isCreator])

  useEffect(() => {
    if (!shareId) return

    const notifySync = () => {
      notifyRef.current({
        caption: 'Updated',
        description: 'Data synced from server',
        variant: 'info',
      })
    }

    const notifyPermissionChange = (newReadOnly) => {
      notifyRef.current({
        caption: newReadOnly ? 'Now View Only' : 'Now Editable',
        description: 'Permissions updated by owner',
        variant: 'warning',
      })
    }

    const fetchData = async () => {
      const result = await getHatian(shareId)

      if (result.success) {
        // Handle permissions
        const newIsReadOnly = !result.permissions.editable
        const permissionChanged = newIsReadOnly !== isReadOnlyRef.current

        if (permissionChanged) {
          setIsReadOnly(newIsReadOnly)
          notifyPermissionChange(newIsReadOnly)

          if (newIsReadOnly && !isCreatorRef.current) {
            setActiveStep(2)
          }
        }

        // Handle data sync
        const serverData = {
          people: JSON.stringify(result.data.people),
          expenses: JSON.stringify(result.data.expenses),
        }

        const localData = {
          people: localStorage.getItem('people'),
          expenses: localStorage.getItem('expenses'),
        }

        const dataChanged =
          serverData.people !== localData.people ||
          serverData.expenses !== localData.expenses

        if (dataChanged) {
          localStorage.setItem('people', JSON.stringify(result.data.people))
          localStorage.setItem('expenses', JSON.stringify(result.data.expenses))
          setPeople(result.data.people)
          setExpenses(result.data.expenses)
          notifySync()
        }
      }
    }

    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [shareId])
}
