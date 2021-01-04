/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 * @desc https://leetcode-cn.com/problems/can-place-flowers/
 */
var canPlaceFlowers = function(flowerbed, n) {
  const len = flowerbed.length
  // 暴力解法：枚举了 所有符合条件的情况 比原数组多查询一次
  //  for (let i = 0; i < flowerbed.length; i++) {
  //   if (flowerbed[i] === 0 && (!flowerbed[i - 1] && !flowerbed[i + 1])) {
  //     flowerbed[i] = 1
  //     n && n--
  //   }
  //  }
  //  return n === 0
  // 跳格子
  // for (let i = 0; i <= len - 1; i+=2) {
  //   // i = 1 那么下一个可以放1的地方必定是 i + 2的位置，i + 1的位置必定为1
  //   // i = 0 有两种情况进入到0
  //   // 1. 第一个数字是 0 
  //   // 2. 从 1 跳到 0
  //   // 这两种条件都可以保证 i = 0 时 前一位肯定为 0 或者 不存在 只需要看下一位是不是 1
  //   if (flowerbed[i] === 0) {
  //     if (flowerbed[i + 1] === 0 || i === len - 1) n--
  //     if (flowerbed[i + 1] === 1) i+=3 // 直接跳了三个格子 非常秀
  //   }
  // }
  // return n === 0
  // 
}

console.log(canPlaceFlowers([0,0,1,0,0], 1))
