/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = []
    const len = s.length
    if (len % 2 !== 0) return false
    for (let i = 0; i < len; i++) {
        if (s[i] === '(') stack.push(')')
        else if (s[i] === '[') stack.push(']')
        else if (s[i] === '{') stack.push('}')
        else if (stack.length === 0 || stack.pop() !== s[i]) return false
    }
    return stack.length === 0
}