# Implementation Plan: Delete Warning for People

## Current State

### Data Structures

#### People ([`data.js:7`](src/data.js:7))

```javascript
// Stored in localStorage as: [{ id, name }]
getPeople() → localStorage.getItem('people')
```

#### Expenses ([`data.js:96`](src/data.js:96))

```javascript
// Stored in localStorage as: [{ id, name, amount, paidBy, splitAmong, splits }]
getExpenses() → localStorage.getItem('expenses')
```

#### Expense Properties

- `paidBy`: `[{ personId, amount }]` - Who paid and how much
- `splitAmong`: `[personId, personId, ...]` - Who splits the expense

### Current Delete Flow

- [`handleDelete(id)`](src/components/People/People.jsx:40) directly calls `deletePeople(id)` without checking for expense references
- [`onResetClick()`](src/components/People/People.jsx:97) calls `handleReset()` without confirmation

---

## Implementation Plan

### Step 1: Add Helper Function in [`data.js`](src/data.js)

Add `getPersonExpenseReferences(personId)` after [`deletePeople()`](src/data.js:47):

```javascript
export function getPersonExpenseReferences(personId) {
  const expenses = getExpenses()
  return expenses.filter((expense) => {
    const isPayer = expense.paidBy?.some((p) => p.personId === personId)
    const isInSplit = expense.splitAmong?.includes(personId)
    return isPayer || isInSplit
  })
}
```

### Step 2: Create Reusable ConfirmDialog Component

Create `src/components/ConfirmDialog/`:

- [`ConfirmDialog.jsx`](src/components/ConfirmDialog/ConfirmDialog.jsx) - Component with title, message, details, onConfirm, onCancel props
- [`ConfirmDialog.css`](src/components/ConfirmDialog/ConfirmDialog.css) - Modal styles

**Component Props:**
| Prop | Type | Description |
|------|------|-------------|
| isOpen | boolean | Show/hide dialog |
| title | string | Dialog title |
| message | string | Main message |
| details | string[] | Optional list items to show |
| onConfirm | function | Confirm button callback |
| onCancel | function | Cancel button callback |
| confirmText | string | "Delete" (default) |
| cancelText | string | "Cancel" (default) |
| variant | string | "danger" or "primary" |

### Step 3: Update [`People.jsx`](src/components/People/People.jsx)

1. **Import** `getPersonExpenseReferences` from data.js
2. **Import** ConfirmDialog component
3. **Add state** for dialog: `const [confirmDialog, setConfirmDialog] = useState(null)`
4. **Modify** [`handleDelete(id)`](src/components/People/People.jsx:40):
   - Check for expense references
   - If referenced: show dialog with warning
   - If not: delete directly
5. **Modify** [`onResetClick()`](src/components/People/People.jsx:97):
   - Show confirmation dialog if expenses exist
6. **Add** dialog UI before closing `</motion.div>`

### Step 4: Update [`Expenses.jsx`](src/components/Expenses/Expenses.jsx)

1. **Import** ConfirmDialog component
2. **Add state** for dialog
3. **Modify** [`handleDeleteExpense(id)`](src/components/Expenses/Expenses.jsx:145):
   - Show ConfirmDialog with expense name confirmation
   - On confirm: delete expense, refresh list, show toast
4. **Add** dialog UI before closing component

---

## Usage Examples

### Delete Person with Warning

```
User clicks delete → Check references
  ├── Has references → Show ConfirmDialog with expense list
  │     ├── Confirm → Delete person, show toast
  │     └── Cancel → Close dialog
  └── No references → Delete directly
```

### Delete Expense

```
User clicks delete on expense → Show ConfirmDialog
  ├── Confirm → Delete expense, refresh list, show toast
  └── Cancel → Close dialog
```

### Start Over Confirmation

```
User clicks "Start Over" → Check expenses
  ├── Has expenses → Show ConfirmDialog
  │     ├── Confirm → Call handleReset(), clear form
  │     └── Cancel → Close dialog
  └── No expenses → Call handleReset() directly
```

---

## File Changes Summary

| File                                                                                               | Action                                                   |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [`src/data.js`](src/data.js)                                                                       | Add `getPersonExpenseReferences()`                       |
| [`src/components/ConfirmDialog/ConfirmDialog.jsx`](src/components/ConfirmDialog/ConfirmDialog.jsx) | Create new component                                     |
| [`src/components/ConfirmDialog/ConfirmDialog.css`](src/components/ConfirmDialog/ConfirmDialog.css) | Create styles                                            |
| [`src/components/People/People.jsx`](src/components/People/People.jsx)                             | Import helper, add state, modify handlers, add dialog UI |
| [`src/components/Expenses/Expenses.jsx`](src/components/Expenses/Expenses.jsx)                     | Add state, modify handleDeleteExpense, add dialog UI     |
