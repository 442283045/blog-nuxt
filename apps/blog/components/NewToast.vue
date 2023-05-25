<template>
    <div>
        <div text-white bg-blue rounded-md shadow-lg px-3 py-2>
            <div flex items-center gap-2 leading-6 max-w-80>
                <div
                    v-show="props.toast.type === 'info'"
                    text-blue-600
                    text-6
                    i-tabler-info-circle
                ></div>
                <div
                    v-show="props.toast.type === 'success'"
                    text-green
                    text-6
                    i-tabler-circle-check
                ></div>
                <div
                    v-show="props.toast.type === 'warning'"
                    text-red
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
const props = defineProps({
    toast: {
        type: Object,
        required: true
    }
})
setTimeout(() => {
    toastStore.clearToast(props.toast.id)
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
