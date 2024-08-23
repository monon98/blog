# 块级格式化上下文 BFC  

## 一、什么是BFC?

BFC 是 Block Formatting Context 的缩写,意为块级格式化上下文。它是浏览器的一块渲染区域,BFC 内部的元素布局不会影响外部的元素。

## 二、触发 BFC 的方式

1. float 不是 none

2. overflow 不是 visible

3. display 是 inline-block、table-cell、flex、grid 等

4. position 是 absolute 或 fixed

## 三、BFC 的特点

1. 内部的 Box 会在垂直方向一个接一个地放置。

2. 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠。

3. BFC 的区域不会与 float 的元素区域重叠。

4. 计算 BFC 的高度时,浮动元素也参与计算。

5. BFC 就是页面上的一个隔离的独立容器,容器里面的子元素不会影响外面的元素。

## 四、如何解决margin塌陷问题？

### 1. 什么是margin塌陷

margin 塌陷是指两个垂直相邻的元素,它们的 margin-top 和 margin-bottom 合并在了一起,而不是像预期的那样,相邻的 margin 会叠加。

### 2. 解决高度塌陷步骤

要解决这个问题,可以利用 BFC 的特性。如果想要两个块级元素的 margin 产生叠加效果,需要让其中一个元素生成 BFC。  
方法是:

1. 给其中一个元素设置 overflow: hidden。

2. 给其中一个元素设置 display: flex/inline-block/table-cell 等。

3. 给其中一个元素设置 float 非 none。

## 五、举例

```html
<div style="overflow: hidden;">
    <div style="margin-bottom: 20px;"></div>
</div>
<div style="margin-top: 20px;"></div>
```

说明：这里,第一个 div 生成 BFC,它内部的 margin 不会与外部发生重叠，产生 margin 叠加，效果是两个 div 之间的 margin 距离为 40px。
