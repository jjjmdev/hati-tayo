# Edit Functionality Design

## Current State

### People Component

- Can **add** new people (name)
- Can **delete** existing people
- Data stored in localStorage with structure: `{ id: string, name: string }`

### ExpenseList Component

- Can **add** new expenses (via Expenses.jsx form)
- Can **delete** existing expenses
- Data stored in localStorage with structure:
  ```js
  {
    id: string,
    name: string,
    amount: number,
    paidBy: [{ personId: string, amount: number }],
    splitAmong: string[], // person IDs
    splits: { [personId: string]: number },
    createdAt: string
  }
  ```

---

## Edit People Design

### UI Changes

1. Add an **edit button** (pencil icon) next to the delete button for each person badge
2. When clicked, the badge transforms to **inline edit mode**:
   - Name becomes an input field
   - Add/Save and Cancel buttons appear
3. **Validation**: Prevent duplicate names

### Data Layer Changes

Add to `data.js`:

```js
export function updatePeople(id, newName) {
  const people = getPeople()
  const index = people.findIndex((p) => p.id === id)
  if (index === -1) return { success: false, reason: 'not_found' }

  // Check duplicate
  if (people.some((p) => p.name === newName && p.id !== id)) {
    return { success: false, reason: 'duplicate' }
  }

  people[index].name = newName.trim()
  setPeople(people)
  return { success: true }
}
```

### Component Changes (People.jsx)

1. Add state: `editingId` to track which person is being edited
2. Add state: `editName` to track the input value during edit
3. Add edit button with `Pencil` icon from lucide-react
4. Transform badge into edit form when `editingId === person.id`

---

## Edit Expenses Design

### UI Approach: Modal vs Inline

**Recommended: Modal** - Opens the same form used for adding expenses, pre-filled with existing data.

### User Flow

1. User clicks **edit button** on an expense card in ExpenseList
2. A **modal/dialog** opens with the expense form:
   - Expense name (pre-filled)
   - Amount (pre-filled)
   - Paid by (pre-filled, multi-select)
   - Split type (pre-selected)
   - Split among (pre-selected)
3. User modifies fields
4. Click **Save** to update, or **Cancel** to close

### Data Layer Changes

Add to `data.js`:

```js
export function updateExpense(id, expenseData) {
  const expenses = getExpenses()
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) return { success: false, reason: 'not_found' }

  // Validate
  if (expenseData.name?.trim() === '') {
    return { success: false, reason: 'empty_name' }
  }
  if (!expenseData.amount || expenseData.amount <= 0) {
    return { success: false, reason: 'invalid_amount' }
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
```

### Component Changes

#### Option A: Reuse Expenses.jsx Form

- Pass `editingExpense` prop to Expenses component
- When set, form shows in "edit mode" with pre-filled values
- On save, calls `updateExpense` instead of `addExpense`

#### Option B: Create ExpenseModal (Separate Component)

- Create new `ExpenseModal.jsx` component
- Contains the same form fields
- Used by both adding and editing

**Recommendation: Option A** - Reuse existing form to minimize code duplication.

---

## Implementation Steps

### Step 1: Edit People

1. Add `updatePeople()` function to `data.js`
2. Add edit button (Pencil icon) to People.jsx badge
3. Add edit mode UI with inline input
4. Handle save/cancel and validation

### Step 2: Edit Expenses

1. Add `updateExpense()` function to `data.js`
2. Add edit button to ExpenseList.jsx cards
3. Pass `editingExpense` prop to Expenses.jsx
4. Pre-fill form when editing
5. Handle update on save

### Step 3: Edge Cases - IMPORTANT!

**When Editing a Person:**

- Editing name: No issues - expenses use person IDs, not names ✅
- Deleting a person: Show warning if referenced in expenses ⚠️

**When Editing an Expense:**

- Changing amount: Allow (no payment tracking in this version) ✅
- Changing payer: Update paidBy array ✅
- Removing person from splitAmong: Recalculate splits among remaining ✅
- Adding new person to splitAmong: Recalculate splits ✅
- Changing split type (equal → custom): Reset to equal split ✅

**Future Considerations (not in v1):**

- Payment tracking: Track who has paid whom
- Partial payments: Handle partial settlements
- Expense history: Track all changes over time

---

## UI Mockup (Edit People)

```
┌─────────────────────────────────────┐
│  Add Group Members                  │
│  ┌─────────────────────────┐ Add   │
│  │ Enter name...           │       │
│  └─────────────────────────┘       │
│                                     │
│  ┌─────┐              ┌─│─┐       │
│  │  J  │ Joshua    [✏️]│ X │       │
│  └─────┘              └─│─┘       │
│  ┌─────┐              ┌─│─┐       │
│  │  M  │ Maria     [✏️]│ X │       │
│  └─────┘              └─│─┘       │
└─────────────────────────────────────┘

After clicking edit on Maria:
┌─────┐              ┌────┐ ┌────┐
│  M  │ [ Maria___ ] │Save│ │Can│
└─────┘              └────┘ └────┘
```

## UI Mockup (Edit Expenses)

```
┌─────────────────────────────────────┐
│  Expense: Lunch @ Raffaele          │
│  ┌─────────────────────────────┐    │
│  │ ₱1500                      │    │
│  └─────────────────────────────┘    │
│                                     │
│  Paid by:                           │
│  [✓] Joshua  (₱1500)               │
│  [ ] Maria                          │
│                                     │
│  Split: Equal ▼                     │
│  Split among:                       │
│  [✓] Joshua  [✓] Maria  [✓] Mark   │
│                                     │
│  [Cancel]              [Save]       │
└─────────────────────────────────────┘
```
