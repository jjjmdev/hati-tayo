import './Expenses.css'
import { bgColors } from '../../utils/constants.js'
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
import EmptyTable from '../EmptyTable/EmptyTable.jsx'

function Expenses({ people, expenses, setExpenses, notify }) {
  // Form state
  const [itemName, setItemName] = useState('')
  const [amount, setAmount] = useState('')
  const [payers, setPayers] = useState([{ personId: '', amount: '' }])
  const [splitAmong, setSplitAmong] = useState([])

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

    const splitAmount = parseFloat(amount) / splitAmong.length
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
      setAmount('')
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

  // Helpers
  const getPersonName = (id) => people.find((p) => p.id === id)?.name || ''
  const getPersonColor = (id) => {
    const index = people.findIndex((p) => p.id === id)
    return bgColors[index % bgColors.length]
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
          <label className='form-label'>What's this for?</label>
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
          <label className='form-label'>Who paid?</label>

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
                    className='payer-remove'
                    onClick={() => handleRemovePayer(index)}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add another payer button */}
          {people.length !== payers.length && (
            <button
              type='button'
              className='btn btn-secondary btn-add-payer'
              onClick={handleAddPayer}
            >
              <Plus size={16} />
              Add another payer
            </button>
          )}
        </div>

        {/* Split Among */}
        <div className='form-section'>
          <label className='form-label'>
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
          </label>
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
      {expenses.length === 0 ? (
        <EmptyTable>
          <ShoppingCart />
          <span>No expenses yet.</span>
        </EmptyTable>
      ) : (
        <div className='expense-list-container'>
          <h3>Expenses ({expenses.length})</h3>
          <div className='expense-list'>
            {expenses.map((expense) => (
              <div key={expense.id} className='expense-card'>
                {/* Header: Icon + Name + Delete */}
                <div className='expense-card-header'>
                  <span className='expense-name'>{expense.name}</span>
                  <button
                    className='expense-delete'
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Amount */}
                <div className='expense-total'>
                  <span className='expense-amount'>
                    ₱{formatAmount(expense.amount)}
                  </span>
                  <span className='expense-split-amount'>
                    (₱
                    {formatAmount(
                      expense.amount / expense.splitAmong.length,
                    )}{' '}
                    each)
                  </span>
                </div>

                {/* Paid By */}
                <div className='expense-row'>
                  <span className='expense-label'>Paid by</span>
                  <div className='expense-tags'>
                    {expense.paidBy.map((payer, idx) => (
                      <span key={idx} className='expense-tag'>
                        <span
                          className='tag-avatar'
                          style={{
                            backgroundColor: getPersonColor(payer.personId),
                          }}
                        >
                          {getPersonName(payer.personId)
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <span>{getPersonName(payer.personId)}</span>
                        <span className='tag-amount'>
                          ₱{formatAmount(payer.amount.toFixed(0))}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Split Among */}
                <div className='expense-row'>
                  <span className='expense-label'>Split among</span>
                  <div className='expense-tags'>
                    {expense.splitAmong.map((personId) => (
                      <span key={personId} className='expense-tag'>
                        <span
                          className='tag-avatar'
                          style={{ backgroundColor: getPersonColor(personId) }}
                        >
                          {getPersonName(personId).charAt(0).toUpperCase()}
                        </span>
                        <span>{getPersonName(personId)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default Expenses
