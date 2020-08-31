/**
 * @desc 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
注意：给定 n 是一个正整数。
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
    // f(x) = f(x-1) + f(x-2)
    // 1. 递归
    // 递归出口 n = 1 | n = 0 超时
    let result = 0
    result = calculationN(n)
    return result
}

function calculationN(n) {
    if (n === 1 || n === 0) return 1
    if (n < 0) return 0
    result = calculationN(n - 1) + calculationN(n - 2)
}

var climbStairs = function (n) {
    // f(x) = f(x-1) + f(x-2)
    // 2. 滚动数组
    let result = [0, 1, 1]
    for (let i = 0; i < n - 1; i++) {
        result.shift()
        result.push(result[0], result[1])
    }
    return result.pop()
}

var climbStairs = function (n) {
    // f(x) = f(x-1) + f(x-2)
    // 3. 滚动数组 变量
    let q = 0
    let p = 1
    let r = 1
    for (let i = 0; i < n - 1; i++) {
        q = p
        p = r
        r = q + p
    }
    return r
}

var climbStairs = function (n) {
    // f(x) = f(x-1) + f(x-2)
    // 4. 斐波那契公式
    // 记这个算法主要是为了 记住斐波那契的公司
    const sqrt_5 = Math.sqrt(5)
    const fib_n = Math.pow((1 + sqrt_5) / 2, n + 1) - Math.pow((1 - sqrt_5) / 2, n + 1)
    return Math.round(fib_n / sqrt_5)
}