/**
 * @param {string} s
 * @return {number[][]}
 * @desc https://leetcode-cn.com/problems/positions-of-large-groups/
 */
// 大于等于3的重复字符
var largeGroupPositions = function(s) {
  // 我的
  // const bigger = 3
  // const len = s.length
  // const result = []
  // let count = 1, prev = 0
  //
  // for (let i = 1; i < len; i++) {
  //   // 如果 prev 的值等于 i 那么给count计数
  //   if (s[prev] === s[i]) {
  //     // 当count >= 3 且 数组结束了
  //     if (++count >= bigger && i === len - 1) result[result.length] = [prev, i]
  //   } else { // 否则 prev 不等于 i 重新赋值 prev = i 然后初始化count
  //     if (count >= bigger) result[result.length] = [prev, i - 1]
  //     prev = i
  //     count = 1
  //   }
  // }
  // return result
}
