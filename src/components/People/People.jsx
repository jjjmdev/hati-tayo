import './People.css'
import { usePeople } from '../../hooks/usePeople'
import EmptyTable from '../EmptyTable/EmptyTable.jsx'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import {
  UserRound,
  UsersRound,
  X,
  ArrowRight,
  RotateCcw,
  Pencil,
  Ban,
  Check,
} from 'lucide-react'
import { getPeople, addPeople, deletePeople, updatePeople } from '../../data.js'
import { useState } from 'react'

function People({ people, setPeople, handleStep, handleReset, notify }) {
  const [name, setName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  // Helper
  const { getPersonColor } = usePeople(people)

  function handleAdd() {
    const result = addPeople(name)

    // Success: refresh list and clear input
    if (result.success) {
      setPeople(getPeople())
      setName('')
      return
    }

    handleError(result.reason)
  }

  function handleDelete(id) {
    deletePeople(id)
    setPeople(getPeople())
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
    handleReset()
    setName('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className='people-container'
    >
      <h3>Add Group Members</h3>

      <div className='add-person-form'>
        <div className='input-group'>
          <input
            type='text'
            placeholder='Enter name (e.g. Joshua)'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <UserRound />
        </div>

        <button className='btn btn-primary' onClick={handleAdd}>
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
          <div className='people-grid'>
            {people.map(({ id, name }) => (
              <div className='badge' key={id}>
                {editingId === id ? (
                  // EDITING
                  <>
                    <span
                      className='badge-avatar'
                      style={{ backgroundColor: getPersonColor(id) }}
                    >
                      {editName.charAt(0).toUpperCase()}
                    </span>
                    <input
                      type='text'
                      className='edit-name-input'
                      onChange={(e) => setEditName(e.target.value)}
                      value={editName}
                    />
                    <div className='badge-btns-container'>
                      <div
                        className='badge-btn badge-primary'
                        onClick={() => handleEditSave()}
                      >
                        <Check />
                      </div>
                      <div
                        className='badge-btn badge-info'
                        onClick={() => handleEditCancel()}
                      >
                        <Ban />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className='badge-avatar'
                      style={{ backgroundColor: getPersonColor(id) }}
                    >
                      {name.charAt(0).toUpperCase()}
                    </span>
                    <span className='badge-name'>{name}</span>
                    <div className='badge-btns-container'>
                      <div
                        className='badge-btn badge-info'
                        onClick={() => handleEditClick(id, name)}
                      >
                        <Pencil />
                      </div>
                      <div
                        className='badge-btn badge-delete'
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

          <div className='btns-container'>
            <button className='btn btn-cancel btn-reset' onClick={onResetClick}>
              <RotateCcw />
              Start Over
            </button>

            <button className='btn btn-secondary' onClick={() => handleStep(1)}>
              Next: Add Expenses
              <ArrowRight />
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default People
