## webkit
  渲染引擎：
    + HTML解释器：将HTML文本解释成DOM
    + CSS解释器：为DOM中的各个元素对象计算出样式信息，为计算最后页面的不仅提供基础设施
    + 布局：DOM创建之后，将元素对象同样式信息结合，计算出它们的大小位置等布局信息，最终形成一个能后展示所有信息的内部模型
    + JavaSript引擎：解释JavaScript代码，并通过DOM接口和CSSOM接口来修改页面的内容和样式，最后改变渲染结果
    + 绘图：使用图形库将布局计算后的各个网页的节点绘制成图像

-------------------------------------------------------------------------------------

## 网页渲染过程：
  1. HTML解析器生成DOM树，在这个过程中：
    a. 如果有Js代码交给Js引擎处理
    b. 如果有CSS 交给CSS解析器去处理
  2. DOM建立的时候，渲染引擎接收来自CSS解释器的样式信息，构建一个新的内部绘制模型（render树）。
  3. 布局模块计算该绘制模型内部各个元素的位置和大小信息
  4. 最后由绘制模块完成模型到图像的绘制

  网页在下载过程中可能会用到：网络和储存，在布局和绘制的过程中可能会调用其他模块：2D/3D、音频和视频、图片解码器等，最终生成可视化结果。在与用户的交互过程中会重复该动作，所以绘制的过程是一个持续的重复渲染
  另外，在调用Js解析器之后，又会重新调用HTML解析器处理页面信息，所以Js会引起重绘和回流

-------------------------------------------------------------------------------------

## 网页构成
  JavaScript代码控制网页内部的逻辑，CSS用来描述网页的显示信息。CSS的产生目的在于将页面的内容和显示分离，CSS控制显示，HTML控制内容

### 层次结构
  网页层次结构是指网页中的元素可能分布在不同的层次中，也就是说某些元素可能不在父元素所在的层次。不同的元素类型以及css属性都有可能会改变网页的布局层次。canvas、video、进行3D转换的div、都会单独的被引起创建出独立的一层。而且每一层的前后距离也是与引擎需要处理的无杂度有关。以上三种元素中，更复杂的canvas会被放在最前面

### webkit 渲染过程：
    1. 网页加载过程：URL -> 构建DOM树
    2. 网页渲染过程：DOM树 -> 可视化图像
  两个过程之间很难区分，统称为页面的渲染过程

### DOM树：
  1. “文档”节点是继承自节点类型的，所以可以使用Node的接口
  2. “文档”节点的接口是，使用IDL语言来描述的
  3. DOM的定于与语言无关，标准中所有的都是接口，支持不同类型的语言

### HTML解析器：
  从网络或者本地磁盘获取的字节流转换成字符流然后被HTML解析器解析成Token再生成DOM节点，最后组合成DOM树
  字节流 -> 字符流 -> Token -> 节点 -> DOM树
  Node类是一切属节点的基本类型， Node类继承自EventTarget，所以Node可以接受事件类型

### 事件机制：
  事件工作主要有两个主体：event、EventTarget。EventTarget用来描述DOM规范Events的部分目标事件
  每个事件 有属性 标记 该事件的 事件目标。当事件触及事件目标的时候，该目标上所注册的 Event Listeners 将会触发。
  这些 监听者 的调用顺序不固定，所以不能根据绑定顺序来处理代码逻辑

  ```
    interface EventTarget {
      void addEventListener(type, listener, useCapture)
      void removeEventListener(type, listener, useCapture)
      boolean dispatchEvent
    }
  ```
  捕获事件：document -> HTML -> body -> div stopPropagation 阻止向下传递
  冒泡事件：div -> body -> HTML -> document 可以使用 stopPropagation 阻止向上传递
  默认行为是不会冒泡的，但是事件包含一个是否冒泡的属性

## 网页的渲染过程：
  1. 数据：
    网页内容、DOM、内部表示和图像
  2. 模块：
    HTML解释器、CSS解释器、JavaScript引擎以及布局和绘图
  3. 过程：
    网页的URL构建完整DOM树 ——> DOM树到构建完WebKit绘制上下文 ——> 绘制上下文到生成最终图像

    网页的URL构建完整DOM树：
      + 从网络资源或者本地磁盘获取字节流，将字节流转化成字符流
      + 字符流经过HTML解释器解析成 Token
      + HTML解析器再将Token解析成 node节点
      + 多个节点组合成 DOM树
  
    DOM树到构建完WebKit绘制上下文:
      + CSS文件被CSS解释器解析成内部的表示结构
      + DOM树上添加 CSS解释器生成的样式信息 最后合成 RenderObject树
      + RenderObject 节点在创建的同时，webkit会根据网页的层次结构创建RenderLayer，同时创建一个虚拟的绘图上下文
      （渲染树包含两个部分：RenderObject树和RenderLayer树）
  浏览器的进程和线程(第三章)
    + 为什么采用多进程： 
      1. 避免单个页面不相应或者崩溃而影响整个浏览器
      2. 第三方插件崩溃不会影响页面或者浏览器的稳定性 （三方插件是单独的进程）
      3. 浏览器的沙箱机制（保证安全性）是基于多线程架构实现的
    + 主要进程：
      1. Browser进程：主进程，负责界面显示、各个页面的管理，是所有其他类型进程的祖先，复杂创建和销毁等工作，有且只有一个
      2. Renderer进程：渲染进程，页面渲染工作，可能有多个。
  ``` 
      Renderer进程与用户打开的页面个数是否一致？
      不一定。当打开的页面超过一定数量时，就不会重新开新的渲染进程
  ```
      3. NPAPI插件进程：该进程是为了NPAPI类型的插件而创建的
      4. Pepper插件进程：为Pepper插件而创建的进程
      5. GPU进程：最多只有一个，当且仅当开启GPU赢家加速才会被创建，主要用于3D图形加速调用实现
        通过CSS调起GPU加速：https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/
    + 进程模型的特点
      1. Browser继承和页面渲染分开，保证页面渲染导致的崩溃不会影响到浏览器主进程
      2. 每个网页是独立的，互不影响
      3. 插件进程是独立的进程，插件本身不会影响浏览器的主界面和网页
      4. GPU硬件加速独立
    + 多线程：每一个进程内部，存在多个线程。在Browser进程中，多线程的目地是卫磊保持用户界面的高相应度，保证UI线程不被其余飞逝的操作影响（文件的读写，socket读写，数据库操作）。Renderer进程中，保证浏览器的快速渲染。例如进程之间会通过I/O线程相互通信
    + 实例：74页
![chrome的多线程](/Users/koolearn/Documents/loneliness/typescript/JavaScript/JavaScript/webkit/images/chrome的多线程.jpg)



问题：
  1. RenderObject树，RenderLayer树，绘图上下文分别是什么，都做了哪些事情？
  2. 什么CSS属性会调起GPU加速？

参考资料：
  1. https://juejin.cn/post/6844904046411644941#heading-34
  2. https://developers.google.com/web/updates/2018/09/inside-browser-part1
  3. https://github.com/aimergenge/toy-html-parser
  4. https://zhuanlan.zhihu.com/p/47407398
  5. https://developers.google.com/web/updates/2018/07/site-isolation
  6. https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy
  7. GPU加速问题： https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome