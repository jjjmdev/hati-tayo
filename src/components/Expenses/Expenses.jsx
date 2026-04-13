import './Expenses.css'
import ExpenseList from '../ExpenseList/ExpenseList'
import { usePeople } from '../../hooks/usePeople'
import { formatAmount } from '../../utils/utils.js'
import { expenseCategories, getCategoryById } from '../../utils/constants'
import { motion } from 'framer-motion'
import { PhilippinePeso, Plus, ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import {
  addExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
} from '../../data'

function Expenses({
  people,
  expenses,
  setExpenses,
  handleStep,
  notify,
  editingExpense,
  onExpenseEdit,
  setConfirmDialog,
}) {
  // Form state
  const [itemName, setItemName] = useState('')
  const [payers, setPayers] = useState([{ personId: '', amount: '' }])
  const [splitAmong, setSplitAmong] = useState([])
  const [category, setCategory] = useState(null)
  const [isEditMode, setIsEditMode] = useState(() => !!editingExpense)
  const [prevEditingExpenses, setPrevEditingExpenses] = useState(editingExpense)

  if (editingExpense !== prevEditingExpenses && editingExpense !== null) {
    setPrevEditingExpenses(editingExpense)
    setItemName(editingExpense.name)
    setCategory(editingExpense.category || null)
    setPayers(editingExpense.paidBy)
    setSplitAmong(editingExpense.splitAmong)
    setIsEditMode(() => !!editingExpense)
  }

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
      category,
      splitAmong,
      splits: calculateSplits(),
    })

    if (result.success) {
      setExpenses(getExpenses())
      setItemName('')
      setCategory(null)
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

  const handleSave = () => {
    const validPayers = payers
      .filter((p) => p.personId && p.amount)
      .map((p) => ({ personId: p.personId, amount: parseFloat(p.amount) }))

    const totalAmount = validPayers.reduce((sum, p) => sum + p.amount, 0)

    // UPDATE existing expense
    const result = updateExpense(editingExpense.id, {
      name: itemName,
      amount: totalAmount,
      paidBy: validPayers,
      category,
      splitAmong,
      splits: calculateSplits(),
    })

    if (result.success) {
      setExpenses(getExpenses())
      notify({
        caption: 'Updated',
        description: 'Expense updated successfully',
        variant: 'success',
      })
      resetForm()
      onExpenseEdit(null)
    }
  }

  const resetForm = () => {
    onExpenseEdit(null)
    setItemName('')
    setCategory(null)
    setPayers([{ personId: '', amount: '' }])
    setSplitAmong([])
    setIsEditMode(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3>Manage Expenses</h3>
      <div className='expense-form'>
        {/* Item Name and Total */}
        <div className='expense-form__section'>
          <div className='expense-form__label'>What's this for?</div>
          <div className='expense-form__detail-row'>
            <div className='expense-form__input-group'>
              <input
                type='text'
                placeholder='(e.g. Dinner)'
                value={itemName}
                maxLength={50}
                onChange={(e) => {
                  // Limit to 50 chars, prevent special chars
                  const value = e.target.value
                    .slice(0, 50)
                    .replace(/[<>'"]/g, '')
                  setItemName(value)
                }}
                className='expense-form__name-input'
              />
            </div>
            <div className='expense-form__amount-display'>
              <div className='expense-form__total-amount-label'>Total</div>
              <div className='expense-form__total-amount'>
                ₱{formatAmount(payerTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Category Selector */}
        <div className='expense-form__section'>
          <div className='expense-form__label'>Category (optional)</div>
          <div className='expense-form__category-pills'>
            {expenseCategories.map((cat) => (
              <button
                key={cat.id}
                type='button'
                className={`expense-form__category-pill ${category === cat.id ? 'expense-form__category-pill--active' : ''}`}
                style={{
                  '--cat-color': cat.color,
                  backgroundColor:
                    category === cat.id ? cat.color : 'transparent',
                  borderColor: category === cat.id ? cat.color : 'black',
                }}
                onClick={() => setCategory(category === cat.id ? null : cat.id)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Who Paid */}
        <div className='expense-form__section'>
          <div className='expense-form__label'>Who paid?</div>

          <div className='expense-form__payers-list'>
            {payers.map((payer, index) => (
              <div key={index} className='expense-form__payer-row'>
                {/* Person dropdown */}
                <select
                  className='expense-form__payer-select'
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
                <div className='expense-form__payer-amount'>
                  <input
                    type='text'
                    placeholder='0'
                    value={payer.amount}
                    onChange={(e) => {
                      // Allow only numbers and one decimal point
                      const value = e.target.value.replace(/[^0-9.]/g, '')
                      // Prevent multiple decimals
                      const parts = value.split('.')
                      if (parts.length > 2) return
                      handlePayerChange(index, 'amount', value)
                    }}
                  />
                  <PhilippinePeso />
                </div>

                {/* Remove button */}
                {payers.length > 1 && (
                  <button
                    type='button'
                    className='btn--md btn--danger btn-danger-md'
                    onClick={() => handleRemovePayer(index)}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add another payer button */}
          <button
            type='button'
            className='btn btn--secondary btn--full-width'
            onClick={handleAddPayer}
            disabled={people.length === payers.length}
          >
            {people.length === payers.length
              ? 'All people added'
              : 'Add another payer'}
          </button>
        </div>

        {/* Split Among */}
        <div className='expense-form__section'>
          <div className='expense-form__label'>
            Split among
            <button
              type='button'
              className='expense-form__btn--select-all'
              onClick={handleSplitSelectAll}
            >
              {splitAmong.length === people.length
                ? 'Deselect all'
                : 'Select all'}
            </button>
          </div>
          <div className='expense-form__checkbox-grid'>
            {people.map((person) => (
              <label key={person.id} className='expense-form__checkbox-item'>
                <input
                  type='checkbox'
                  checked={splitAmong.includes(person.id)}
                  onChange={() => handleSplitAmongToggle(person.id)}
                />
                <span
                  className='expense-form__checkbox-avatar'
                  style={{ backgroundColor: getPersonColor(person.id) }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </span>
                <span className='expense-form__checkbox-name'>
                  {person.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Update/Add Expense Button */}
        {isEditMode ? (
          <div className='expense-form__button-group'>
            <button className='btn btn--cancel' onClick={resetForm}>
              Cancel Edit
            </button>
            <button className='btn btn--primary' onClick={handleSave}>
              Update Expense
              <Plus size={15} />
            </button>
          </div>
        ) : (
          <button
            className='btn btn--primary btn--full-width'
            onClick={handleAddExpense}
          >
            <span>Add Expense</span>
            <Plus size={15} />
          </button>
        )}
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={expenses}
        people={people}
        onDelete={handleDeleteExpense}
        onEdit={onExpenseEdit}
        setConfirmDialog={setConfirmDialog}
      />

      <div className='button-group'>
        <button className='btn btn--cancel' onClick={() => handleStep(0)}>
          <ArrowLeft size={15} />
          Back
        </button>

        <button className='btn btn--secondary' onClick={() => handleStep(2)}>
          Calculate Results
          <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  )
}

export default Expenses
