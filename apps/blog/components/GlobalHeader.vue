<template>
    <MaskLayer z-20></MaskLayer>

    <header
        h-16
        bg-white
        flex
        justify-center
        sticky
        top-0
        backdrop-filter
        b-b-1
        b-gray-200
        z-10
        :style="{
            '--un-bg-opacity': '0.8',
            '--un-backdrop-blur': 'blur(0.75rem)'
        }"
    >
        <div w-full items-center justify-between h-full flex max-w-7xl>
            <div @click="page.toggleMask">
                <div text-gray-700 cursor-pointer ml-4 text-8 i-mdi-menu></div>
            </div>
            <div class="logo" flex justify-center items-center h-full w-16>
                <NuxtImg src="/logo.png"></NuxtImg>
            </div>
            <nav hidden flex gap-8 items-center>
                <NuxtLink hover:text-sky-500 to="/">Home</NuxtLink>
                <NuxtLink hover:text-sky-500 to="/test">Home</NuxtLink>
                <!-- <NuxtLink to="/blog">Blog</NuxtLink> -->
            </nav>

            <div
                @click="page.toggleSignUp"
                flex
                items-center
                class="settings"
                pr-4
                cursor-pointer
            >
                <div v-if="isLogin"><NuxtLink to="/user">User</NuxtLink></div>
                <NuxtLink v-else to="/register">Sign up</NuxtLink>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import usePage from '../stores/page'
import MaskLayer from './MaskLayer.vue'
const page = usePage()
const isLogin = ref(false)
</script>
