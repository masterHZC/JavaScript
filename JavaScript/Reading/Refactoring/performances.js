const plays = {
  'hamlet': {name: 'Hamlet', type: 'tragrdy'},
  'as-like': {name: 'As You Like It', type: 'comedy'},
  'othello': {name: 'Othello', type: 'tragrdy'}
}

const invoices = [
  {
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
]

function stattment (invoice, plays) {
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

  result += `Amout owed is ${totalAmount/100} \n`
  result += `You earned ${volueCredits} credits \n`
  return result
}


// 1. 将result的结果 展示成 HTML 形式
// 修改 每一次赋值 result的内容
// 2. 增加新的表演类型 不同的表演类型对应不同的计费方式 和 积分计算
// 每一个 表演类型 提出一个函数 然后 根据不同的表演类型调用 
/*
  performanceTypes = {
    xxx: function () {}
  }
*/

// 重构
function statement (invoice, plays) {
  let result = `Statement for ${invoice.customer}\n`
  // （4）拆分循环
  for (let perf of invoice.performances) {
    // print line for this order 
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience} seats)\n`
  }
  result += `Amout owed is ${usd(totalAmount())} \n`
  result += `You earned ${totalVolumeCredits()} credits \n`
  return result
  // 1. 提取 switch case
  // （1）提炼函数：抽离函数的步骤
  // 当抽离出函数之后 有那些变量作用域 发生了改变
  function amountFor (aPerformate) {
    // should: 返回值永远 命名 result
    // should: 重新定义传入的变量名称，使其更符合在当前函数中的语义
    let result = 0
    switch (playFor(aPerformate).type) {
      case 'tragedy':
        result = 40000
        if (aPerformate.audience > 30) {
          result += 1000 * (aPerformate.audience - 30)
        }
      break
      case 'comedy':
        result = 30000
        if (aPerformate.audience > 20) {
          result += 1000 + 500 * (aPerformate.audience - 20)
        }
        result += 300 * aPerformate.audience
      break
      default:
          throw new Error(`unknow type: ${playFor(aPerformate).type}`)
    }
    return result
  }
  // 每进行一次重构之后 都要运行一次测试用例 以保证确保 每一次的功能修改是没问题 或者 避免在最后一次修改不知在哪次修改发生的错误
  // 在定义amountFor时，定义在statement 内部
  // 2. 修改抽离函数传参的名称
  // 3. 减少传参
  // 如果某一个参数 可以通过计算得到 那么最好去掉这个参数，因为这会增加局部变量的复杂性
  // （2）以查询取代临时变量
  // 在提炼时，最好是先削减不必要的局部变量，这样就避免复杂变量 导致提取的时候 作用域难以区分
  // （3）使用内联变量代替 只赋值一次 而不被更改的变量
  function playFor (aPerformate) {
    return plays[aPerformate.playID]
  }
  // 接着去除 局部变量
  // 但是 volumeCredits 变量是做累加的 必须要定义 
  // 遇到这种情况 可以在提炼一个相关的函数
  function volumeCreditsFor (aPerformate) {
    let result = 0
    result += Math.max(aPerformate.audience - 30, 0)
    if (playFor(aPerformate).type === 'comedy') result += Math.floor(aPerformate.audience / 5)
    return result
  }
  // 定义变量的 两个因素 
  // 1. 这个变量会随着程序的变化而改变
  // 2. 这个变量（函数）会被反复使用
  // 如果不是基于以上两个原因，可以通过创建一次性函数 来代替生命一次性变量
  // (3) 改变函数生命
  function usd (aNumber) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumIntegerDigits: 2
    }).format(aNumber/100)
  }
  //（4） 移动循环语句
  //（5） 提炼函数
  function totalVolumeCredits () {
    let result = 0
    for (let perf of invoice.performances) {
      result = volumeCreditsFor(perf)
    }
    return result
  }

  function totalAmount () {
    let result = 0
    for (let perf of invoice.performances) {
      result += amountFor(perf)
    }
    return result
  }
}
/*
  1. 提炼函数
  2. 以查询取代临时变量
  3. 使用内联变量代替 只赋值一次 而不被更改的变量
  4. 移动循环语句
  5. 提炼函数
*/