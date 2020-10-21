# JavaScript 的词法和类型

## Number

### Number-Grammar
 + DecimalLiteral
    - 0
    - 0.
    - .2
    - 1e3
  + BinaryIntegerLiteral
    - 0b111
  + OctalIntegerLiteral
    - 0o10
  + HexIntegetLiteral
    - 0xFF

JavaScript的Number语法分为两类，分别是小数型的语法和整数型语法，其中整数型语法支持十进制、二进制、八进制以及十六进制，在es6中规范了二进制、八进制以及十六进制的写法，二进制是以0b开头，八进制是0o开头（chrome在老版本中在解析number类型的时候，只要开头是0的数字都会被解析成8进制，因为十进制是不允许0开头了大于0的整数），十六进制是以0x开头。十进制的表达方式有三种：

```js

    // 1. 十进制数 e/E n 就可以解析成当前的十进制数 x 10^n
    12.3e1       // 123
    12.3e10      // 123000000000
    12.3E10      // 123000000000
```
### Number Conversions
```
    StringNumericLiteral::
        StrWhiteSpace |
        StrWhiteSpace + StrNumericLiteral + StrWhiteSpace

    StrWhiteSpace::
        StrWhiteSpaceChar + StrWhiteSpace

    StrWhiteSpaceChar::
        WhiteSpace |
        LineTerminator

```

### Number Practice
  + Safe Integer
    Number.MAX_SAFE_INTEGER.toString(16)
  + Float Compare
    Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
## String

 + Character
 + Code Point
 + Encoding
### String 范围
  + ASCII
  + Unicode
  + UCS U+0000 - U+FFFF （BMP范围）
  + GB （国标）
    - GB2312
    - GBK(GB13000)
    - GB18030
  + ISO-8859
  + BIG5

### Encoding
  + UTF
  UTF8 和 UTF16的主要区别是储存字符的方式，UTF8是八位，UTF16是十六位，unicode规定了字符与买码点的对应，但是没有限定字符的表达方式，于是就有了UTF8，UTF16。

### Grammar
  + ''
  + ""
  + ``
```js
  // 解析 `` 字符串模版
  `i said: "${
    s1
  }", "${
    s2
  }"`
  // 一共会解析成5个部分
```

## Question
 1. 写一个正则表达式，可以匹配所有的Number 
 2. 
 ```
    0.toString()
    0 .toString()
 ```
 3. UTF8 encoding 的方法
 4. 使用正则表达式匹配两种字符串 单引号和双引号