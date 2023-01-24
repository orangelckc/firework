# 新年烟花，Vue3 + TS

目标，实现一个新年烟花，可以与弹幕互动，烟花爆开后，显示弹幕文字

## 方案一：[fireworks-js](https://github.com/crashmax-dev/fireworks-js/)

优点：简单，不用改写ts，可以看[示例](https://fireworks.js.org/)，修改配置参数

缺点：可以通过弹幕触发发射烟花，但是获取不到烟花爆开的位置，无法实现烟花爆开后，显示文字的效果

## 方案二：在Vue中内嵌 `iframe` 直接加载html文件

注意，原来的html文件连同文件夹需要一起放到 `public` 文件夹下

优点：直接使用网上已有的html文件

缺点：还是达不到与弹幕互动的需求

## 方案三：改写方案二，完全自定义canvas绘图

### 实现步骤：

1. 绘制背景星星，随机个数，随机大小，随机闪烁时间
2. 实例化烟花，随机给定爆炸的位置，大小，爆开的数量，爆开的大小，爆开的颜色
3. 运行渲染函数，绘制canvas
4. 在烟花到达终点位置，判断是否存在弹幕，如果存在，绘制弹幕


这里我没有做最后文字爆开的效果，有点搞不动了，有需要的可以自己实现



