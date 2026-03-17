import './Expenses.css'
import EmptyTable from '../EmptyTable/EmptyTable.jsx'
import ExpenseList from '../ExpenseList/ExpenseList'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount } from '../../utils/utils.js'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import {
  PhilippinePeso,
  Plus,
  ShoppingCart,
  Trash2,
  HandCoins,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { addExpense, deleteExpense, getExpenses } from '../../data'

function Expenses({ people, expenses, setExpenses, notify }) {
  // Form state
  const [itemName, setItemName] = useState('')
  const [payers, setPayers] = useState([{ personId: '', amount: '' }])
  const [splitAmong, setSplitAmong] = useState([])

  // Helpers
  const { getPersonColor } = usePeople(people)

  const payerTotal = payers
    .filter((p) => p.personId && p.amount)
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0)

  // Add new payer row
  const handleAddPayer = () => {
    setPayers((prev) => [...prev, { personId: '', amount: '' }])
  }

  // Remove payer row
  const handleRemovePayer = (index) => {
    setPayers((prev) => prev.filter((_, i) => i !== index))
  }

  // Update payer data
  const handlePayerChange = (index, field, value) => {
    setPayers((prev) =>
      prev.map((payer, i) =>
        i == index ? { ...payer, [field]: value } : payer,
      ),
    )
  }

  // Get available people for dropdown (exclude already selected)
  const getAvailablePeople = (currentIndex) => {
    const selectedIds = payers
      .map((p, i) => (i !== currentIndex ? p.personId : null))
      .filter(Boolean)

    return people.filter((p) => !selectedIds.includes(p.id))
  }

  // Toggle split checkbox
  const handleSplitAmongToggle = (personId) => {
    setSplitAmong((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId],
    )
  }

  // Toggle select all / deselect all
  const handleSplitSelectAll = () => {
    if (splitAmong.length === people.length) {
      // If all selected, deselect all
      setSplitAmong([])
    } else {
      // Otherwise, select all
      setSplitAmong(people.map((p) => p.id))
    }
  }

  // Calculate splits (always equal)
  const calculateSplits = () => {
    if (splitAmong.length === 0) return []

    const splitAmount = payerTotal / splitAmong.length
    return splitAmong.map((personId) => ({ personId, amount: splitAmount }))
  }

  // Add expense
  const handleAddExpense = () => {
    const validPayers = payers
      .filter((p) => p.personId && p.amount)
      .map((p) => ({ personId: p.personId, amount: parseFloat(p.amount) }))

    const totalAmount = validPayers.reduce((sum, p) => sum + p.amount, 0)

    const result = addExpense({
      name: itemName,
      amount: totalAmount,
      paidBy: validPayers,
      splitAmong,
      splits: calculateSplits(),
    })

    if (result.success) {
      setExpenses(getExpenses())
      setItemName('')
      setPayers([{ personId: '', amount: '' }])
      setSplitAmong([])
      notify({
        caption: 'Expense added',
        description: `"${itemName}" has been added.`,
        variant: 'success',
      })
    } else {
      const messages = {
        empty_name: 'Please enter an expense name.',
        invalid_amount: 'Please enter a valid amount.',
        no_payer: 'Please add at least one payer with an amount.',
        no_split: 'Please select who to split among.',
      }
      notify({
        caption: 'Cannot add expense',
        description: messages[result.reason],
        variant: 'warning',
      })
    }
  }

  // Delete expense
  const handleDeleteExpense = (id) => {
    deleteExpense(id)
    setExpenses(getExpenses())
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3>Manage Expenses</h3>
      <div className='expenses-container'>
        {/* Item Name and Total */}
        <div className='form-section'>
          <div className='form-label'>What's this for?</div>
          <div className='detail-row'>
            <div className='input-group'>
              <input
                type='text'
                placeholder='(e.g. Dinner)'
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className='expense-name-input'
              />
            </div>
            <div className='expense-amount-display'>
              <div className='amount-total-value'>
                ₱{formatAmount(payerTotal)}
              </div>
              <div className='expense-label'>Total</div>
            </div>
          </div>
        </div>

        {/* Who Paid */}
        <div className='form-section'>
          <div className='form-label'>Who paid?</div>

          <div className='payers-list'>
            {payers.map((payer, index) => (
              <div key={index} className='payer-row'>
                {/* Person dropdown */}
                <select
                  className='payer-select'
                  value={payer.personId}
                  onChange={(e) =>
                    handlePayerChange(index, 'personId', e.target.value)
                  }
                >
                  <option value=''>Select person</option>
                  {getAvailablePeople(index).map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>

                {/* Amount Input */}
                <div className='payer-amount'>
                  <input
                    type='text'
                    placeholder='0'
                    value={payer.amount}
                    onChange={(e) =>
                      handlePayerChange(index, 'amount', e.target.value)
                    }
                  />
                  <PhilippinePeso />
                </div>

                {/* Remove button */}
                {payers.length > 1 && (
                  <button
                    type='button'
                    className='btn-danger btn-danger-md'
                    onClick={() => handleRemovePayer(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add another payer button */}
          <button
            type='button'
            className='btn btn-secondary btn-add-payer'
            onClick={handleAddPayer}
            disabled={people.length === payers.length}
          >
            <Plus size={16} />
            {people.length === payers.length
              ? 'All people added'
              : 'Add another payer'}
          </button>
        </div>

        {/* Split Among */}
        <div className='form-section'>
          <div className='form-label'>
            Split among
            <button
              type='button'
              className='btn-select-all'
              onClick={handleSplitSelectAll}
            >
              {splitAmong.length === people.length
                ? 'Deselect all'
                : 'Select all'}
            </button>
          </div>
          <div className='checkbox-grid'>
            {people.map((person) => (
              <label key={person.id} className='checkbox-item'>
                <input
                  type='checkbox'
                  checked={splitAmong.includes(person.id)}
                  onChange={() => handleSplitAmongToggle(person.id)}
                />
                <span
                  className='checkbox-avatar'
                  style={{ backgroundColor: getPersonColor(person.id) }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </span>
                <span className='checkbox-name'>{person.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          className='btn btn-primary btn-across'
          onClick={handleAddExpense}
        >
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        people={people}
        onDelete={handleDeleteExpense}
      />
    </motion.div>
  )
}

export default Expenses
