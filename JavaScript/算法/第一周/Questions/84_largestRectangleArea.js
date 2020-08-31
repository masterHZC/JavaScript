/*
  给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。求在该柱状图中，能够勾勒出来的矩形的最大面积。
*/

/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
  // 1. 暴力解法
  let maxArea = heights[0] || 0
  for (let i = 0; i < heights.length; i++) {
    let minHeight = heights[i]
    for (let j = i; j < heights.length - i; j++) {
      if (heights[j] > minHeight) break 
      const width = j - i + 1
      minHeight = Math.min(heights[j], minHeight)
      maxArea = Math.max(width*minHeight, maxArea)
    }
  }
  return maxArea
}