/*
  给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。求在该柱状图中，能够勾勒出来的矩形的最大面积。
*/

/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
  // 1. 暴力解法 枚举宽
  // let maxArea = heights[0] || 0
  // for (let i = 0; i < heights.length; i++) {
  //   let minHeight = heights[i]
  //   for (let j = i; j < heights.length; j++) {
  //     const width = j - i + 1
  //     minHeight = Math.min(heights[j], minHeight)
  //     maxArea = Math.max(width*minHeight, maxArea)
  //   }
  // }
  // return maxArea
  // 3348 ms 3172 ms 3196 ms
  // 2. 暴力解法 枚举高
  // 确定一个中间值向左，向右查找大于当前高度的值
  // for (let i = 0; i < heights.length; i++) {
  //   let leftI = i
  //   let rightI = i
  //   while(heights[leftI - 1] && heights[i] <= heights[leftI - 1]) {
  //       leftI--
  //   }
  //   while(heights[rightI + 1] && heights[i] <= heights[rightI + 1]) {
  //       rightI++
  //   }
  //   const width = rightI - leftI + 1
  //   maxArea = Math.max(width*heights[i], maxArea)
  // }
  // return maxArea
  // 5348 ms 4936ms

  // 3. 单调栈
  let stack = []
  let maxArea = 0
  heights.push(0)
  for (let i = 0; i < heights.length; i++) {
    const t = stack[stack.length - 1]
    while (stack.length !== 0 && heights[t] > heights[i]) {
      const top = stack.pop()
      maxArea = Math.max(
        maxArea, 
        heights[top] * (stack.length === 0 ? i : (i - stack[stack.length - 1] - 1))
      )
    }
    stack.push(i)
  }
  return maxArea
}
// [1, 2, 4, 6, 5, 3, 1]

// 暴力求解
// 1. 多个循环嵌套
// 2. 循环每一个值
// 3. 单调栈
/*
  数帽子问题：
    有一个拍好的队伍，队伍中队员的身高是乱序排列的，每个队员只能看到比他身高更矮的队员的帽子。如果刚好某个队员的前面的队员的个子高于他，那么他将一个帽子都看不到。请计算出这个队伍中一共可以看到多少帽子
  暴力解法：
    遍历每一个队员 再向右去遍历 找到第一个比他高的元素 O(n^2)
  单调栈：
    coutHates: heights
      heights.push_back(MaxValue)
      stk
      sum = 0
      for i < heights.size
        while !stk.empty() && heights[i] > heights[stk.top()]
          top = stk.pop()
          sum += i - top - 1
        stk.push(i)
      return sums

    
  这是一系列问题，一个无序的数组，为了达到某种目的需要确定前后边界，就可以维护一个 有序栈（数组索引） 空间换时间
  将元素 升序或者降序 排列到栈中 当发现 不符合这个顺序的元素就是 我们需要出栈的位置 出栈之后就可以 操作一些数据 

  寻找比自己大的第一个数：
    给一个数组，返回一个大小相同的数组。返回的数组的第i个位置的值应当是，对于原数组中的第i个元素，至少往右走多少步，才能遇到一个比自己大的元素（如果之后没有比自己大的元素，或者已经是最后一个元素，则在返回数组的对应位置放上-1）

    例如给定数组为：[2,1,5,6,2,3]
    返回数组应该为：[2,1,1,-1,1,-1]

  countSteps: heights
    stk = []
    result = []
    for i < heights.size
      result[i] = -1
      while !stk.empty && heights[i] > heights[stk.top()]
        top = stk.pop()
        result[top] = i - top

    stk.push(i)
  
  return result
  
*/