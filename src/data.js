export function resetData() {
  localStorage.clear()

  return true
}

export function getPeople() {
  if (!localStorage.getItem('people')) {
    return []
  }

  return JSON.parse(localStorage.getItem('people'))
}

export function setPeople(people) {
  localStorage.setItem('people', JSON.stringify(people))
}

export function addPeople(name) {
  const people = getPeople()
  const normalizedName = name.trim()

  // Check for empty name
  if (normalizedName === '') {
    return {
      success: false,
      reason: 'empty',
    }
  }

  // Check for duplicate name (case-insensitive)
  if (people.some((person) => person.name === name))
    return {
      success: false,
      reason: 'duplicate',
    }

  people.push({
    id: crypto.randomUUID(),
    name: normalizedName,
  })
  setPeople(people)

  return { success: true }
}

export function deletePeople(id) {
  const people = getPeople()

  setPeople(
    people.filter((person) => {
      return person.id !== id
    }),
  )
}

export function updatePeople(id, newName) {
  console.log(id)
  const people = getPeople()
  const normalizedName = newName.trim()

  if (normalizedName === '') {
    return {
      success: false,
      reason: 'empty',
    }
  }

  if (people.some((p) => p.name === normalizedName && p.id !== id)) {
    return {
      success: false,
      reason: 'duplicate',
    }
  }

  const index = people.findIndex((p) => p.id === id)

  console.log(index)

  if (index === -1) {
    return {
      success: false,
      reason: 'not_found',
    }
  }

  people[index].name = normalizedName
  setPeople(people)
  return {
    success: true,
  }
}

// == EXPENSES ==
// Get all expenses from localStorage
export function getExpenses() {
  if (!localStorage.getItem('expenses')) {
    return []
  }

  return JSON.parse(localStorage.getItem('expenses'))
}

// Save expenses to localStorage
export function setExpenses(expenses) {
  localStorage.setItem('expenses', JSON.stringify(expenses))
}

// Add a new expense
export function addExpense(expenseData) {
  const { name, amount, paidBy, splitAmong, splits } = expenseData
  const expenses = getExpenses()

  const error = validateExpense(expenseData)
  if (error) {
    return error
  }

  // Create expense object
  const expense = {
    id: crypto.randomUUID(),
    name: name.trim(),
    amount: parseFloat(amount),
    paidBy,
    splitAmong,
    splits,
    createdAt: new Date().toISOString(),
  }

  expenses.push(expense)
  setExpenses(expenses)

  return { success: true, expense }
}

// Delete an expense
export function deleteExpense(id) {
  const expenses = getExpenses()

  setExpenses(expenses.filter((expenses) => expenses.id !== id))
}

export function updateExpense(id, expenseData) {
  const expenses = getExpenses()
  const index = expenses.findIndex((e) => e.id === id)

  if (index === -1) {
    return { success: false, reason: 'not_found' }
  }

  const error = validateExpense(expenseData)
  if (error) {
    return error
  }

  expenses[index] = {
    ...expenses[index],
    name: expenseData.name.trim(),
    amount: parseFloat(expenseData.amount),
    paidBy: expenseData.paidBy,
    splitAmong: expenseData.splitAmong,
    splits: expenseData.splits,
    updatedAt: new Date().toISOString(),
  }

  setExpenses(expenses)
  return { success: true }
}

function validateExpense(expense) {
  const { name, amount, paidBy, splitAmong } = expense

  // Validation
  if (name.trim() === '') {
    return {
      success: false,
      reason: 'empty_name',
    }
  }
  if (!amount || amount <= 0) {
    return {
      success: false,
      reason: 'invalid_amount',
    }
  }
  if (!paidBy || paidBy.length === 0) {
    return {
      success: false,
      reason: 'no_payer',
    }
  }
  if (!splitAmong || splitAmong.length === 0) {
    return {
      success: false,
      reason: 'no_split',
    }
  }

  return null
}
