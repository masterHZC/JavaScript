/**
 * @param {string[][]} equations
 * @param {number[]} values
 * @param {string[][]} queries
 * @return {number[]}
 * @desc https://leetcode-cn.com/problems/evaluate-division/
 */
var calcEquation = function(equations, values, queries) {
  const equMap = {}
  for (let i = 0; i < equations.length - 1; i++) {
    // 1. 统一集合
    // equations[i][0] equations[i][1]
    const eque = equations[i]
    // 如果map中不存在某一个参数 那么添加一个参数
    // 如果已经存在 那么在参数中在加一个数
    if (!equMap[eque[0]]) {
      equMap[eque[0]] = []
    }
    equMap[eque[0]].push({ eque[1]: values[i] })
  }
}