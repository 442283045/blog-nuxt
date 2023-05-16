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
                <Success v-if="toastType === ToastType.Success">
                    {{ toastMessage }}
                </Success>
                <Warning v-else-if="toastType === ToastType.Warning">
                    {{ toastMessage }}
                </Warning>
                <Info v-else>{{ toastMessage }}</Info>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
const { toastMessage, toastVisible, toastType, ToastType } = useToast()
</script>
<style scoped>
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
    transition: transform 0.5s ease;
}

.v-enter-from,
.v-leave-to {
    transform: translateX(500px);
}
</style>
