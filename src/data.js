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

export function cleanupExpensesForPerson(personId) {
  const expenses = getExpenses()
  const expensesToDelete = []
  const updatedExpenseIds = [] // Tracks modified expenses

  expenses.forEach((expense) => {
    // Check if person is in this expense
    const isPayer = expense.paidBy?.some((p) => p.personId === personId)
    const isInSplit = expense.splitAmong?.includes(personId)

    if (!isPayer && !isInSplit) {
      return // Person not in this expense, skip
    }

    // Check if this person is the sole payer
    const isSolePayer =
      expense.paidBy?.length === 1 && expense.paidBy[0].personId === personId

    if (isSolePayer) {
      expensesToDelete.push(expense.id)
    } else {
      // Remove payer list
      expense.paidBy = expense.paidBy.filter((p) => p.personId !== personId)
      // Update amount to sum of remaining payers
      expense.amount = expense.paidBy.reduce((sum, p) => sum + p.amount, 0)
      // Remove from splitAmong
      expense.splitAmong = expense.splitAmong.filter((id) => id !== personId)
      // Recalculate splits for remaining people
      if (expense.splitAmong.length > 0) {
        const splitAmount = expense.amount / expense.splitAmong.length
        expense.splits = expense.splitAmong.map((id) => ({
          personId: id,
          amount: splitAmount,
        }))
      }

      updatedExpenseIds.push(expense.id)
    }
  })
  // Delete expenses where deleted person was sole payer
  // Save remaining updated expenses
  setExpenses(
    expenses.filter((expense) => !expensesToDelete.includes(expense.id)),
  )

  return {
    deletedExpenses: expensesToDelete.length,
    updatedExpenses: updatedExpenseIds.length,
  }
}

export function updatePeople(id, newName) {
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
  const { name, amount, paidBy, splitAmong, splits, category } = expenseData
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
    category: category || null,
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
  const { name, amount, paidBy, splitAmong, splits, category } = expenseData
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
    name: name.trim(),
    amount: parseFloat(amount),
    category: category !== undefined ? category : expenses[index].category,
    paidBy,
    splitAmong,
    splits,
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

// For Deletion functionalities
// Check if a person is referenced in any expenses
export function getPersonExpenses(personId) {
  const expenses = getExpenses()
  return expenses.filter((expense) => {
    const isPayer = expense.paidBy?.some((p) => p.personId === personId)
    const isInSplit = expense.splitAmong?.includes(personId)
    return isPayer || isInSplit
  })
}

// Calculate balances for each person
export function calculateBalances(people, expenses) {
  const balances = {}

  // Initialize
  people.forEach((person) => {
    balances[person.id] = {
      paid: 0,
      spent: 0,
      net: 0,
    }
  })

  // Calculate
  expenses.forEach((expense) => {
    // What each person paid
    expense.paidBy.forEach((payer) => {
      if (balances[payer.personId]) {
        balances[payer.personId].paid += payer.amount
      }
    })

    // What each person owes
    expense.splits.forEach((split) => {
      if (balances[split.personId]) {
        balances[split.personId].spent += split.amount
      }
    })
  })

  // Calculate net (positive = owed money, negative = owes money)
  Object.keys(balances).forEach((personId) => {
    balances[personId].net = balances[personId].paid - balances[personId].spent
  })

  return balances
}

export function calcSettlements(people, expenses) {
  // Step 1: Calculate net balance for each person
  const balances = {}
  people.forEach((person) => {
    balances[person.id] = 0
  })

  expenses.forEach((expense) => {
    // Add what each person paid
    expense.paidBy.forEach((payer) => {
      balances[payer.personId] += payer.amount
    })
    // Subtract what each person owes
    expense.splits.forEach((split) => {
      balances[split.personId] -= split.amount
    })
  })

  // Step 2: Separate into debtors and creditors
  let debtors = []
  let creditors = []

  Object.entries(balances).forEach(([personId, balance]) => {
    if (balance < 0) {
      debtors.push({ personId, amount: -balance })
    } else if (balance > 0) {
      creditors.push({ personId, amount: balance })
    }
  })

  // Sort by amount (greedy - largest first)
  debtors.sort((a, b) => b.amount - a.amount)
  creditors.sort((a, b) => b.amount - a.amount)

  // Step 3: Match debtors with creditors
  const settlements = []
  let i = 0,
    j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]
    const amount = Math.min(debtor.amount, creditor.amount)

    if (amount > 0) {
      settlements.push({
        from: debtor.personId,
        to: creditor.personId,
        amount,
      })
    }

    debtor.amount -= amount
    creditor.amount -= amount

    if (debtor.amount === 0) i++
    if (creditor.amount === 0) j++
  }

  return settlements
}
