<template>
    <div>
        <div text-white bg-blue rounded-md shadow-lg px-3 py-2>
            <div>
                <p>{{ props.toast.message }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import useToast from '~/stores/toast'
const toastStore = useToast()
const props = defineProps({
    toast: {
        type: Object,
        required: true
    }
})
setTimeout(() => {
    toastStore.clearToast(props.toast.id)
    console.log(props.toast.id, 'has been cleared')
    console.log(toastStore.toasts)
}, 3000)
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
