class PerformanceCalculator {
  constructor (aPerformance, play) {
    this.performance = aPerformance
    this.play = play
  }

  get amount () {
    throw new Error('subclass responsebility')
  }

  get volumeCredits () {
    let result = 0
    result = Math.max(this.performance.audience - 30, 0)
    return result
  }
}

class TragedyCalculator extends PerformanceCalculator {
  get amount () {
    let result = 40000
    if (this.performance.audience > 30) result += 1000 * (this.performance.audience - 30)
    return result
  }

  get volumeCredits () {
    return super.volumeCredits
  }
}

class ComedyCalculator extends PerformanceCalculator {
  get amount () {
    let result = 30000
    if (this.performance.audience > 20) result += 1000 + 500 * (this.performance.audience - 20)
    result += 300 * this.performance.audience
    return result
  }

  get volumeCredits () {
    return super.volumeCredits + Math.floor(this.performance.audience / 5)
  }
}

function createStatementData (invoice, plays) {
  const result = {}
  result.customer = invoice.customer
  result.performances = invoice.performances.map(enrichPerformance)
  result.totalAmount = totalAmountFor(result)
  result.totalVolumeCredits = totalVolumeCredits(result)
  return result

  // 以多态取代条件表达式
  function enrichPerformance (aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
    const result = Object.assign({}, aPerformance)
    result.play = calculator.play
    result.amount = calculator.amount
    result.volumeCredits = calculator.volumeCredits
    return result
  }

  function createPerformanceCalculator(aPerformance, aPlay) {
    switch(aPlay.type) {
      // 以多态取代条件表达式
      // 使用面向对象的方式重构表达式 直到现在这部分代码·我并不能很好的理解 为什么一定要把条件语句内的计算内容改成对象的形式
      // 如果是单独提炼出对应的函数 仍然可以形成类似的结构
      case 'tragedy': return new TragedyCalculator(aPerformance, aPlay)
      case 'comedy': return new ComedyCalculator(aPerformance, aPlay)
      default:
        throw new Error('unknown type' + aPlay.type)
    }
  }
  
  function playFor(aPerformance) {
    return plays[aPerformance.playID]
  }
  
  function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount
  }

  function totalAmountFor(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0)
  }
  
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0)
  }
  
  function volumeCreditsFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits
  }
}

export default createStatementData