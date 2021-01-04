# 数组&链表

## 数组
 数组在内存中的表现方式。在声明一个数组的时候，内存管理器会在系统内存中开辟一系列连续的内存地址。访问每一个数组中的元素，都是相当于直接去访问系统做所开辟的内容，所以时间复杂度是O(1)的。
 数组的insert和delete时间复杂度最差是O(n), 最好是O(1)的。

## 链表
 链表的定义
```js

    class LinkedList {
        
    }

    class Node {
        constructor (data, next) {
            this.data = data
            this.next = next
        }
    }
```
 链表的insert和delete都是O(1)的复杂度，但是访问链表的元素的复杂度是O(n)的

## 跳表
  跳表的实现是在链表的基础上添加了多个指针索引，通过空间换时间的方式，加快查找
```
 n/2、n/4、n/8、第k级索引结点的个数就是n/(2^k)
 假设有h阶索引，最高级有两个结点。n/(2^h) = 2，那么h = log2(n)-1，时间复杂度是 O(logN)
 但是跳表的维护成本非常高，在每一次操作跳表的时候都需要维护相对应的索引表，所以会导致：
 1.索引表对应的元素不均匀，2.insert和delete跳表的时间复杂度不在说O(1)，而是logN


```
## key words
 1. 升维，空间换时间

## Question
 + 如何为链表加速：
  1. 多添加一个尾指针
  2. 升维创建多维链表 （跳表）
  3. 实现一个跳表
 + leetcode 146 LRU缓存机制
 + https://leetcode-cn.com/problems/container-with-most-water/
 + https://leetcode-cn.com/problems/move-zeroes/
 + https://leetcode.com/problems/climbing-stairs/
 + https://leetcode-cn.com/problems/3sum/ (高频老题）