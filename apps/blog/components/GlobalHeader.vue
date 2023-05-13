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
            <div class="logo" flex justify-center items-center h-full font-500>
                <NuxtLink to="/">
                    <NuxtImg w-16 src="/logo.png"></NuxtImg>
                </NuxtLink>
                <nav class="<lg:hidden" lg:flex gap-8 items-center>
                    <NuxtLink ml-30 hover:text-sky-500 to="/">Home</NuxtLink>

                    <!-- <NuxtLink to="/blog">Blog</NuxtLink> -->
                </nav>
            </div>

            <div relative flex items-center class="settings" pr-4>
                <div>
                    <div
                        @click.stop="toggleThemePanel"
                        rounded-5
                        cursor-pointer
                        p-2
                        mr-20
                        hover:bg-gray-200
                    >
                        <div
                            cursor-pointer
                            text-6.5
                            text-gray-6
                            class="i-mdi-weather-sunny"
                        ></div>
                    </div>
                    <div
                        v-show="themePanel"
                        border-1
                        absolute
                        rounded-md
                        bg-gray-50
                        flex
                        top-12
                        flex-col
                        text-sm
                        text-gray-6
                        cursor-pointer
                        z-100
                    >
                        <div
                            b-b-1
                            b-white
                            p-2
                            hover:bg-gray-100
                            flex
                            items-center
                        >
                            <div
                                pr-10
                                text-6.5
                                text-gray-6
                                class="i-mdi-weather-sunny"
                            ></div>
                            Light
                        </div>
                        <div
                            b-b-1
                            b-white
                            p-2
                            hover:bg-gray-100
                            flex
                            items-center
                        >
                            <div
                                pr-10
                                text-6.5
                                text-gray-6
                                class="i-mdi-weather-night"
                            ></div>
                            Dark
                        </div>
                        <div p-2 hover:bg-gray-100 flex items-center>
                            <div
                                pr-10
                                text-6.5
                                text-gray-6
                                class="i-mdi-theme-light-dark"
                            ></div>
                            System
                        </div>
                    </div>
                </div>
                <div>
                    <div relative v-show="user.isLogin">
                        <div
                            @click.stop="togglePersonPanel"
                            flex
                            gap-5
                            items-center
                            cursor-pointer
                        >
                            <!-- <img
                                w-10
                                h-10
                                rounded-5
                                alt="user avatar"
                                ref="avatar_url"
                                hover:shadow-lg
                            /> -->
                            <UserAvatar
                                w-10
                                hover:shadow-lg
                                h-10
                                rounded-5
                            ></UserAvatar>
                            <!-- <div
                                :title="user.username"
                                hover:hover:text-sky-5
                                w-20
                                truncate
                                class="<lg:hidden"
                                lg:block
                                cursor-pointer
                            >
                                {{ username }}
                            </div> -->
                            <UserName
                                :title="user.username"
                                hover:hover:text-sky-5
                                w-20
                                truncate
                                class="<lg:hidden"
                                lg:block
                                cursor-pointer
                            ></UserName>
                        </div>

                        <div
                            absolute
                            rounded-md
                            bg-gray-50
                            flex
                            top-12
                            flex-col
                            text-sm
                            text-gray-6
                            border-1
                            v-show="personPanel"
                        >
                            <NuxtLink to="/user">
                                <div
                                    b-b-1
                                    b-white
                                    py-2
                                    px-4
                                    hover:bg-gray-100
                                    flex
                                    items-center
                                >
                                    Profile
                                </div>
                            </NuxtLink>
                            <div py-2 px-4 hover:bg-gray-100 flex items-center>
                                Log out
                            </div>
                        </div>
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

const themePanel = ref(false)
const personPanel = ref(false)
const username = ref('username')
function toggleThemePanel() {
    themePanel.value = !themePanel.value
    if (personPanel.value) {
        personPanel.value = false
    }
}
function togglePersonPanel() {
    personPanel.value = !personPanel.value
    if (themePanel.value) {
        themePanel.value = false
    }
}
onMounted(() => {
    if (avatar_url.value && user.avatar_path) {
        avatar_url.value.src = `${appConfig.backend_url}${user.avatar_path}`
    }
    document.documentElement.addEventListener('click', () => {
        if (themePanel.value) {
            themePanel.value = false
        }
        if (personPanel.value) {
            personPanel.value = false
        }
    })
})

setTimeout(() => {
    username.value = user.username
})
</script>
<style scoped>
header {
    --un-bg-opacity: 0.8;
    --un-backdrop-blur: blur(0.75rem);
}
</style>
