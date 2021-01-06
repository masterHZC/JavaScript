/**
 * @param {string[][]} equations
 * @param {number[]} values
 * @param {string[][]} queries
 * @return {number[]}
 * @desc https://leetcode-cn.com/problems/evaluate-division/
 */
var calcEquation = function(equations, values, queries) {
  for (let i = 0; i < queries.length - 1; i++) {
    // 值去查 equation
    // 两个都是除数 那么被除数相同 然后两数相除
    // 两个都是被除数 那么 除数相同 然后 两数相除
    // 一个除数一个是被除数 两数相乘
    // 广度优先
    for (let j = 0; j < equations.length; j++) {
      equations[j][0]
      queries[i]
    }
  }
}