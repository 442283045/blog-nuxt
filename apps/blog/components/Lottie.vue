<!-- components/Lottie.vue -->
<script setup lang="ts">
import type { AnimationItem, BMEnterFrameEvent } from 'lottie-web'
import lottie from 'lottie-web'
import { onMounted, onUnmounted, ref } from 'vue'

const lottie_canvas = ref()
let flag = 0
let animation: AnimationItem

function playAnimation() {
  if (animation.currentFrame !== 0 && flag === 0) {
    // 动画未播放完成时，用户取消点赞
    animation.removeEventListener('enterFrame', handleFrame)
    return animation.goToAndStop(0, true)
  }
  else if (animation.currentFrame === 0) {
    // 开始点赞
  }
  else {
    // 完成点赞动画后，用户取消点赞

    return animation.goToAndStop(0, true)
  }
  animation.goToAndPlay(0)

  animation.addEventListener('enterFrame', handleFrame)

  function handleFrame(e: BMEnterFrameEvent) {
    if (Math.round(e.currentTime) === 50) {
      animation.pause()
      flag = 1
      animation.removeEventListener('enterFrame', handleFrame)
    }
  }
}
onMounted(() => {
  animation = lottie.loadAnimation({
    container: lottie_canvas.value,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/like.json', // Replace this with the path to your Lottie JSON file
  })
  // animation.goToAndStop(50, true)
  animation.goToAndStop(0, true)
  animation.addEventListener('complete', () => {
    // animation.pause()

    animation.goToAndStop(0, true)
  })
})

onUnmounted(() => {
  animation.removeEventListener('complete', () => {
    animation.pause()
  })
  animation.destroy()
})
</script>

<template>
  <div

    ref="lottie_canvas"
    h-10
    w-10 cursor-pointer fill-black @click="playAnimation"
  />
</template>

<style scoped>
.dark div :deep(rect) {
    fill: #181a1b;
}
</style>
