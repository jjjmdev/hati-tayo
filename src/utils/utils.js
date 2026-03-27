export const formatAmount = (num) => {
  // Check if number has decimal part
  if (Number.isInteger(num)) {
    return num.toLocaleString('en-US')
  }
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
