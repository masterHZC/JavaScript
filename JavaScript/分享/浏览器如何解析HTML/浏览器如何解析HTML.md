# 浏览器如何解析HTML

## 问题：
1. 浏览器从接收数据到渲染出页面都经历了什么？
2. [浏览器会如何处理不符合标准的标签？](https://html.spec.whatwg.org/multipage/parsing.html#unclosed-formatting-elements)
```html
  <h1>下班啦
  <p><b>又下班啦
```
3. dom节点为什么可以接受事件？

## HTML解释器
渲染引擎：
  + HTML解释器：将HTML文本解释成DOM
  + CSS解释器：为DOM中的各个元素对象计算出样式信息，为计算最后页面的不仅提供基础设施
  + JavaSript引擎：解释JavaScript代码，并通过DOM接口和CSSOM接口来修改页面的内容和样式，最后改变渲染结果
  + 布局：将DOM元素和样式信息结合，计算出它们的大小位置等布局信息，最终形成一个展示所有信息的内部模型
  + 绘图：使用图形库将布局计算后的各个网页的节点绘制成图像

### HTML解释器的解析过程
```
 字节流 -> 字符流 -> Token -> 节点 -> DOM树
```

![资源到DOM树](/Users/koolearn/Documents/loneliness/typescript/JavaScript/JavaScript/分享/浏览器如何解析HTML/image/资源到DOM树.jpg)

### 解析的过程
```
  Webkit页面解析过程需要的类：
  DocumentWriter 
  HTMLDocumentParser
    XSSAuditor、HTMLTokenizer、HTMLTreeBuilder: HTMLConstructionSite
    HTMLConstructionSite：HTMLElementStact
```

+ 检测编码格式
解析器首先会检测网页内容所使用的编码格式，如果在页面中找到到了设置的特殊编码格式，就是使用相应的解码器来将字节流转化成特定格式字符串，如果没有特殊的设置，就会通过`HTMLTokenizer类`来直接进行词法解析
+ 词法解析
  词法解析器的本质是一个状态机。词法解析器会调用一个`nextToken`的方法，通过循环将字符串传入其中，处理之后输出一个Token。
[Html的词法解析](https://html.spec.whatwg.org/multipage/parsing.html#parsing)
[Javascript State Machine](https://github.com/jakesgordon/javascript-state-machine)
```js
const EOF = Symbol('eof') // End Of File
let token = null

// <html></html>
// <br/>
function nextToken(chars) {
  let state = data
  for (c of chars) {
    state = state(c)
  }
  return state === emitEndToken(EOF)
}

function data(c) {
  if (c === '<') {
    return tagOpen
  }
  return errorTag
}

function tagOpen (c) {
  if (c === '/') return endTagOpen
  if (isASCIIAlpha(c)) {
    token = new StartTagToken()
    return tagName
  }
  return errorTag
}

function endTagOpen (c) {
  if (isASCIIAlpha(c)) {
    token = new EndTagToken()
    return endTagName
  }
  return errorTag
}

function tagName (c) {
  if (isASCIIAlpha(c)) {
    token.name += c.toLowerCase()
    return tagName
  }
  if  (c === '/') {
    return selfClosingTag
  }
  if (c === '>') {
    return data
  }
  return errorTag
}

function endTagName(c) {
  if (isASCIIAlpha(c)) {
    token.name += c.toLowerCase()
    return endTagName
  }
  if (c === '>') {
    return emitEndToken(EOF)
  }
  return errorTag
}

function selfClosingTag (c) {
  if (c === '>') {
    return emitEndToken(EOF)
  }
  return errorTag
}

function emitEndToken(c) {
  if (c === EOF) return emitEndToken
  return data
}

function errorTag(c) {
  return errorTag
}

function isASCIIAlpha(c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z")
}
class StartTagToken {}

class EndTagToken {}
```
+ XSSAuditor 验证词语

+ 生成DOM节点
  Token的类型，在浏览器定义了很少只有6种：
  
  ```
    DOCTYPE、StartTag、EndTag、Comment、Character、EndOfFile
  ```
  ```
    void HTMLTreeBuilder::processToken() {
      switch(token -> type()) {
        case HTMLToken::Uninitailized:
          ...
          break
        case HTMLToken::DOCTYPE:
          processDoctypeToken(token)
          break
        case HTMLToken::StartTag:
          processStartTag(token)
          break
        case HTMLToken::EndTag:
          processEndTag(token)
          break
        case HTMLToken::Comment:
          processComment(token)
          break
        case HTMLToken::Character:
          processCharacter(token)
          break
        case HTMLToken::EndOfFile:
          processEndOfFile(token)
          break
      }
    }
  ```
  >  HTMLConstructionSite中存在一个`HTMLElementStact`的变量。这个变量是一个栈，因为HTML标签的特点是有成对出现的，所以采用了栈的数据类型来储存数据节点
  
  [合法括号](https://leetcode-cn.com/problems/valid-parentheses/)
  
    ![页面从字节流到DOM树的创建过程](/Users/koolearn/Documents/loneliness/typescript/JavaScript/JavaScript/分享/浏览器如何解析HTML/image/页面从字节流到DOM树的创建过程.jpg)

## [DOM](https://dom.spec.whatwg.org/)
Document Object Model 文档对象模型，可以独立于平台和语言，访问和修改文档内容以及结构。除了HTML意外还有XML、XHTML。DOM定义的是一组与平台和语言无关的接口。用DOM表示的文档被描述成一个属性接口，使用DOM接口可以对DOM树进行操作。

### DOM节点
HTML的节点都遵行DOM标准，一切的基础都是Node类，Node类是一切其他类的基类，而Node类继承了EventTarget类和ScriptWrappable类

![节点类的继承](/Users/koolearn/Documents/loneliness/typescript/JavaScript/JavaScript/分享/浏览器如何解析HTML/image/节点类的继承.jpg)

```
interface Node : EventTarget {
  const unsigned short ELEMENT_NODE = 1
  const unsigned short ATTRIBUTE_NODE = 2
  const unsigned short TEXT_NODE = 3
  const unsigned short CDATA_SECTION_NODE = 4
  const unsigned short ENTITY_REFERENCE_NODE = 5 // legacy
  const unsigned short ENTITY_NODE = 6 // legacy
  const unsigned short PROCESSING_INSTRUCTION_NODE = 7
  const unsigned short COMMENT_NODE = 8
  const unsigned short DOCUMENT_NODE = 9
  const unsigned short DOCUMENT_TYPE_NODE = 10
  const unsigned short DOCUMENT_FRAGMENT_NODE = 11
  const unsigned short NOTATION_NODE = 12 // legacy
  readonly attribute unsigned short nodeType
  readonly attribute DOMString nodeName

  readonly attribute USVString baseURI

  readonly attribute boolean isConnected
  readonly attribute Document? ownerDocument
  Node getRootNode(optional GetRootNodeOptions options = {})
  readonly attribute Node? parentNode
  readonly attribute Element? parentElement
  boolean hasChildNodes()
  [SameObject] readonly attribute NodeList childNodes
  readonly attribute Node? firstChild
  readonly attribute Node? lastChild
  readonly attribute Node? previousSibling
  readonly attribute Node? nextSibling

  [CEReactions] attribute DOMString? nodeValue
  [CEReactions] attribute DOMString? textContent
  [CEReactions] undefined normalize()

  [CEReactions, NewObject] Node cloneNode(optional boolean deep = false)
  boolean isEqualNode(Node? otherNode)
  boolean isSameNode(Node? otherNode) // legacy alias of ===

  const unsigned short DOCUMENT_POSITION_DISCONNECTED = 0x01
  const unsigned short DOCUMENT_POSITION_PRECEDING = 0x02
  const unsigned short DOCUMENT_POSITION_FOLLOWING = 0x04
  const unsigned short DOCUMENT_POSITION_CONTAINS = 0x08
  const unsigned short DOCUMENT_POSITION_CONTAINED_BY = 0x10
  const unsigned short DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 0x20
  unsigned short compareDocumentPosition(Node other)
  boolean contains(Node? other)

  DOMString? lookupPrefix(DOMString? namespace)
  DOMString? lookupNamespaceURI(DOMString? prefix)
  boolean isDefaultNamespace(DOMString? namespace)

  [CEReactions] Node insertBefore(Node node, Node? child)
  [CEReactions] Node appendChild(Node node)
  [CEReactions] Node replaceChild(Node node, Node child)
  [CEReactions] Node removeChild(Node child)
}

```
```
interface Document : Node {
  constructor()

  [SameObject] readonly attribute DOMImplementation implementation
  readonly attribute USVString URL
  readonly attribute USVString documentURI
  readonly attribute DOMString compatMode
  readonly attribute DOMString characterSet
  readonly attribute DOMString charset // legacy alias of .characterSet
  readonly attribute DOMString inputEncoding // legacy alias of .characterSet
  readonly attribute DOMString contentType

  readonly attribute DocumentType? doctype
  readonly attribute Element? documentElement
  HTMLCollection getElementsByTagName(DOMString qualifiedName)
  HTMLCollection getElementsByTagNameNS(DOMString? namespace, DOMString localName)
  HTMLCollection getElementsByClassName(DOMString classNames)

  [CEReactions, NewObject] Element createElement(DOMString localName, optional (DOMString or ElementCreationOptions) options = {})
  [CEReactions, NewObject] Element createElementNS(DOMString? namespace, DOMString qualifiedName, optional (DOMString or ElementCreationOptions) options = {})
  [NewObject] DocumentFragment createDocumentFragment()
  [NewObject] Text createTextNode(DOMString data)
  [NewObject] CDATASection createCDATASection(DOMString data)
  [NewObject] Comment createComment(DOMString data)
  [NewObject] ProcessingInstruction createProcessingInstruction(DOMString target, DOMString data)

  [CEReactions, NewObject] Node importNode(Node node, optional boolean deep = false)
  [CEReactions] Node adoptNode(Node node)

  [NewObject] Attr createAttribute(DOMString localName)
  [NewObject] Attr createAttributeNS(DOMString? namespace, DOMString qualifiedName)

  [NewObject] Event createEvent(DOMString interface) // legacy

  [NewObject] Range createRange()

  // NodeFilter.SHOW_ALL = 0xFFFFFFFF
  [NewObject] NodeIterator createNodeIterator(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null)
  [NewObject] TreeWalker createTreeWalker(Node root, optional unsigned long whatToShow = 0xFFFFFFFF, optional NodeFilter? filter = null)
}

```

HTML接口文档的定义

```
  interface HTMLDocument : Document {
              attribute DOMString         title
    readonly  attribute DOMString         referrer
    readonly  attribute DOMString         domain
    readonly  attribute DOMString         URL
              attribute DOMString         body
    readonly  attribute HTMLCollection    image
    readonly  attribute HTMLCollection    applets
    readonly  attribute HTMLCollection    links
    readonly  attribute HTMLCollection    forms
    readonly  attribute HTMLCollection    anchors
              attribute HTMLCollection    cookie
    void      open()
    void      close()
    void      write()
    Element   getElementById()
    NodeList  getElementsByName()
  }
```

### DOM事件
以下是DOM标准中的EventTarget接口的定义
```
  interface EventTarget {
    constructor()

    void addEventListener(DOMString type, EventListener? callback, optional (AddEventListenerOptions or boolean) options = {})

    void removeEventListener(DOMString type, EventListener? callback, optional (EventListenerOptions or boolean) options = {})

    boolean dispatchEvent(Event event)
  }
```
DOM标准中的Event接口定义
```
interface Event {
  constructor(DOMString type, optional EventInit eventInitDict = {})

  readonly attribute DOMString type
  readonly attribute EventTarget? target
  readonly attribute EventTarget? srcElement // legacy
  readonly attribute EventTarget? currentTarget
  sequence<EventTarget> composedPath()

  const unsigned short NONE = 0
  const unsigned short CAPTURING_PHASE = 1
  const unsigned short AT_TARGET = 2
  const unsigned short BUBBLING_PHASE = 3
  readonly attribute unsigned short eventPhase

  void stopPropagation()
           attribute boolean cancelBubble // legacy alias of .stopPropagation()
  void stopImmediatePropagation()

  void attribute boolean bubbles
  void attribute boolean cancelable
           attribute boolean returnValue  // legacy
  void preventDefault()
  readonly attribute boolean defaultPrevented
  readonly attribute boolean composed

  [LegacyUnforgeable] readonly attribute boolean isTrusted
  readonly attribute DOMHighResTimeStamp timeStamp

  void initEvent(DOMString type, optional boolean bubbles = false, optional boolean cancelable = false) // legacy
}
```

![事件种类](/Users/koolearn/Documents/loneliness/typescript/JavaScript/JavaScript/分享/浏览器如何解析HTML/image/事件种类.jpg)

浏览器的事件有很多种有UIEvent、CustomEvent、MutationEvent等等，与用户交互有关的事件是UIEvent，用于处理鼠标，键盘等事件
[w3cEventTypes](https://w3c.github.io/uievents/#event-types)

## 彩蛋：
Node的节点为什么要继承ScriptWrappable类
因为所有暴露给JavaScript的类都必须从ScriptWrappable继承。
任何一个继承了ScriptWrappable的变量都要通过宏DEFINE_WRAPPERTYPEINFO来为这个对象扩充功能，
DEFINE_WRAPPERTYPEINFO会为当前的类添加了一个静态对象WrapperTypeInfo。
我们注册的那些函数，方法，属性，都通过一层层的包装，`包装成v8里面的一些对象和结构体`，**最终存储在了s_wrapperTypeInfo这个静态变量里面了**。每一个可以在js中访问的对象，变量，属性，方法，都需要保存到WrapperTypeInfo中才能与Js进行交互
也就是说fram，wiindow，document，navigator，css所有的动画变量等等，都需要通过这样的宏生成一个包装对象，等到合适的时机通过wrap来将这些注册到V8context中
[Type information ("ScriptWrappable")](https://www.chromium.org/developers/web-idl-interfaces)