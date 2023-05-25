<template>
    <MaskLayer z-20></MaskLayer>

    <header
        h-16
        bg-white
        class="dark:bg-[#18191a] dark:b-[#363b3d]"
        flex
        justify-center
        sticky
        top-0
        backdrop-filter
        b-b-1
        z-10
    >
        <div w-full items-center justify-between h-full max-w-7xl flex>
            <div @click="page.toggleMask" lg:hidden>
                <div
                    dark:text-white
                    text-gray-700
                    cursor-pointer
                    ml-4
                    text-8
                    i-mdi-menu
                ></div>
            </div>
            <div
                dark:text-white
                class="logo"
                flex
                justify-center
                items-center
                h-full
                font-500
            >
                <NuxtLink to="/">
                    <NuxtImg w-16 src="/logo.png"></NuxtImg>
                </NuxtLink>
                <nav class="<lg:hidden" lg:flex gap-8 items-center>
                    <NuxtLink ml-30 hover:text-sky-500 to="/">Home</NuxtLink>
                </nav>
            </div>

            <div relative flex items-center class="settings" pr-4>
                <div class="<lg:hidden">
                    <div
                        @click.stop="toggleThemePanel"
                        rounded-5
                        cursor-pointer
                        p-2
                        mr-20
                        hover:bg-gray-200
                        dark:hover:bg-gray-700
                    >
                        <div
                            cursor-pointer
                            dark:text-gray-300
                            ref="theme"
                            text-gray-6
                            i-carbon-sun
                            dark:i-carbon-moon
                        ></div>
                    </div>
                    <div
                        v-show="themePanel"
                        border-1
                        absolute
                        rounded-md
                        bg-white
                        dark:bg-gray-600
                        dark:text-gray-200
                        dark:b-gray-800
                        shadow-lg
                        w-30
                        flex
                        top-12
                        flex-col
                        text-sm
                        text-gray-6
                        cursor-pointer
                        overflow-hidden
                        z-100
                    >
                        <div
                            b-b-1
                            b-white
                            dark:b-gray-800
                            p-2
                            hover:bg-gray-100
                            dark:hover:bg-gray-400
                            flex
                            items-center
                            @click="changeTheme('light')"
                        >
                            <div
                                dark:text-gray-100
                                ml-1
                                mr-3
                                text-gray-6
                                class="i-carbon-sun"
                            ></div>
                            Light
                        </div>
                        <div
                            b-b-1
                            b-white
                            p-2
                            dark:b-gray-800
                            hover:bg-gray-100
                            dark:hover:bg-gray-400
                            flex
                            items-center
                            @click="changeTheme('dark')"
                        >
                            <div
                                dark:text-gray-100
                                ml-1
                                mr-3
                                text-gray-6
                                class="i-carbon-moon"
                            ></div>
                            Dark
                        </div>
                        <div
                            @click="changeTheme('auto')"
                            p-2
                            hover:bg-gray-100
                            dark:hover:bg-gray-400
                            flex
                            items-center
                        >
                            <div
                                dark:text-gray-100
                                ml-1
                                mr-3
                                text-gray-6
                                class="i-carbon-screen"
                            ></div>
                            Auto
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
                            <UserAvatar
                                w-10
                                hover:shadow-lg
                                h-10
                                rounded-5
                            ></UserAvatar>

                            <UserName
                                :title="user.username"
                                hover:hover:text-sky-5
                                w-20
                                truncate
                                class="<lg:hidden"
                                lg:block
                                cursor-pointer
                                dark:text-gray-300
                            ></UserName>
                        </div>

                        <div
                            absolute
                            rounded-md
                            bg-white
                            flex
                            shadow-lg
                            w-30
                            overflow-hidden
                            top-12
                            right-0
                            flex-col
                            text-sm
                            text-gray-6
                            border-1
                            dark:bg-gray-600
                            dark:text-gray-200
                            dark:b-gray-800
                            v-show="personPanel"
                        >
                            <NuxtLink to="/user">
                                <div
                                    b-b-1
                                    b-white
                                    py-2
                                    px-4
                                    hover:bg-gray-100
                                    dark:b-gray-800
                                    flex
                                    items-center
                                    cursor-pointer
                                    dark:hover:bg-gray-400
                                >
                                    Profile
                                </div>
                            </NuxtLink>
                            <div
                                cursor-pointer
                                py-2
                                px-4
                                hover:bg-gray-100
                                flex
                                items-center
                                @click="logout"
                                dark:hover:bg-gray-400
                            >
                                Log out
                            </div>
                        </div>
                    </div>
                    <div v-show="!user.isLogin" dark:text-white>
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
const mode = useColorMode({
    emitAuto: true
})
function changeTheme(theme: 'light' | 'dark' | 'auto') {
    mode.value = theme
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

function logout() {
    fetch(`${appConfig.backend_url}/api/logout`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            user.logout()
        })
        .catch((err) => {
            console.log(err)
            console.log('logout failed')
        })
}
</script>
<style scoped>
header {
    --un-bg-opacity: 0.8;
    --un-backdrop-blur: blur(0.75rem);
}
</style>
