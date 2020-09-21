const plays = {
  'hamlet': {name: 'Hamlet', type: 'tragedy'},
  'as-like': {name: 'As You Like It', type: 'comedy'},
  'othello': {name: 'Othello', type: 'tragedy'}
}

const invoice =  {
  customer: 'BigCo',
  performances: [
    {
      playID: 'hamlet',
      audience: 55
    },
    {
      playID: 'as-like',
      audience: 35
    },
    {
      playID: 'othello',
      audience: 40
    }
  ]
}

function statement (invoice, plays) {
  let totalAmount = 0
  let volueCredits = 0
  let result = `Statement for ${invoice.customer}\n`
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumIntegerDigits: 2
  }).format
  for (let perf of invoice.performances) {
    const play = plays[perf.playID]
    let thisAmount = 0
    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30)
        }
      break
      case 'comedy':
        thisAmount = 30000
        if (perf.audience > 20) {
          thisAmount += 1000 + 500 * (perf.audience - 20)
        }
        thisAmount += 300 * perf.audience
      break
      default:
          throw new Error(`unknow type: ${play.type}`)
    }
    // add volume credits
    volueCredits += Math.max(perf.audience - 30, 0)
    // add extra credit for every ten comedy attendees
    if (play.type === 'comedy') volueCredits += Math.floor(perf.audience / 5)
    // print line for this order 
    result += `${play.name}: ${format(thisAmount/100)} (${perf.audience} seats)\n`
    totalAmount += thisAmount
  }

  result += `Amout owed is ${format(totalAmount/100)} \n`
  result += `You earned ${volueCredits} credits \n`
  return result
}

console.log(statement(invoice, plays))

// 1. 提炼函数
// 将大段的复杂逻辑提取

function restatement(invoice, plays) {

  return renderPlainText(createStatementData(invoice, plays))

  function createStatementData (invoice) {
    const result = {}
    result.customer = invoice.customer
    result.performances = invoice.performances.map(enrichPerformance)
    result.totalAmount = totalAmount(result)
    result.totalVolumeCredits = totalVolumeCredits(result)
    return result
  }

  function enrichPerformance (aPerformance) {
    const result = Object.assign({}, aPerformance)
    result.play = playFor(aPerformance)
    result.amount = amountFor(result)
    result.volueCredits = volumeCreditsFor(result)
    return result
  }

  function playFor (aPerformance) {
    return plays[aPerformance.playID]
  }

  function amountFor (aPerformance) {
    let result = 0
    switch (aPerformance.play.type) {
      case 'tragedy':
        result = 40000
        if (aPerformance.audience > 30) {
          result += 1000 * (aPerformance.audience - 30)
        }
      break
      case 'comedy':
        result = 30000
        if (aPerformance.audience > 20) {
          result += 1000 + 500 * (aPerformance.audience - 20)
        }
        result += 300 * aPerformance.audience
      break
      default:
          throw new Error(`unknow type: ${aPerformance.play.type}`)
    }
    return result
  }

  function volumeCreditsFor(aPerformance) {
    let result = 0
    result += Math.max(aPerformance.audience - 30, 0)
    if (aPerformance.play.type === 'comedy') result += Math.floor(aPerformance.audience / 5)
    return result
  }

  function totalAmount (data) {
    return data.performances.reduce((total, p) => total + p, 0)
  }

  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volueCredits, 0)
  }
}

function renderPlainText(data) {
  let result = `Statement for ${data.customer}\n`
  for (let perf of data.performances) {
    // print line for this order 
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
  }
  result += `Amout owed is ${usd(data.totalAmount)} \n`
  result += `You earned ${data.totalVolumeCredits} credits \n`
  return result

  function usd (aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumIntegerDigits: 2
    }).format(aNumber/100)
  }
}

console.log(restatement(invoice, plays))