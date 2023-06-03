<template>
    <div
        flex
        flex-col
        items-center
        fixed
        class="top-50% left-50% -translate-y-50% -translate-x-50%"
        z-20
    >
        <div
            overflow-hidden
            rounded-md
            class="edit_photo"
            h-130
            w-180
            bg-dark-700
            flex
            flex-col
            justify-between
        >
            <div text-6 h-12 bg-black flex items-center text-white>
                <div
                    @click="$emit('closeImageCropper')"
                    cursor-pointer
                    mx-5
                    i-carbon-chevron-left
                ></div>
                Edit photo
            </div>
            <div ref="cropper_container" class="cropper-container"></div>
            <div h-12 gap-4 bg-black flex items-center justify-end text-white>
                <button
                    rounded-md
                    px-3
                    bg-gray-800
                    h-8
                    @click="$emit('closeImageCropper')"
                >
                    Cancel
                </button>
                <button rounded-md @click="cropImage" px-3 bg-red-600 h-8 mr-5>
                    Apply
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import Cropper from 'cropperjs'

const cropper_container = ref<Element>()
import { CropperSelection, CropperCanvas } from 'cropperjs'
const props = defineProps<{ imageFile: File | null }>()
const appConfig = useAppConfig()

const emit = defineEmits(['closeImageCropper', 'getCroppedImage'])
const image = document.createElement('img')
console.log(props.imageFile)
if (props.imageFile) {
    console.log(props.imageFile)
    const reader = new FileReader()
    reader.readAsDataURL(props.imageFile)
    await new Promise((resolve, reject) => {
        reader.onload = (e) => {
            image.src = e.target?.result as string
            resolve(null)
        }
    })
}

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

function cropImage() {
    selection.$toCanvas().then((canvas) => {
        // const imageDataURL = canvas.toDataURL('image/png')
        // const downloadLink = document.createElement('a')
        // downloadLink.href = imageDataURL
        // downloadLink.download = 'image.png'
        // downloadLink.click()
        canvas.toBlob((blob) => {
            if (blob === null) {
                return
            }
            const file = new File([blob], 'image.png', {
                type: 'image/png'
            })
            // const formData = new FormData()
            emit('getCroppedImage', file)
            emit('closeImageCropper')
            // formData.append('imageFile', file)
            // useFetch('/update_profile', {
            //     method: 'POST',
            //     body: formData,
            //     server: false,
            //     credentials: 'include',
            //     baseURL: appConfig.backend_url
            // })
        })
    })
}
</script>
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
