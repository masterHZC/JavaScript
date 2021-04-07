// 递归
var postorder = function(root) {
  const result = []
  solution(root, result)
  return result
};

function solution(root, result) {
  if (root) {
      if (root.children) {
          for (let i = 0; i < root.children.length; i++) {
              solution(root.children[i], result)
          } 
      }
      result.push(root.val)
  }
}

function postorder(root) {
  const tmpStack = [] // 调整节点顺序临时储存
  const stack = [] // 直接输出
  // 调整顺序
  while(tmpStack.length) {
    const node = tmpStack.pop()
    stack.push(node)
    for (let i = 0; i < node.children.length; i++) {
      tmpStack.push(node.children[i])
    }
  }
  for (let i = 0; i < stack.length; i++) {
    if (i >= stack.length / 2) break
    const tmp = stack[i]
    stack[i] = stack[stack.length - 1 - i]
    stack[stack.length - 1 - i] = tmp
  }
  return stack
}