<template>
    <div class="fixed bottom-0 right-0 m-6" :class="toastType" rounded-md>
        <div class="flex items-center p-4 rounded-lg shadow-lg">
            <span font-extrabold text-white text-sm class="font-medium">
                {{ message }}
            </span>
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
