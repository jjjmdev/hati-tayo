export const formatAmount = (num) => num.toLocaleString('en-US')

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
