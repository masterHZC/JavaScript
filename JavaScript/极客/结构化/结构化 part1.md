# 结构化

## 事件循环
```Objective-C
#import <Foundation/Foundation.h>
#import <JavaScriptCore/JavaScriptCore.h>

int main(int argc, const char * argv[]) {
  @autoreleasepool {
    // JS 引擎
    JSContext* content = [[JSContext alloc] init];
    JSValue* result;

    // 事件循环 在JS引擎之外
    while(true) {
      char sourcecode[1024];

      scanf("%s", &sourcecode); // 等待下一个事件
      NSString* code = [NSString stringWithUTF8String:sourcecode];

      result = [context evaluateScript:code];

      NSLog(@"%@", [result toString])

    }
  }
  return 0
}

```
通过上述oc代码中可以看到，JavaScript引擎与整个事件循环是分离的。在事件循环的中的大部分事件都是在做等待，等待下次事件的到来。
### JavaScript有几种方式将代码传递给运行环境
JavaScript有三种方式将代码传递给运行环境
```html
<script>
  var a = 1
  a++
</script>

```
```html
<script type="module">
  var a = 1
  a++;
</script>
```
```js
setTimeout(function () {

}, 1000)
```