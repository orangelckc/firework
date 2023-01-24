<script lang='ts' setup>
import { ref, onMounted } from 'vue';
import { getRandom, generateStars, Spark, animationEffect } from "./firework";

import type { Star } from "./types";

// 绘制烟花的canvas
const canvasRef = ref<HTMLCanvasElement>()

// 背景的星星
const stars = ref<Star[]>([])

const count = ref(0)

// 绘制烟花
const drawFirework = () => {
  // TODO 此处调用弹幕接口，获取弹幕内容
  const text = `🏮新年快乐！${count.value++}🏮`;

  // 创建随机烟花
  let spark = new Spark(canvasRef.value!, text, '#e9c9a0');

  // 播放动画
  animationEffect(spark)
}

onMounted(() => {
  // 获取屏幕的宽高, 初始化canvas
  const wW = canvasRef.value!.width = window.innerWidth;
  const wH = canvasRef.value!.height = window.innerHeight;
  // 生成背景闪烁的星星
  stars.value = generateStars(getRandom(40, 120), wW, wH);
})

</script>

<template>
  <div class="main">
    <!-- 背景：流星与闪烁的星星 -->
    <div style="z-index: 0;">
      <div v-for="star, index in stars" :key="index" :class="star.class" :style="star.style"> </div>
    </div>

    <button @click="drawFirework">发射烟花</button>

    <!--烟花-->
    <canvas ref="canvasRef" style="z-index: 98;">
      您的浏览器不支持canvas标签。
    </canvas>
  </div>

</template>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: #161929;
  position: relative;
  overflow: hidden;
  user-select: none;
}

/* 小烟花 */
.spark {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  position: absolute;
  background-color: rgba(231, 200, 160, 0.8);
  box-shadow: 0 0 40px 0 rgba(231, 200, 160, 0.8);
  animation: glow 5s infinite;
}

/* 中等烟花 */
.medium-spark {
  width: 7px;
  height: 7px;
}

/* 大烟花 */
.big-spark {
  width: 10px;
  height: 10px;
  box-shadow: 0 0 40px 0 #e9c9a0, 0 0 20px 0 #FFFFFF, inset 0 0 4px #FFFFFF;
}

/* 闪烁的辉光 */
@keyframes glow {
  0% {
    opacity: 0.9;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    opacity: 0.9;
  }
}
</style>
