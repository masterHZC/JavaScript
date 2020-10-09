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
  let result = `Statement for ${invoice.customer}\n`
  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
  }
  result += `Amount owed is ${usd(totalAmountFor())} \n`
  result += `You earned ${totalVolumeCredits()} credits \n`
  return result

  function amountFor(aPerformance) {
    let result = 0
    switch (playFor(aPerformance).type) {
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
          throw new Error(`unknow type: ${playFor(aPerformance).type}`)
    }
    return result
  }

  function totalAmountFor() {
    let result = 0
    for (let perf of invoice.performances) {
      result += amountFor(perf)
    }
    return result
  }

  function totalVolumeCredits() {
    let result = 0
    for (let perf of invoice.performances) {
      result += Math.max(perf.audience - 30, 0)
      if (playFor(perf).type === 'comedy') result += Math.floor(perf.audience / 5)
    }
    return result
  }

  function usd(aNumber) {
    return  new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumIntegerDigits: 2
    }).format(aNumber/100)
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

function restatement(invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`
  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
  }
  result += `Amount owed is ${usd(totalAmountFor())} \n`
  result += `You earned ${totalVolumeCredits()} credits \n`
  return result

  function amountFor(aPerformance) {
    let result = 0
    switch (playFor(aPerformance).type) {
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
          throw new Error(`unknow type: ${playFor(aPerformance).type}`)
    }
    return result
  }

  function totalAmountFor() {
    let result = 0
    for (let perf of invoice.performances) {
      result += amountFor(perf)
    }
    return result
  }

  function totalVolumeCredits() {
    let result = 0
    for (let perf of invoice.performances) {
      result += Math.max(perf.audience - 30, 0)
      if (playFor(perf).type === 'comedy') result += Math.floor(perf.audience / 5)
    }
    return result
  }

  function usd(aNumber) {
    return  new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumIntegerDigits: 2
    }).format(aNumber/100)
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
}

console.log(restatement(invoice, plays))