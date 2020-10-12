function printOwing(invoice) {
  printBanner()
  let outstanding = calculateOutstanding()

  console.log(`name: ${invoice.customer}`)
  console.log(`amount: ${outstanding}`)
}

function printOwing(invoice) {
  printBanner()
  let outstanding = calculateOutstanding()
  printDetails(outstanding)

  function printDetails(outstanding) {
    console.log(`name: ${invoice.customer}`)
    console.log(`amount: ${outstanding}`)
  }
}

function printOwing(invoice) {
  printBanner()
  const outstanding = calculationOutstanding(invoice)
  recordDueDate(invoice)
  printDetails(invoice, outstanding)
}

function printBanner() {
  console.log('*************')
  console.log('Customer Owes')
  console.log('*************')
}

function calculationOutstanding(invoice) {
  let result = 0
  for(const o of invoice.orders) {
    result += o.amount
  }
  return result
}

function recordDueDate(invoice) {
  const today = Clock.today
  invoice.dueDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);
}

function printDetails(invoice, outstanding) {
  console.log(`name: ${invoice.customer}`)
  console.log(`amount: ${outstanding}`)
  console.log(`due: ${invoice.dueDate.toLocaleDateString()}`)
}