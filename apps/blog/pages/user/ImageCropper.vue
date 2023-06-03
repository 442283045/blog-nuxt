<template>
    <div ref="cropper_container" class="cropper-container"></div>
</template>
<script setup lang="ts">
import Cropper from 'cropperjs'
const cropper_container = ref<Element>()
const image = new Image()

image.src = '/cropperjs/v2/picture.jpg'
image.alt = 'Picture'

onMounted(() => {
    const cropper = new Cropper(image, {
        container: cropper_container.value
    })
    console.log(cropper)
})
</script>
