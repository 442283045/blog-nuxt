<template>
    <div class="fixed bottom-0 right-0 m-6" :class="toastType" rounded-md>
        <div class="flex items-center p-4 rounded-lg shadow-lg">
            <div class="mr-4">
                <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
            </div>
            <span class="font-medium">{{ message }}</span>
            <button class="ml-auto text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="h-6 w-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    message: String,
    type: {
        type: String,
        default: 'success'
    }
})

const toastType = ref('bg-green-500')

// watch(visible, () => {
//      if (visible.value === true) {
//         setTimeout(close, 3000)
//     }
// })
switch (props.type) {
    case 'error':
        toastType.value = 'bg-red-500'
        break
    case 'warning':
        toastType.value = 'bg-yellow-500'
        break
    default:
        toastType.value = 'bg-green-500'
        break
}
</script>

<!-- <style scoped>
.v-enter-active,
.v-leave-active {
    transition: all 0.5s;
}
.v-enter,
.v-leave-to {
    transform: translateX(120px);
}
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    transform: translateX(120px);
    background-color: aqua;
}
</style> -->
