const plays = {
  'hamlet': {name: 'Hamlet', type: 'tragedy'},
  'as-like': {name: 'As You Like It', type: 'comedy'},
  'othello': {name: 'Othello', type: 'tragedy'}
}

const invoice = {
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
    // print line for this order 
    result += `${playFor(perf).name}: ${usd(thisAmount(perf))} (${perf.audience} seats)\n`
  }
  result += `Amout owed is ${usd(totalAmount())} \n`
  result += `You earned ${volueCredits()} credits \n`
  return result

  function playFor (aPerformance) {
    return plays[aPerformance.playID]
  }

  function thisAmount (aPerformance) {
    let result
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

  function usd (aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumIntegerDigits: 2
    }).format(aNumber/100)
  }

  function totalAmount () {
    let result = 0
    for (let perf of invoice.performances) {
      result += thisAmount(perf)
    }
    return result
  }

  function volueCredits () {
    let result = 0
    for (let perf of invoice.performances) {
      // add volume credits
      result += Math.max(perf.audience - 30, 0)
      // add extra credit for every ten comedy attendees
      if (plays[perf.playID].type === 'comedy') result += Math.floor(perf.audience / 5)
    }
    return result
  }
}

console.log(statement(invoice, plays))
/*
  为原函数添加足够的结构
  1. 提炼函数
  2. 以查询取代临时变量
  3. 使用内联变量代替 只赋值一次 而不被更改的变量
  4. 移动循环语句
  5. 提炼函数
  question：
  1. 提供一个HTML详单
  2. 
*/
// 提供一个HTML详单
//（1）提炼函数
function restatement (invoice, plays) {
  return renderPlainText(invoice, plays)

  function renderPlainText (invoice, plays) {
    let result = `Statement for ${invoice.customer}\n`
    for (let perf of invoice.performances) {
      result += `${playFor(perf).name}: ${usd(thisAmount(perf))} (${perf.audience} seats)\n`
    }
    result += `Amout owed is ${usd(totalAmount())} \n`
    result += `You earned ${volueCredits()} credits \n`
    return result

    function playFor (aPerformance) {
      return plays[aPerformance.playID]
    }
  
    function thisAmount (aPerformance) {
      let result
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
  
    function usd (aNumber) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumIntegerDigits: 2
      }).format(aNumber/100)
    }
  
    function totalAmount () {
      let result = 0
      for (let perf of invoice.performances) {
        result += thisAmount(perf)
      }
      return result
    }
  
    function volueCredits () {
      let result = 0
      for (let perf of invoice.performances) {
        // add volume credits
        result += Math.max(perf.audience - 30, 0)
        // add extra credit for every ten comedy attendees
        if (plays[perf.playID].type === 'comedy') result += Math.floor(perf.audience / 5)
      }
      return result
    }
  }
}

console.log(restatement(invoice, plays))