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
