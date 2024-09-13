<script setup lang="ts">
import type { CropperCanvas, CropperSelection } from 'cropperjs'

const props = defineProps<{ imageFile: File | null }>()
const emit = defineEmits(['closeImageCropper', 'getCroppedImage'])
const cropper_container = ref<Element>()

const image = document.createElement('img')
if (props.imageFile) {
  const reader = new FileReader()
  reader.readAsDataURL(props.imageFile)
  await new Promise((resolve) => {
    reader.onload = (e) => {
      image.src = e.target?.result as string
      resolve(null)
    }
  })
}

image.alt = 'Picture'

const cropper_canvas = document.querySelector('cropper-canvas') as CropperCanvas
onUnmounted(() => {
  cropper_canvas.remove()
})
const selection = (
  cropper_canvas.shadowRoot?.children[0] as HTMLSlotElement
).assignedNodes()[3] as CropperSelection
selection.aspectRatio = 1
selection.zoomable = false

function cropImage() {
  selection.$toCanvas().then((canvas) => {
    canvas.toBlob((blob) => {
      if (blob === null) {
        return
      }
      const file = new File([blob], 'image.png', {
        type: 'image/png',
      })
      emit('getCroppedImage', file)
      emit('closeImageCropper')
    })
  })
}
</script>

<template>
  <div

    class="left-50% top-50% -translate-x-50% -translate-y-50%"
    fixed z-20 flex flex-col items-center
  >
    <div

      class="edit_photo"

      h-130 w-180 flex flex-col justify-between overflow-hidden rounded-md bg-dark-700
    >
      <div h-12 flex items-center bg-black text-6 text-white>
        <div
          i-carbon-chevron-left

          mx-5 cursor-pointer @click="$emit('closeImageCropper')"
        />
        编辑照片
      </div>
      <div ref="cropper_container" class="cropper-container" />
      <div h-12 flex items-center justify-end gap-4 bg-black text-white>
        <button

          h-8 rounded-md bg-gray-800 px-3
          @click="$emit('closeImageCropper')"
        >
          Cancel
        </button>
        <button mr-5 h-8 rounded-md bg-red-600 px-3 @click="cropImage">
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<style>
cropper-canvas {
    width: 400px;
    height: 400px;
    position: absolute;
    z-index: 30;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
</style>
