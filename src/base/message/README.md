## mix.core.base.Message
==========

提供基本的事件添加、移除和触发功能。



模块依赖
---------------
Reset, Class


使用说明
------------------

使用` Message `有两种方式，一种是直接实例化：
```javascript
define(function(require) {
    var Message = require('message');

    var object = new Message();
    object.on('expand', function() {
        alert('expanded');
    });

    object.trigger('expand');
});
```
另一种是将` Message `混入`（mix-in）`到其他类中：
```javascript
define(function(require) {
    var Message = require('message');

    function Dog() {
    }
    Message.mixTo(Dog);

    Dog.prototype.sleep = function() {
        this.trigger('sleep');
    };

    var dog = new Dog();
    dog.on('sleep', function() {
        alert('狗狗睡得好香呀');
    });

    dog.sleep();
});
```
上面的例子已经展现了` on`  `trigger`  `mixTo` 等方法的基本用法，下面详细阐述所有 API.

`on object.on(event, callback, [context])`

给对象添加事件回调函数。

可以传入第三个参数` context `来改变回调函数调用时的` this `值：

`post.on('saved', callback, that);`

注意：event 参数有个特殊取值：all. 对象上触发任何事件，都会触发 all 事件的回调函数，传给 all 事件回调函数的第一个参数是事件名。例如，下面的代码可以将一个对象上的所有事件代理到另一个对象上：

```javascript
proxy.on('all', function(eventName) {
    object.trigger(eventName);
});
off object.off([event], [callback], [context])
```
从对象上移除事件回调函数。三个参数都是可选的，当省略某个参数时，表示取该参数的所有值。例子：

```javascript
// 移除 change 事件上名为 onChange 的回调函数
object.off('change', onChange);

// 移除 change 事件的所有回调函数
object.off('change');

// 移除所有事件上名为 onChange 的回调函数
object.off(null, onChange);

// 移除上下文为 context 的所有事件的所有回调函数
object.off(null, null, context);

// 移除 object 对象上所有事件的所有回调函数
object.off();
trigger object.trigger(event, [*args])
```
触发一个或多个事件（用空格分隔）。*args 参数会依次传给回调函数。

注意：`on `和 `off `的 `event` 参数也可以表示多个事件（用空格分隔），比如：

```javascript
var obj = new Message();

obj.on('x y', fn);

// 等价：
obj.on('x').on('y');
mixTo Message.mixTo(receiver)
```


将` Message` 的原型方法混入到指定对象或函数原型中。



测试用例
------------------
http://aralejs.org/lib/events/tests/runner.html


性能对比
-----------------------------
http://jsperf.com/events-perfs
