const EOF = Symbol('eof') // End Of File
let token = null

// <html></html>
// <br />
function htmlParser(chars) {
  let state = data
  for (c of chars) {
    state = state(c)
  }
  state === state(EOF)
}

function data(c) {
  if (c === '<') {
    return tagOpen
  }
  return data
}

function tagOpen (c) {
  if (c === '/') return endTagOpen
  if (/[a-zA-Z]/.test(c)) {
    token = new StartTagToken()
    token.name = c.toLowerCase()
    return tagName
  }
  if (c === EOF) {
    error(c)
  }
  return data
}

function endTagOpen (c) {
  if (/[a-zA-Z]/.test(c)) {
    token = new EndTagToken()
    token.name = c.toLowerCase()
    return tagNameEnd
  }
  return data
}

function tagName (c) {
  if (/[a-zA-Z]/.test(c)) {
    token.name += c.toLowerCase()
    return tagName
  }
  if  (c === '/') {
    return selfClosingTag
  }
  if (c === '>') {
    return tagNameEnd
  }
  return data
}

function tagNameEnd() {
  if (/[a-zA-Z]/.test(c)) {
    token.name += c.toLowerCase()
    return tagNameEnd
  }
  if (c === '>') {
    return emitEndToken(EOF)
  }
  return data
}

function selfClosingTag (c) {
  if (c === '>') {
    endToken = new EndTagToken()
    endToken.name = token.name
    return emitEndToken(EOF)
  }
  return data
}

function emitEndToken(c) {
  if (c === EOF) return emitEndToken
  return data
}

class StartTagToken {}

class EndTagToken {}

class Attribute {}

function error(c) {
  throw Error(c)
}