---
title: 'CSS property'
description: 'meta description of the page'
article_id: 2
---
Learn how to use @nuxt/content.
<!--more-->
#### 1. text-decoration

text-decoration 这个 CSS 属性是用于设置文本的修饰线外观的（下划线、上划线、贯穿线/删除线 或 闪烁）它是 text-decoration-line, text-decoration-color, text-decoration-style, 和新出现的 text-decoration-thickness 属性的缩写。

```css
text-decoration-line:   none | underline | overline | line-through;
text-decoration-color:  (color);
text-decoration-style:  solid | double | dotted | dashed | wavy;
text-decoration-thickness: auto | from-font | (length);

text-decoration: underline red dotted 2px;
```

#### 2. animation

属性是 animation-name，animation-duration, animation-timing-function，animation-delay，animation-iteration-count，animation-direction，animation-fill-mode 和 animation-play-state 属性的一个简写属性形式。

```css
animation-name:   <string>;

animation-duration:  <time>;

animation-timing-function: ease | ease-in | ease-in-out | ease-out | linear | step-start | step-end
| cubic-bezier(0.1, 0.7, 1.0, 0.1); | steps(4, end) | frames(10) | inherit | initial | unset;

animation-delay:  <time>;

animation-iteration-count: <number> | infinite;

animation-direction: normal(default) | alternate | reverse | alternate-reverse;

animation-fill-mode: none | forwards | backwards | both;

animation-play-state: running | paused | inherit | initial | unset;
```

#### 3. transition

```css
/* property name | duration | timing function | delay */
transition: margin-right 4s ease-in-out 1s;

/* Apply to 2 properties */
transition: margin-right 4s, color 1s;
```

#### 4. background

> 以下所有属性都可以利用逗号分隔以指定多个背景的样式

+ background-attachment

  + scroll: 默认值,背景图是相对于元素自身固定
  + fixed: 背景图像对于视口固定
  + local: 背景图是相对于元素自身内容定位

+ background-clip

  + border-box: 默认属性,边框也会显示背景,只有在边框透明或虚线边框时且 `background-origin` 为 `border-box` 时能看见边框背景
  + content-box: 只有元素内容才显示背景
  + padding-box: 边框不显示背景
  + text: 只有元素内的文字才显示背景,文字需为透明才能看见背景

+ background-origin

  + border-box: 背景图片是以边框的左上角为原点
  + padding-box: 默认属性,以边框以内的左上角为原点
  + content-box: 以内容的左上角为原点

+ background-size

  + auto: 默认,保持图片原有尺寸
  + contain: 包含,保持长宽比,元素可能留有空白
  + cover: 常用,保持长宽比,图片可能显示不完全
  + 单个值: 指定图片的宽度,高度隐式为 `auto`,百分比相对于父元素宽度
  + 两个值: 第一个值指定宽度,第二个值指定高度

+ background-color

  + color: 指定一个颜色值
  + transparent: 透明

+ background-image

  ```
  在绘制时，图像以 z 方向堆叠的方式进行。先指定的图像会在之后指定的图像上面绘制。因此指定的第一个图像“最接近用户”。
  
  然后元素的边框 border 会在它们之上被绘制，而 background-color 会在它们之下绘制。
  ```

  + url(): 指定背景图片的url

  + gradient: 指定一个渐变

#### 5. point-events

pointer-events CSS 属性指定在什么情况下 (如果有) 某个特定的图形元素可以成为鼠标事件的 target

除了指示该元素不是鼠标事件的目标之外，值`none`表示鼠标事件“穿透”该元素并且指定该元素“下面”的任何东西==(非常有用)==

```
/* Keyword values */
pointer-events: auto;
pointer-events: none;
pointer-events: visiblePainted; /* SVG only */
pointer-events: visibleFill;    /* SVG only */
pointer-events: visibleStroke;  /* SVG only */
pointer-events: visible;        /* SVG only */
pointer-events: painted;        /* SVG only */
pointer-events: fill;           /* SVG only */
pointer-events: stroke;         /* SVG only */
pointer-events: all;            /* SVG only */

/* Global values */
pointer-events: inherit;
pointer-events: initial;
pointer-events: unset;
```

#### 6. user-select: none|auto|text|contain|all

> 禁止用户选中

```css
none: 禁止选中
text: 用户可以选择文本
all: 点击一次就能选中文本
contain: 允许在元素内选择, 但是, 选取将被限制在该元素的边界之上
```

