<template>
    <div
        flex
        flex-col
        items-center
        fixed
        class="top-50% left-50% -translate-y-50% -translate-x-50%"
    >
        <div class="edit_photo" h-130 bg-dark-700 flex flex-col justify-between>
            <div text-6 h-12 bg-black flex items-center text-white w-150>
                <div cursor-pointer mx-5 i-carbon-chevron-left></div>
                编辑照片
            </div>
            <div ref="cropper_container" class="cropper-container"></div>
            <div h-12 gap-4 bg-black flex items-center justify-end text-white>
                <button rounded-md px-3 bg-gray-800 h-8>Cancel</button>
                <button rounded-md @click="cropImage" px-3 bg-red-600 h-8 mr-5>
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Cropper from 'cropperjs'
import { CropperSelection, CropperCanvas } from 'cropperjs'

const cropper_container = ref<Element>()
const appConfig = useAppConfig()

const image = document.createElement('img')
image.src = appConfig.backend_url + '/photo.png'
image.alt = 'Picture'
const cropper = new Cropper(image, {
    container: cropper_container.value
})

const cropper_canvas = document.querySelector('cropper-canvas') as CropperCanvas
console.log(cropper_canvas)
onUnmounted(() => {
    cropper_canvas.remove()
})
const selection = (
    cropper_canvas.shadowRoot?.children[0] as HTMLSlotElement
).assignedNodes()[3] as CropperSelection
selection.aspectRatio = 1
selection.zoomable = false
selection.addEventListener('wheel', (e) => {
    console.log('hello')
    e.stopPropagation()
    e.preventDefault()
})
function cropImage() {
    selection.$toCanvas().then((canvas) => {
    
        canvas.toBlob((blob) => {
            if (blob === null) {
                return
            }
            const file = new File([blob], 'image.png', {
                type: 'image/png'
            })
            const formData = new FormData()
            formData.append('imageFile', file)
            useFetch('/update_profile', {
                method: 'POST',
                body: formData,
                server: false,
                credentials: 'include',
                baseURL: appConfig.backend_url
            })
        })
    })
}
// cropper_selection.aspectRatio = 1
</script>
<style>
cropper-canvas {
    width: 400px;
    height: 400px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}
</style>
