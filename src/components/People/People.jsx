import './People.css'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { UserRound, UsersRound, Plus, X, ArrowRight } from 'lucide-react'
import { getPeople, addPeople, deletePeople } from '../../data.js'
import { useState } from 'react'
import { bgColors } from '../../utils/constants.js'
import EmptyTable from '../EmptyTable/EmptyTable.jsx'

function People({ people, setPeople, handleStep, notify }) {
  const [name, setName] = useState('')

  function handleAdd() {
    const result = addPeople(name)

    // Success: refresh list and clear input
    if (result.success) {
      setPeople(getPeople())
      setName('')
      return
    }

    // Fail: error handling
    if (result.reason === 'empty') {
      notify({
        caption: 'Name required',
        description: 'Please enter a person name before adding.',
        variant: 'warning',
      })
      return
    }

    if (result.reason === 'duplicate') {
      notify({
        caption: 'Duplicate name',
        description: 'This person is already in the list',
        variant: 'danger',
      })
    }
  }

  function handleDelete(id) {
    deletePeople(id)
    setPeople(getPeople())
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
          <Plus />
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
            {people.map(({ id, name }, index) => (
              <div className='badge' key={id}>
                <span
                  className='badge-avatar'
                  style={{ backgroundColor: bgColors[index % bgColors.length] }}
                >
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className='badge-name'>{name}</span>
                <div className='badge-delete' onClick={() => handleDelete(id)}>
                  <X />
                </div>
              </div>
            ))}
          </div>

          <button
            className='btn btn-secondary btn-across'
            onClick={() => handleStep(1)}
          >
            Next: Add Expenses
            <ArrowRight />
          </button>
        </>
      )}
    </motion.div>
  )
}

export default People
