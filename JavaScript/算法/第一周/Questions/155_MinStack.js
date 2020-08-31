/**
 * initialize your data structure here.
 */
/**
 * @desc 
 * 维护两个栈，一个栈维护真实的栈内元素 一个栈维护 当前栈内的最小值
 * 1. 同步操作两个栈内的元素
 * 2. 最小栈只有在 获取更小值或等于当前最小值的之后才push，只有在stack pop 最小值的时候在pop
 * 
 * 维护一个栈和一个最小值
 * 维护一个栈和维护两个栈有条件的添加最小栈的内容是一样
 * 维护一个栈需要在每一次push站内元素之前，如果 push的元素 小于或者等于 当前站内的所有元素
 * 需要先 push min
*/
var MinStack = function() {
    this.stack = []
    this.minStack = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
   if (this.stack.length === 0) {
       this.minStack.push(x)
   } else {
       const r = this.minStack.pop()
       if (r > x) {
        this.minStack.push(r)
        this.minStack.push(x)
       } else {
        this.minStack.push(r)
        this.minStack.push(r)
       }
   }
    this.stack.push(x)
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    const a = this.stack.pop()
    this.minStack.pop()
    return a
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1]
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1]
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */