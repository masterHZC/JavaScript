/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 * @desc https://leetcode-cn.com/problems/rotate-array/
 */
var rotate = function(nums, k) {
  const tem = []
  const len = nums.length
  const g = len - k
  let prev
  for (let i = 0; i < len; i++) {
      if (len > k) {
          if (i < g) tem.push(nums[i])
          // 换位置
          if (len - i - g > 0) nums[i] = nums[i + g]
          else nums[i] = tem[i + g - len]
      } else {
          prev = nums[i]
          nums[i] = nums[len - i - 1]
          nums[len - i - 1] = prev
      }
  }
  return nums
}