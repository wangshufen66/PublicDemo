https://www.cnblogs.com/zhuzhenwei918/p/7463329.html

#### 什么是DOM？

　　DOM即文档对象模型，Document Object Model。  是HTML和XML文档的编程接口。它提供了对文档的结构化的表述，并定义了一种方式可以使从程序中对该结构进行访问，从而改变文档的结构，样式和内容。DOM 将文档解析为一个由节点和对象（包含属性和方法的对象）组成的结构集合。简言之，它会将web页面和脚本或程序语言连接起来。

　　实际上，DOM就是浏览器为JavaScript提供的一系列的接口（由window.document提供），通过这些接口，我们可以操作web页面。 　　
　　另外，DOM也可以给其他语言提供操作接口的，比如python。 这里，作为前端，我们只谈JavaScript。 

一般，我们可以从DOM节点的创建、查询、更改、删除、属性操作等方面来谈DOM的api，这样更具有逻辑性。

#### DOM 创建

　　DOM节点往往是一个标签、文本或者属性等，我们可以通过元素的nodetype属性来判断这个节点的类型，下面是常见的：

- Element --- 元素，nodeType的值为1。
- Attribute --- 属性， nodeType的值为2。
- Text --- 文本，nodeType的值为3.

　　基本创建方式如下：

```
var el1 = document.createElement('div');
var el2 = document.createElement('input');
var node = document.createTextNode('hello world!');
```

#### DOM 查询

　　元素查询的API返回的结果是DOM节点或者是DOM节点的列表，document提供了下面几种查询方法：

```
// 返回当前文档中第一个类名为 "myclass" 的元素
var el = document.querySelector(".myclass");

// 返回一个文档中所有的class为"note"或者 "alert"的div元素
var els = document.querySelectorAll("div.note, div.alert");

// 获取元素
var el = document.getElementById('xxx');
var els = document.getElementsByClassName('highlight');
var els = document.getElementsByTagName('td');
```

**另外，Element也提供了很多相对于元素的DOM导航方法：**

```
// 获取父元素、父节点
var parent = ele.parentElement;
var parent = ele.parentNode;

// 获取子节点，子节点可以是任何一种节点，可以通过nodeType来判断
var nodes = ele.children;    

// 查询子元素
var els = ele.getElementsByTagName('td');
var els = ele.getElementsByClassName('highlight');

// 当前元素的第一个/最后一个子元素节点
var el = ele.firstChild;
var el = ele.firstElementChild;

var el = ele.lastChild;
var el = ele.lastElementChild;

// 下一个/上一个兄弟元素节点
var el = ele.nextSibling;
var el = ele.nextElementSibling;

var el = ele.previousSibling;
var el = ele.previousElementSibling;
```

#### DOM 更改

```
// 添加、删除子元素
ele.appendChild(el);
ele.removeChild(el);

// 替换子元素
ele.replaceChild(el1, el2);

// 插入子元素
parentElement.insertBefore(newElement, referenceElement);
```

#### 属性操作

```
// 获取一个{name, value}的数组
var attrs = el.attributes;

// 获取、设置属性
var c = el.getAttribute('class');
el.setAttribute('class', 'highlight');

// 判断、移除属性
el.hasAttribute('class');
el.removeAttribute('class');

// 是否有属性设置
el.hasAttributes();  
```

#### 常见的面试问题

### innerHTML与outerHTML的区别？

DOM元素的`innerHTML`, `outerHTML`, `innerText`, `outerText`属性的区别也经常被面试官问到， 比如对于这样一个HTML元素：`<div>content<br/></div>`。

```
innerHTML：内部HTML，content<br/>；
outerHTML：外部HTML，<div>content<br/></div>；
innerText：内部文本，content ；
outerText：内部文本，content ；
```

上述四个属性不仅可以读取，还可以赋值。`outerText`和`innerText`的区别在于`outerText`赋值时会把标签一起赋值掉，另外`xxText`赋值时HTML特殊字符会被转义。

![img](https://images2017.cnblogs.com/blog/1044137/201709/1044137-20170901151324577-913203711.gif)
