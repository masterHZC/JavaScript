# 浏览器|http协议
## 输入url之后发生了什么？
```
  URL -> HTML -> DOM -> DOM with CSS -> DOM with position -> Bitmap

  URL:获取HTML代码
  HTML：解析生成DOM树
  DOM：结合CSS 生成一个带样式的DOM
  layout：带尺寸的DOM树
  render：带位置的DOM树
  Bitmap：内存模版
```

## ISO-OSI七层网络模型
```
  应用
  表示
  会话
  ------------ HTTP require('http')
  传输
  ------------ TCP/UDP require('net')
  网络
  ------------ Internet
  数据链路
  物理层
  ------------- 4G/5G/WIFI
```

## Toy-brower
http是一个文本协议，直接通过输入文本就可以解析

```
  # 文本格式
  POST / HTTP1.1
  Host: 127.0.0.1
  Content-Type: 
  Content-length

  filed=aaa&code=123!
```