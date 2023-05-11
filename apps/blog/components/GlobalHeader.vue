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
    >
        <div w-full items-center justify-between h-full max-w-7xl flex>
            <div @click="page.toggleMask" lg:hidden>
                <div text-gray-700 cursor-pointer ml-4 text-8 i-mdi-menu></div>
            </div>
            <div class="logo" flex justify-center items-center h-full>
                <NuxtLink to="/">
                    <NuxtImg w-16 src="/logo.png"></NuxtImg>
                </NuxtLink>
                <nav class="<lg:hidden" lg:flex gap-8 items-center>
                    <NuxtLink ml-30 hover:text-sky-500 to="/">Home</NuxtLink>

                    <!-- <NuxtLink to="/blog">Blog</NuxtLink> -->
                </nav>
            </div>

            <div
                @click="page.toggleSignUp"
                flex
                items-center
                class="settings"
                pr-4
                cursor-pointer
            >
                <div>
                    <div v-show="user.isLogin">
                        <NuxtLink to="/user" flex items-center gap-5>
                            <img
                                w-10
                                h-10
                                rounded-5
                                alt="user avatar"
                                ref="avatar_url"
                                hover:shadow-lg
                            />
                            <div
                                :title="user.username"
                                hover:hover:text-sky-5
                                w-20
                                truncate
                                class="<lg:hidden"
                                lg:block
                            >
                                {{ user.username }}
                            </div>
                        </NuxtLink>
                    </div>
                    <div v-show="!user.isLogin">
                        <NuxtLink to="/register">Sign up</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script setup lang="ts">
import usePage from '../stores/page'
import useUser from '../stores/user'
import MaskLayer from './MaskLayer.vue'
const page = usePage()
const user = useUser()
const appConfig = useAppConfig()
let avatar_url = ref<HTMLImageElement>()
onMounted(() => {
    if (avatar_url.value) {
        avatar_url.value.src = `${appConfig.backend_url}${user.avatar_path}`
    }
})
</script>
<style scoped>
header {
    --un-bg-opacity: 0.8;
    --un-backdrop-blur: blur(0.75rem);
}
</style>