#### 7. font

#### 8. outline

> outline 的作用是在元素的轮廓上绘制,不会占用空间,如果元素有边框就会绘制在边框外围,就像又加上了一层边框,如果元素没有边框,那么 outline 的效果就像是边框一样,只是不占据空间
>
> outline-offset 属性能在原有位置改变大小

#### 9. backdrop-filter

> backdrop-filter CSS 属性可以让你为一个元素后面区域添加图形效果（如模糊或颜色偏移）。 因为它适用于元素背后的所有元素，为了看到效果，必须使元素或其背景至少部分透明。

```css
/* 关键词值 */
backdrop-filter: none;

/* 指向 SVG 滤镜的 URL */
backdrop-filter: url(commonfilters.svg#filter);

/* <filter-function> 滤镜函数值 */
backdrop-filter: blur(2px);
backdrop-filter: brightness(60%);
backdrop-filter: contrast(40%);
backdrop-filter: drop-shadow(4px 4px 10px blue);
backdrop-filter: grayscale(30%);
backdrop-filter: hue-rotate(120deg);
backdrop-filter: invert(70%);
backdrop-filter: opacity(20%);
backdrop-filter: sepia(90%);
backdrop-filter: saturate(80%);

/* 多重滤镜 */
backdrop-filter: url(filters.svg#filter) blur(4px) saturate(150%);

/* 全局值 */
backdrop-filter: inherit;
backdrop-filter: initial;
backdrop-filter: unset;
```

#### 10. inset

它是 top，right，bottom，left 属性的缩写，与 margin 值具有同样的语法

#### 11. object-fit

如果一个 img 元素设置了长和宽，该属性指定图像如何适应容器，相当于背景图片的 `background-size` 属性

+ contain
+ cover
+ fill
+ none
+ scale-down

#### 12. object-position

指定图片在 img 元素中的位置

第一个值指定水平位置，第二个值指定垂直位置，百分比值有特殊的算法

```
/* <position> values */
object-position: center top;
object-position: 100px 50px;

/* Global values */
object-position: inherit;
object-position: initial;
object-position: revert;
object-position: unset;
```

#### 13. scroll-snap

相关 CSS 属性包括

+ scroll-snap-type

+ scroll-snap-align

+ scroll-snap-stop

+ scroll-padding

  父元素的偏移量

+ scroll-margin

  子元素的偏移量

详解见 <https://zhaidangwei.notion.site/CSS-e3f6ecfbf16f42a6b7dbec47b549b2c6>

#### 14. resize

类似于

#### 15. ::marker

list 的标记的选择器

#### 16. :is() :where()

#### 17: gap

flex 和 grid 都能使用

#### 18: text-underline-offset

#### 19. aspect-ratio

指定宽高比，需要先指定一个宽或高，浏览器会根据宽高比自动计算出另一个的长度。

如果已经指定了宽和高，该属性将失效

#### 20. scrollbar-gutter

```
 scrollbar-gutter: stable both-edges;
```

只有一个 auto 时为默认行为，值为 stable 时将保留右边的滚动条空间，不管有没有滚动栏出现，值为 stable both-edges 时保留两边的滚动条宽度。

#### 21. content-visibility

控制子元素是否渲染，设置为 `auto` 时可以实现长列表渲染效果。

```css
/* Keyword values */
content-visibility: visible;
content-visibility: hidden;
content-visibility: auto;

/* Global values */
content-visibility: inherit;
content-visibility: initial;
content-visibility: revert;
content-visibility: revert-layer;
content-visibility: unset;
```

`hsl()` 、`hwb()` 、`lab()` 和 `lch()` 。

`color-mix()` 和 `color-contrast()`著作权归作者所有。
这两个新增的 `lh` 和 `rlh` 与 `em` 和 `rem` 非常的相似，只不过他们相对的是 `line-height` 的值计算:- `lh` 相对于元素自己的 `line-height` 计算 - `rlh` 相对于文档根元素（`<html>` ）的 `line-height`

```
svh/svw`：小视窗高度（`height`）、宽度（`width`）的 `1%
lvh/lvw`：大视窗高度（`height`）、宽度（`width`）的 `1%
dvh/dwv`：动态视窗高度（`height`）、宽度（`width`）的 `1%
```

overscroll-behavior
