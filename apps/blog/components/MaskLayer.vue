<template>
    <Transition name="fade">
        <div
            class="mask"
            fixed
            w-screen
            h-screen
            top-0
            bg-black
            flex
            v-show="page.isMenuOpen"
        >
            <Transition name="translate">
                <div
                    v-show="page.isMenuOpen"
                    w-80
                    bg-white
                    h-screen
                    gap-2
                    flex
                    flex-col
                    p-12
                >
                    <div mb-8 bg-white shadow-lg w-8 rounded-8 shadow-gray-400>
                        <div
                            text-gray-500
                            hover:rotate-180
                            text-8
                            i-mdi-close
                            @click="page.isMenuOpen = false"
                            cursor-pointer
                        ></div>
                    </div>
                    <div flex gap-4 flex-col>
                        <NuxtLink @click="page.isMenuOpen = false" to="/">
                            <div
                                hover:hover:text-sky-5
                                bg-gray-200
                                rounded-2
                                h-8
                                leading-8
                                cursor-pointer
                                text-center
                                text-gray-6
                                flex
                                items-center
                                justify-center
                            >
                                <div i-mdi-home></div>
                                Home
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </Transition>
            <div flex-1 @click="page.toggleMask"></div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import usePage from '../stores/page'
const page = usePage()
</script>
<style scoped>
.mask {
    --un-bg-opacity: 0.5;
}
/* .v-enter-active,
.v-leave-active {
    transition: all 0.3s ease-out;
}

.v-enter-from,
.v-leave-to {
    transition: translateX(-80rem);
} */
.translate-enter-active,
.translate-leave-active {
    transition: transform 0.5s ease-in-out;
}

.translate-enter-from,
.translate-leave-to {
    transform: translateX(-320px);
}
.fade-enter-active,
.fade-leave-active {
    transition: background-color 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
    background-color: transparent;
}
</style>
