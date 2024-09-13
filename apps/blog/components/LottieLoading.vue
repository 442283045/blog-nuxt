<script setup lang="ts">
import type { AnimationItem } from 'lottie-web'
import lottie from 'lottie-web'
import { onMounted, onUnmounted, ref } from 'vue'

const lottie_canvas = ref()
let animation: AnimationItem
onMounted(() => {
  animation = lottie.loadAnimation({
    container: lottie_canvas.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,

    path: '/animations/loading_two.json', // Replace this with the path to your Lottie JSON file
  })
})

onUnmounted(() => {
  animation.destroy()
})
</script>

<template>
  <div ref="lottie_canvas" cursor-pointer />
</template>
