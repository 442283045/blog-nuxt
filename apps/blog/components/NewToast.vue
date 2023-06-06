<template>
    <div>
        <div
            ref="toast_container"
            text-white
            bg-blue
            rounded-md
            shadow-2xl
            px-3
            py-2
        >
            <div flex items-center gap-2 leading-6 max-w-80>
                <div
                    v-show="props.toast.type === 'info'"
                    text-6
                    i-tabler-info-circle
                ></div>
                <div
                    v-show="props.toast.type === 'success'"
                    text-6
                    i-tabler-circle-check
                ></div>
                <div
                    v-show="props.toast.type === 'warning'"
                    text-6
                    i-tabler-exclamation-circle
                ></div>
                <p flex-1>
                    {{ props.toast.message }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useToast from '~/stores/toast'
const toastStore = useToast()
const toast_container = ref<HTMLElement>()
const props = defineProps({
    toast: {
        type: Object,
        required: true
    }
})
setTimeout(() => {
    toastStore.clearToast(props.toast.id)
}, 3000)
onMounted(() => {
    if (!toast_container.value) {
        return
    }
    switch (props.toast.type) {
        case 'warning':
            toast_container.value.style.backgroundColor = '#F59E0B'
            break
        case 'success':
            toast_container.value.style.backgroundColor = '#10B981'
        default:
            break
    }
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: transform 20s ease;
}

.v-enter-from,
.v-leave-to {
    transform: translateX(500px);
}
</style>
