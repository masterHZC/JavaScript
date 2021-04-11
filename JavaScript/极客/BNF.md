BNF:
  巴科斯(-诺尔)范式，是一种描述形式语言语法的语言，上下文无关语法的表示方式之一。
语法：
```
  < >     : 内包含的为必选项。
  [ ]     : 内包含的为可选项。
  { }     : 内包含的为可重复0至无数次的项。
  |       : 表示在其左右两边任选一项，相当于"OR"的意思。
  ::=     : 是“被定义为”的意思
  "..."   : 术语符号
  [...]   : 选项，最多出现一次
  {...}   : 重复项，任意次数，包括 0 次
  (...)   : 分组
  |       : 并列选项，只能选一个
```
基本结构：
  <non-terminal> ::= <replacement>
```
  "::=" 表示 "被定义"符号
  "non-terminal" 表示 "被定义"的值，我个人理解为被分解的值。这个值一定是一个非终结符，因为这个值需要被分解或者被解释为与它等价的内容
  "replacement" 表示"替换的内容"，这个值可以由终结符组成，也可以完全由非终结符组成，是将::=左边的"non-terminal"进一步解析的产物
```
递归是BNF的一种重要的表示方式，例如：使用一种语法仅存在a,b两种字符，并且不限制排列顺序和字符限度
```
  <Program>::= 
    <Program> | <Program> <ProgramCharacter>

  <ProgramCharacter>::=
    "a" | "b"
```
```
<Expression>::=
  <Expression> | <Expression> "+" <DecimalDigits>

<DecimalDigits>::=
  <DecimalDigit> | <DecimalDigits> <DecimalDigit>

<DecimalDigit>::=
  0 | <NonZeroDigit>

<NonZeroDigit>::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

```
```
四则运算运算：
  先乘除 后加减
  被除数不能是0
<MultiplicativeExpression>::=
  <DecimalDigits> | <DecimalDigits> "*" <MultiplicativeExpression>

<AddtiveOperator>::=
  <MultiplicativeExpression> | <MultiplicativeExpression> "+" <AddtiveOperator>

<DecimalDigits>::=
  <DecimalDigit> | <DecimalDigits> <DecimalDigit>

<DecimalDigit>::=
  0 | <NonZeroDigit>

<NonZeroDigit>::= "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

<MultiplicativeOperator>::=
  "*" | "/"

```
  

