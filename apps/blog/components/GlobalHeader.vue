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
                <div text-gray-700 cursor-pointer ml-4 text-8 i-mdi-menu></div>
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
                            ref="theme"
                            text-gray-6
                            class="i-mdi-white-balance-sunny"
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
                            @click="lightTheme"
                        >
                            <div
                                pr-10
                                text-6.5
                                text-gray-6
                                class="i-mdi-white-balance-sunny"
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
                            @click="darkTheme"
                        >
                            <div
                                pr-10
                                text-6.5
                                text-gray-6
                                class="i-mdi-weather-night"
                            ></div>
                            Dark
                        </div>
                        <div
                            @click="systemTheme"
                            p-2
                            hover:bg-gray-100
                            flex
                            items-center
                        >
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
                                    cursor-pointer
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
                            >
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
    loadTheme()
})
function loadTheme() {
    if (
        localStorage.theme === 'dark' ||
        localStorage.theme === 'light' ||
        localStorage.theme === 'system'
    ) {
        if (localStorage.theme === 'dark') {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-weather-night')
            theme.value.style.color = '#3b82f6'
            document.documentElement.classList.add('dark')
        } else if (
            localStorage.theme === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-weather-night')
            document.documentElement.classList.add('dark')
        } else {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-white-balance-sunny')
        }
        if (localStorage.theme === 'light') {
            theme.value.style.color = '#3b82f6'
        }
        if (localStorage.theme === 'theme') {
            theme.value.style.color = 'rgba(75,85,99,var(--un-text-opacity))'
        }
    } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-weather-night')
            localStorage.theme === 'dark'
            document.documentElement.classList.add('dark')
        } else {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-white-balance-sunny')
            localStorage.theme === 'light'
        }
    }
}

setTimeout(() => {
    username.value = user.username
})
const theme = ref()

function lightTheme() {
    localStorage.theme = 'light'
    theme.value.style.color = '#3b82f6'
    document.documentElement.className = ''
    if (!theme.value.classList.contains('i-mdi-white-balance-sunny')) {
        theme.value.className = ''
        theme.value.classList.add('i-mdi-white-balance-sunny')
    }
}
function darkTheme() {
    localStorage.theme = 'dark'
    theme.value.style.color = '#3b82f6'
    document.documentElement.className = ''
    document.documentElement.classList.add('dark')
    if (!theme.value.classList.contains('i-mdi-weather-night')) {
        theme.value.className = ''
        theme.value.classList.add('i-mdi-weather-night')
    }
}
function systemTheme() {
    theme.value.style.color = 'rgba(75,85,99,var(--un-text-opacity))'
    localStorage.theme = 'system'
    document.documentElement.className = ''
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
        theme.value.className = ''
        theme.value.classList.add('i-mdi-weather-night')
    } else {
        theme.value.className = ''
        theme.value.classList.add('i-mdi-white-balance-sunny')
    }
}
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
