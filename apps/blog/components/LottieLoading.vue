<template>
    <div cursor-pointer ref="lottie_canvas"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import lottie from 'lottie-web'
import type { AnimationItem } from 'lottie-web'
const lottie_canvas = ref()
let animation: AnimationItem
onMounted(() => {
    animation = lottie.loadAnimation({
        container: lottie_canvas.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,

        path: '/animations/loading_two.json' // Replace this with the path to your Lottie JSON file
    })
})

onUnmounted(() => {
    animation.destroy()
})
</script>
