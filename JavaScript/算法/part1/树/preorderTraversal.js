// var preorderTraversal = function(root) {
//   let result = []
//   solution(root, result)
//   return result
// };

// function solution(root, result) {
//   if (root) {
//       result.push(root.val)
//       solution(root.left, result)
//       solution(root.right, result)
//   }
// }

// 使用stack模拟系统站，使用循环代替递归
function preOrderIteration(root) {
  const result = []
  const stack = []
  stack.push(root)
  while(stack.length) {
    const node = stack.pop()
    result.push(node.val)
    node.left && stack.push(node.left)
    node.right && stack.push(node.right)
  }
}

function inOrderInteration(root) {
  // 中序的特点：左 中 右
  // 从几个角度看
  // 1. 节点结构分为 左 中 右 一组
  // 2. 第一个输出的点一定是 最左一组的左叶子
  // 无论是只用循环模拟递归还是使用系统栈 都是先到达 最左一组的左侧叶子 然后中间叶子
  // 重点是如何处理 最后一个右叶子
  // 1. 右叶子是基于当前这一组节点的根结点生长的所以要找到当前这组的根结点
  // 2. 当前这组的右叶子 一定比上一组节点的任何一个节点都要靠前输出

  // 最后总结一下 处理方式
  // 先到最左侧的一组节点，找到它的叶子，输出
  // 再找到根结点 输出
  // 最后找到 右节点输出
  // 我们需不需要判断谁是叶子节点，随之当前的root节点，其实不需要特殊处理，只需要每一个节点同样的处理就可以了
  // 栈的特点：栈处理问题的重要的逻辑就是入栈和出栈都是有序的
  // 这一次使用 栈模拟系统栈 我们先思考一下，使用递归开辟系统栈是如何操作的
  /*
    递归伪代码
    [1,2,3,4,5,6,7] 三级

    def inOrder:
      if root:
        inOrder(root.left) 在执行到这的时候 下一步其实并不是直接 输出 root.val 而是直接下潜去找下一个left 叶子
        tranverse_path(root.val)
        inOrder(root.right)
  
  */

  const result = []
  const stack = []
  let cur = root
  while(stack.length || cur) {
    // 走到最低部
    while (cur) {
      stack.push(cur)
      cur = cur.left
    }
    const node = stack.pop()
    // 输出 val
    result.push(node.val)
    // 把当前组合的根结点放进 stack
    // 左 中 右
    node.right && (cur = node.right)
  }
  return result
}

function inOrderInteration(root) {
  const result = []
  const stack = []
  let cur = root
  while(stack.length || cur) {
    if (cur) {
      // 到达第一个输出的叶子位置
      stack.push(cur)
      cur = cur.left
    } else {
      // 输出
      const node = stack.pop()
      result.push(node.val)
      node.right && (cur = node.right)
    }
  }
  return result
}

function postOrderInteration(root) {
  const result = []
  const stack1 = [root]
  const stack2 = []

  while(stack1.length) {
    const node = stack1.pop()
    stack2.push(node)
    if (node.left) stack1.push(node.left)
    if (node.right) stack1.push(node.right)
  }
  while(stack2.length) {
    const node = stack2.pop()
    result.push(node.val)
  }

  return result
}