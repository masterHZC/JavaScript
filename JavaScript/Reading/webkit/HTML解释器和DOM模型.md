# HTML解释器和DOM模型
## DOM模型
Document Object Model 文档对象模型，可以独立于平台和语言，访问和修改文档内容以及结构。除了HTML意外还有XML、XHTML。DOM定义的是一组与平台和语言无关的接口。用DOM表示的文档被描述成一个属性接口，使用DOM接口可以对DOM树进行操作。

## DOM树
DOM结构构成的基本要素是“节点”，而文档的DOM接口就是有层次话的节点构成的。在DOM模型中，节点的概念非常宽泛，整个文档就是一个节点，HTML标签也是一个节点（元素节点），属性节点，注释节点等
```
  interface Document: Node {
    readonly attribute    DocumentType          doctype
    readonly attribute    DOMImplementation     implementation
    readonly attribute    Element               documentElement
    Element               createElement
    DocumentFragment      createDocumentFragement
    Text                  createTextNode  
    Comment               createComment
    CDATASection          createCDATASection
    ProcessingInstruction createProcessingInstruction
    Attr                  createAttribute
    EntityReference       createEntityReference
    NodeList              getElementsByTagName
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

## HTML解释器
HTML解释器的工作就是将网络或者本地磁盘中的HTML页面和资源字符流结束成DOM树结构。
字节流 -> 字符流 -> Token -> 节点 -> DOM树
iframe 属于 “Frame” 类，document 属于“HTMLDocument”类，而“HTMLDocument”类继承于“Document”类，所以“HTMLDocument”类也遵循DOM标准。（Document有两个子类，另一个是XMLDocument）
+ 解析整个资源用到的类
  `DocumentLoader`类帮助加载HTML文档并从字节流到构建DOM树。
  `DocumentWriter`类，是一个辅助类，会创建DOM树的跟节点HTMLDocument对象。
  `HTMLDocumentParser`类，是一个管理器，其中包含：`HTMLTokenizer`类从字符串到Token的词法解析器，然后经过XSSAuditor进行检测，最后通过`HTMLTreeBuilder`类输出DOM树
  `HTMLTreeBuiler`类是DOM树的创建工具。这个类会讲每一个Token创建成一个个节点对象，然后借助`HTMLConstructionSite`类将这些节点创建成一棵DOM树
  `ResourceLoader`和`CachedRawResourse`两个类在收到网络栈的数据后，调用`DocumentLoader`类的中的方法，通过DocumentWriter创建一个根节点HTMLDocument对象，然后将数据“append”到HTMLDocumentParser对象，解析成Token之后创建节点对象，再以HTMLDocument对象为跟节点展示

## 词法解析
  + 检测编码格式
    如果在HTML中找到设置的编码格式，就会使用相应的解码器来将字节流转成特定的格式的字符串，如果没有就通过`HTMLTokenizer`类来直接进行词法分析。

  + 词法解析
    词法分析的工作都是通过`HTMLTokenizer`类来完成的，这个解析的工具就是一个状态机：输入字符串，输出Token。字节流可能是分段的，所以输出的字符串也可能是分段的。生成Token之后，需要使用XSSAuditor来检测Token Stream，可能会阻碍某些内容进一步执行

  + 词语到节点
    Token经过XSSAuditor 过滤之后没有被过滤调的Token将会被创建成DOM节点。
    `HTMLDocumentParser`类会调用`HTMLTreeBuilder`类来处理HTMLToken的6中类型：DOCTYPE、StartTag、EndTag、Comment、Character、EndOfFile
  ```
    void HTMLTreeBuilder::processToken() {
      switch(token -> type()) {
        case HTMLToken::Uninitailized:
          ...
          break
        case HTMLToken::DOCTYPE:
          ...
          break
        case HTMLToken::StartTag:
          ...
          break
        case HTMLToken::EndTag:
          ...
          break
        case HTMLToken::Comment:
          ...
          break
        case HTMLToken::Character:
          ...
          break
        case HTMLToken::EndOfFile:
          ...
          break
      }
    }
  ```

## 节点到DOM树
从节点到DOM树的构建，包含了从元素节点到创建属性节点等工作由`HTMLConstrutionSite`类完成。在DOM中包含一个HTMLDocument对象，作为跟节点，其余元素都是它的后代。
因为HTML文档的tag有开始和结束标记，所以这一个过程可以使用栈结构来处理。所以HTMLConstructionSite类中包含一个`HTMLElementStack`的变量，来保存元素节点的栈。
```html
  <body>
    <div>
      <img>
      </img>
    </div>
  </body>
```
  上面的数据结构当遇到开始的tag类型时，将标记压入栈中，当遇到结束tag时，将最近的完成tag标签弹出栈。
DOM表中定义的所有的节点类型都是继承子Node类型。而Node类型继承自EventTarget类，所有Node节点可以接受事件，同时Node节点还继承自ScriptWrappable，与JS引擎相关。

## 线程化的解释器 118
浏览器利用单独的线程来解析HTML文档，在浏览器中，网络资源的字节流通过I/O线程传递给渲染线程之后，所有的解析、布局和渲染等工作都是在渲染线程完成的。DOM树只能在渲染线程上创建和访问。
当字符串传递给HTMLDocumentParser类之后，在内部创建一个BackgroundHTMLParser对象来负责处理。然后浏览器会创建一个新的HTMLParserThread，该线程负责将字符串解析成Token然后经过XSSAuditor过滤，最后分批次的将Token stream传递给渲染线程

## 问题
1. Node类继承EventTarget类，是为了接受事件，那么Node节点继承ScriptWrappable类做了什么
```
1. IDL：定义接口
2. Binding：WebKit动态成与其他框架（JavaScriptCore，V8）整合的代码
本身JavaScript上面是并不存在 window 这个变量的，但是之所以在JavaScript中可以访问到是因为，v8将每一个继承了ScriptWrappable类的对象，都通过DEFINE_WRAPPERTYPEINFO宏来对该对象进行一次包装，也就是说我们注册的函数，方法，属性都是包装成了v8里面的一些对象和结构，s_wrapperTypeInfo 这个静态变量里面。每一个ScriptWrappable的对象，即每一个可以在js中访问交互的对象，变量，属性，方法都需要通过这样的方法保存到WrapperTypeInfo中
```
```
const WrapperTypeInfo& DOMWindow::s_wrapperTypeInfo = V8Window::wrapperTypeInfo;
```
```
class EventTarget : public ScriptWrappable { //所有暴露给JavaScript的类都必须从ScriptWrappable继承。
    DEFINE_WRAPPERTYPEINFO() //所有具有IDL文件的类都必须具有此宏。
}

class Node : public EventTarget {

  Node* firstChild() const {return first_child_ }
}
```

## 文章
1. ScriptWrappable类：
  https://huangong.gitbooks.io/art_as_programer/content/meet_chromium/what-happend-when-you-call-windowclose.html
  https://www.chromium.org/developers/web-idl-interfaces
  https://www.hutrua.com/blog/2018/08/18/how-blink-works.html
  https://zhuanlan.zhihu.com/p/40647281
2. Blink是如何工作的：
  https://www.hutrua.com/blog/2018/08/18/how-blink-works.html
3. HTML标准：
  https://html.spec.whatwg.org/multipage/webappapis.html#event-loops
4. DOM标准：
  https://dom.spec.whatwg.org/