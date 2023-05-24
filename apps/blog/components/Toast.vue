<template>
    <Transition>
        <div v-if="toastVisible" z-10 fixed bottom-5 right-5 role="alert">
            <div
                flex
                items-center
                w-full
                max-w-xs
                p-4
                text-gray-500
                bg-white
                divide-gray-200
                rounded-lg
                shadow
                dark:text-gray-400
                dark:bg-gray-800
            >
                <!-- awdawd
                <div v-show="showInfo" class="i-tabler-info-circle">
                    {{ toastMessage }}
                </div>

                <div v-show="showWarning" class="i-tabler-alert-circle">
                    {{ toastMessage }}
                </div>
                <div v-show="showSuccess" class="i-tabler-circle-check">
                    {{ toastMessage }}
                </div> -->
                <!-- toastType.value -->
                <Success v-show="toastType.value === ToastType.Success">
                    {{ toastMessage }}
                </Success>
                <Warning v-show="toastType.value === ToastType.Warning">
                    {{ toastMessage }}
                </Warning>
                <Info v-show="toastType.value === ToastType.Info">
                    {{ toastMessage }}
                </Info>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import useToast from '../composables/useToast'
const { toastMessage, toastVisible, toastType, ToastType } = useToast()
// let showInfo = computed(() => {
//     return toastType.value === 'info'
// })
// let showWarning = computed(() => {
//     return toastType.value === 'warning'
// })
// let showSuccess = computed(() => {
//     return toastType.value === 'success'
// })
// watch(toastMessage, () => {
//     console.log(toastMessage.value)
// })
// watch(toastVisible, () => {
//     console.log(toastType.value)

//     console.log(showInfo.value)
// })
// const showWarning = computed(() => {
//     return toastType.value === ToastType.Warning
// })
// const showError = computed(() => {
//     return toastType.value === ToastType.Error
// })
// watch(toastVisible, () => {
//     console.log(toastType.value)
//     console.log(toastMessage.value)
//     console.log('toastVisible', toastVisible.value)
//     console.log(ToastType.Success, ToastType.Warning, ToastType.Info)
//     console.log(toastType.value === ToastType.Success)
//     console.log(toastType.value === ToastType.Warning)
//     console.log(toastType.value === ToastType.Info)
// })
</script>
<style scoped>
.v-enter-active,
.v-leave-active {
    transition: transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    transform: translateX(500px);
}
</style>
