import './People.css'
import { usePeople } from '../../hooks/usePeople'
import EmptyTable from '../EmptyTable/EmptyTable.jsx'
import { motion } from 'framer-motion'
import {
  UserRound,
  UsersRound,
  X,
  ArrowRight,
  RotateCcw,
  Pencil,
  Ban,
} from 'lucide-react'
import {
  getPeople,
  addPeople,
  deletePeople,
  updatePeople,
  getExpenses,
  getPersonExpenses,
  cleanupExpensesForPerson,
} from '../../data.js'
import { useEffect, useState, useRef } from 'react'

function People({
  people,
  setPeople,
  setExpenses,
  setConfirmDialog,
  handleStep,
  handleReset,
  notify,
}) {
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const editInputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (editingId) {
          handleEditSave()
        } else if (name.trim()) {
          handleAdd()
        }
      }

      if (e.key === 'Escape') {
        setName('')
        if (editingId) {
          handleEditCancel()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [name, editingId])

  // Helper
  const { getPersonColor } = usePeople(people)

  function handleAdd() {
    const result = addPeople(name)

    // Success: refresh list and clear input
    if (result.success) {
      setPeople(getPeople())
      setName('')

      notify({
        caption: 'Person added',
        description: `"${name}" has been added.`,
        variant: 'success',
      })
      return
    }

    handleError(result.reason)
  }

  function handleDelete(id) {
    const person = people.find((p) => p.id === id)
    const references = getPersonExpenses(id)

    if (references.length > 0) {
      setConfirmDialog({
        title: `Delete '${person.name}'?`,
        message: 'This person is referenced in:',
        details: references.map((e) => e.name),
        onConfirm: () => performDelete(id, person.name),
      })
      return
    }

    // No references - safe to delete
    performDelete(person.id, person.name)
  }

  function performDelete(personId, personName) {
    // Clean up expenses first
    const result = cleanupExpensesForPerson(personId)
    // Then delete the person
    deletePeople(personId)
    setPeople(getPeople())
    setExpenses(getExpenses())

    // Build parts array and join with ". "
    const parts = [`${personName} has been removed`]
    if (result.deletedExpenses > 0) {
      parts.push(`${result.deletedExpenses} expense(s) deleted (sole payer)`)
    }
    if (result.updatedExpenses > 0) {
      parts.push(`${result.updatedExpenses} expenses(s) updated.`)
    }
    notify({
      caption: 'Deleted',
      description: parts.join('. '),
      variant: 'warning',
    })
  }

  function handleEditClick(id, currentName) {
    setEditingId(id)
    setEditName(currentName)
  }

  function handleEditCancel() {
    setEditingId(null)
    setEditName('')
  }

  function handleEditSave() {
    const result = updatePeople(editingId, editName)

    // Success: refresh list and clear input
    if (result.success) {
      setPeople(getPeople())
      setEditingId(null)
      setEditName('')
      return
    }

    handleError(result.reason)
  }

  function handleError(reason) {
    // Fail: error handling
    if (reason === 'empty') {
      notify({
        caption: 'Name required',
        description: 'Please enter a person name before adding.',
        variant: 'warning',
      })
      return
    }

    if (reason === 'duplicate') {
      notify({
        caption: 'Duplicate name',
        description: 'This person is already in the list',
        variant: 'danger',
      })
    }

    if (reason === 'not_found') {
      notify({
        caption: 'Not found',
        description: 'This person ID cannot be found. Refresh the page.',
        variant: 'danger',
      })
    }
  }

  function onResetClick() {
    const expenses = getExpenses()
    if (expenses.length > 0) {
      setConfirmDialog({
        title: 'Reset all data',
        message: 'This will delete all data. Cannot be undone.',
        details: [`${expenses.length} expense(s) will be deleted`],
        onConfirm: performReset,
      })

      return
    }

    performReset()
  }

  function performReset() {
    handleReset()
    setName('')
    notify({
      caption: 'Cleared',
      description: 'All data has been deleted.',
      variant: 'warning',
    })
  }

  const focusInput = (element) => {
    if (element && editingId) {
      element.focus()
    }
    editInputRef.current = element
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className='people'
    >
      <h3>Add Group Members</h3>

      <div className='people__form'>
        <div className='people__input-group'>
          <input
            type='text'
            placeholder='Enter name (e.g. Joshua)'
            onChange={(e) => {
              const value = e.target.value.slice(0, 10).replace(/[<>'"]/g, '')
              setName(value)
            }}
            value={name}
            maxLength={10}
          />
          <UserRound />
        </div>

        <button className='btn btn--primary' onClick={handleAdd}>
          Add
        </button>
      </div>

      {people.length === 0 ? (
        <EmptyTable>
          <UsersRound />
          <span>No one here yet. Add people to start splitting.</span>
        </EmptyTable>
      ) : (
        <>
          <div className='people__grid'>
            {people.map(({ id, name }) => (
              <div className='person-card' key={id}>
                {editingId === id ? (
                  // EDITING
                  <>
                    <span
                      className='person-card__avatar'
                      style={{ backgroundColor: getPersonColor(id) }}
                    >
                      {editName.charAt(0).toUpperCase()}
                    </span>
                    <input
                      type='text'
                      className='person-card__edit-input'
                      onChange={(e) => setEditName(e.target.value)}
                      value={editName}
                      ref={focusInput}
                    />
                    <div className='person-card__actions'>
                      <div
                        className='person-card__btn btn--save btn--primary'
                        onClick={() => handleEditSave()}
                      >
                        Save
                      </div>
                      <div
                        className='person-card__btn btn--cancel btn--info'
                        onClick={() => handleEditCancel()}
                      >
                        <Ban />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className='person-card__avatar'
                      style={{ backgroundColor: getPersonColor(id) }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </span>
                    <span className='person-card__name'>{name}</span>
                    <div className='person-card__actions'>
                      <div
                        className='person-card__btn btn--edit btn--primary'
                        onClick={() => handleEditClick(id, name)}
                      >
                        <Pencil />
                      </div>
                      <div
                        className='person-card__btn btn--delete btn--danger'
                        onClick={() => handleDelete(id)}
                      >
                        <X />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className='button-group'>
            <button
              className='btn btn--cancel btn--reset'
              onClick={onResetClick}
            >
              <RotateCcw size={15} />
              Start Over
            </button>

            <button
              className='btn btn--secondary'
              onClick={() => handleStep(1)}
            >
              Add Expenses
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default People
