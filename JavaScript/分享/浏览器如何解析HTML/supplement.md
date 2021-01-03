# 浏览器如何解析HTML

## 问题：
1. 浏览器从接收数据到渲染出页面都经历了什么？
```
  1. HTML解析器生成DOM树，在这个过程中：
    a. 如果有Js代码交给Js引擎处理
    b. 如果有CSS 交给CSS解析器去处理
  2. DOM建立的时候，渲染引擎接收来自CSS解释器的样式信息，构建一个新的内部绘制模型（render树）。
  3. 布局模块计算该绘制模型内部各个元素的位置和大小信息
  4. 最后由绘制模块完成模型到图像的绘制

  网页在下载过程中可能会用到：网络和储存，在布局和绘制的过程中可能会调用其他模块：2D/3D、音频和视频、图片解码器等，最终生成可视化结果。在与用户的交互过程中会重复该动作，所以绘制的过程是一个持续的重复渲染
  另外，在调用Js解析器之后，又会重新调用HTML解析器处理页面信息，所以Js会引起重绘和回流
```
2. 浏览器如何处理不符合HTML规范的写法？比如：<h1>下班啦

```
https://html.spec.whatwg.org/multipage/parsing.html#unclosed-formatting-elements
```

3. dom节点为什么可以接受事件？

```
因为DOM节点的基类Node类，而Node类有继承于EventTarget类，所以所有的DOM节点都可以接受事件
```



## HTML解释器
  + HTML解释器：将HTML文本解释成DOM
  + CSS解释器：为DOM中的各个元素对象计算出样式信息，为计算最后页面的布局提供基础设施
  + 布局：DOM创建之后，将元素对象同样式信息结合，计算出它们的大小位置等布局信息，最终形成一个能后展示所有信息的内部模型
  + JavaSript引擎：解释JavaScript代码，并通过DOM接口和CSSOM接口来修改页面的内容和样式，最后改变渲染结果
  + 绘图：使用图形库将布局计算后的各个网页的节点绘制成图像

### HTML解释器的解析过程
```
 字节流 -> 字符流 -> Token -> DOM节点 -> DOM树
```
首先是字节流经过编码之后生成字符串，然后词法解析器会将字符串解析成有效的Token，再经过语法解析器构建成节点，最后创建成一个DOM树
webkit解析获取到的字节流用到了一个DocumentLoader
+ DocumentWriter类
  `DocumentWriter类`包含两个部分：一个是用于文档字符解析的字符解码类，另一个就是HTML的解析器`HTMLDocumentParser类`。
  `DocumentWriter类`会现将字节流解析成字符串，然后创建一个HTMLDocument类型的对象，这个对象就是我们HTML的跟节点。再将解析过后的字符串传递给HTML的解析器`HTMLDocumentParser类`

+ HTMLDocumentParser类
  `HTMLDocumentParser类`是一个管理类。其中包括几个部分
  1. `HTMLTokenizer类`，是HTML的词法解析器，会将字符串解析成Token。输入的字符串会输出一个Token
  2. XSSAuditor 用来做词法过滤
  3. `HTMLTreeBuilder类`来创建DOM树，这个类可以根据一个个Token创建出DOM节点。`HTMLTreeBuilder类`会调用`createHTMLElement`方法创建出DOM节点，最后`appendChild`进最初创建的`HTMLDocument`中
[Html的词法解析](https://html.spec.whatwg.org/multipage/parsing.html#parsing)

+ 检测编码格式
  解析器首先会检测网页内容所使用的编码格式，如果在页面中找到到了设置的特殊编码格式，就是使用相应的解码器来将字节流转化成特定格式字符串，如果没有特殊的设置，就会通过`HTMLTokenizer类`来直接进行词法解析

+ 词法解析
  词法解析器的本质是一个状态机，书中交代了当时存在70多种状态，但是现在标准中已经更新到了80种状态。词法解析器主要调用一个`nextToken`的方法，通过循环将字符串传入其中，处理之后输出一个Token。
  Token的类型，在浏览器定义了很少只有6种：
  ```
    DOCTYPE、StartTag、EndTag、Comment、Character、EndOfFile
  ```

+ XSSAuditor 验证词语
  通过XSSAuditor来验证Token Stream

+ 语法解析
  这一部分是通过`HTMLDocumentParser类`中的`HTMLTreeBuilder类`来处理的
  ```
    void HTMLTreeBuilder::processToken() {
      switch(token -> type()) {
        case HTMLToken::Uninitailized:
          processDoctypeToken(token)
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
  在解析成DOM节点之后调用了`HTMLConstructionSite类`来完成。
  这个类中存在一个`HTMLElementStact`的变量。这个变量一个栈，因为HTML标签的特点是有成对出现的，start tag和 end tag，遇到start tag就压入栈中，遇到end tag就弹出站

### HtmlParser


```js

```

## DOM
Document Object Model 文档对象模型，可以独立于平台和语言，访问和修改文档内容以及结构。除了HTML意外还有XML、XHTML。DOM定义的是一组与平台和语言无关的接口。用DOM表示的文档被描述成一个属性接口，使用DOM接口可以对DOM树进行操作。

### DOM模型
DOM结构构成的基本要素是“节点”，而文档的DOM接口就是有层次话的节点构成的。在DOM模型中，节点的概念非常宽泛，整个文档就是一个节点，HTML标签也是一个节点（元素节点），属性节点，注释节点等
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
  const unsigned short NOTATION_NODE = 12; // legacy
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
HTML的节点都遵行DOM标准，一切的基础都是Node类，Node类是一切其他类的基类，而Node类继承了EventTarget类和ScriptWrapple类

### DOM事件
在直接工作的过程中一共存在两个主体：一个是事件本身，另一个是事件目标，
而所有的Node节点都是继承自`EventTarget`。
每一个事件都有属性来标记该事件的事件目标，当事件达到目标的时候，在目标上注册的事件就会触发，同时触发的顺序与注册的顺序也不同

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
};
```

浏览器的事件有很多种有UIEvent、CustomEvent、MutationEvent等等，与用户交互有关的事件是UIEvent，用于处理鼠标，键盘等事件
[w3cEventTypes](https://w3c.github.io/uievents/#event-types)

// 浏览器的事件是如何处理的

## 注解：
1. ScriptWrappable类的作用是什么



https://www.cnblogs.com/qq499194341/articles/2891954.html

https://www.geek-share.com/detail/2660153541.html

https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/#The_rendering_engine