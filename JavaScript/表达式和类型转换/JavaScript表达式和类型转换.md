## Grammar
Tree vs Priority 

### Expressions

#### Member
  + a.b
  + a\[b\]
  + foo`string`
  + super.b
  + super['b']
  + new.target
  + new Foo()

#### New
  + new Foo

#### Call
  + foo()
  + super()
  + foo()['b']
  + foo().b
```js
  // Example: 
  new a()['b']
```

#### Left Hand Side & Right Hand Side
  + LeftHandSideExpression
```
  LeftHandSideExpression[Yield, Await] :
    NewExpression[?Yield, ?Await] 
    CallExpression[?Yield, ?Await]
  
  ## LeftHandSideExpression 在语法上必须返回一个 refrence 类型
```

#### Update
  + a ++
  + a --
  + -- a
  + ++ a
```
  ## LeftHandSideExpression [no LineTerminator] ++
                            [no LineTerminator] --
```
```js
  var a = 0, b = 1, c = 2;
  a
  ++
  b
  ++
  c

  console.log([a, b, c])
```

#### Unary(单个运算符)
  + delete a.b
  + void foo()
```js
  void (function () {
    return a()
  })()

```
  + typeof a
  + \+ a
  + \- a
  + ~ a
  + ! a
  + await a
```
  语句使用 if else
  表达式使用三元表达式
```

#### Boxing & Unboxing
  + ToPrimitive
  + toString valueOf

```
  constructor
  prototype
  __proto__
  instanceof
```

Boxing: String、Number、Boolean、Symbol类型转化成对象类型
Unboxing(引式转换的过程): Symbol.toPrimitive || valueOf > toString
> 如果有toPrimitive，只调用Primitive；如果没有toPrimitive，调用valueOf和toString

```js
  1 + {[Symbol.toPrimitive](){return 1}, valueOf(){return 2}, toString(){return 3}}
  // 2
  1 + {[Symbol.toPrimitive](){return {}}, valueOf(){return 2}, toString(){return 3}}
  // TypeError: Cannot convert object to primitive value
  1 + {valueOf(){return {}}, toString(){return 3}}
  // 4
  1 + {valueOf(){return {}}, toString(){return {}}}
  // TypeError: Cannot convert object to primitive value
```

### question

StringToNumber

NumberToString

