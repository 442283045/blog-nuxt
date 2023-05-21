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
                    dark:bg-gray-800
                    gap-2
                    flex
                    flex-col
                    p-12
                >
                    <div
                        mb-8
                        dark:bg-gray-700
                        bg-white
                        w-8
                        rounded-8
                        shadow-gray-400
                    >
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
                                text-gray-500
                                bg-gray-100
                                border-1
                                border-gray-300
                                rounded-lg
                                hover:bg-gray-200
                                focus:ring-4
                                focus:outline-none
                                focus:ring-gray-100
                                dark:bg-gray-700
                                dark:hover:bg-gray-600
                                dark:focus:ring-gray-700
                                dark:text-white
                                dark:border-gray-600
                                rounded-2
                                h-8
                                leading-8
                                cursor-pointer
                                text-center
                                flex
                                px-4
                                items-center
                            >
                                <div pr-10 text-4 i-mdi-home></div>
                                Home
                            </div>
                        </NuxtLink>
                        <div flex flex-col>
                            <button
                                id="states-button"
                                @click="isDropdownOpen = !isDropdownOpen"
                                data-dropdown-toggle="dropdown-states"
                                flex-shrink-0
                                z-10
                                inline-flex
                                items-center
                                py-2.5
                                px-4
                                text-sm
                                font-medium
                                text-center
                                text-gray-500
                                bg-gray-100
                                border-1
                                border-gray-300
                                rounded-lg
                                hover:bg-gray-200
                                focus:ring-4
                                focus:outline-none
                                focus:ring-gray-100
                                dark:bg-gray-700
                                dark:hover:bg-gray-600
                                dark:focus:ring-gray-700
                                dark:text-white
                                dark:border-gray-600
                                type="button"
                            >
                                <div class="inline-flex items-center">
                                    <div
                                        pr-10
                                        text-4
                                        text-gray-6
                                        class="i-mdi-theme-light-dark"
                                        ref="theme"
                                    ></div>
                                    {{ themeText }}
                                </div>
                                <svg
                                    aria-hidden="true"
                                    class="w-4 h-4 ml-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                            <div
                                id="dropdown-states"
                                v-show="isDropdownOpen"
                                z-10
                                bg-light-100
                                divide-y
                                divide-gray-100
                                rounded-lg
                                shadow
                                w-44
                                dark:bg-gray-700
                                :style="{ '--un-bg-opacity': '1' }"
                            >
                                <ul
                                    class="py-2 text-sm text-gray-700 dark:text-gray-200"
                                    aria-labelledby="states-button"
                                >
                                    <li>
                                        <button
                                            type="button"
                                            bg-light-100
                                            inline-flex
                                            w-full
                                            px-4
                                            py-2
                                            text-sm
                                            text-gray-700
                                            hover:bg-gray-100
                                            dark:text-gray-400
                                            dark:hover:bg-gray-600
                                            dark:hover:text-white
                                            dark:bg-gray-700
                                            @click="lightTheme"
                                        >
                                            <div
                                                dark:text-white
                                                class="inline-flex items-center"
                                            >
                                                <div
                                                    pr-10
                                                    text-4
                                                    dark:text-white
                                                    text-gray-6
                                                    class="i-mdi-white-balance-sunny"
                                                ></div>
                                                Light
                                            </div>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            @click="darkTheme"
                                            type="button"
                                            bg-light-100
                                            dark:bg-gray-700
                                            class="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            <div
                                                dark:text-white
                                                class="inline-flex items-center"
                                            >
                                                <div
                                                    dark:text-white
                                                    pr-10
                                                    text-4
                                                    text-gray-6
                                                    class="i-mdi-weather-night"
                                                ></div>
                                                Dark
                                            </div>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            bg-light-100
                                            @click="systemTheme"
                                            type="button"
                                            dark:bg-gray-700
                                            class="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            <div
                                                dark:text-white
                                                class="inline-flex items-center"
                                            >
                                                <div
                                                    dark:text-white
                                                    pr-10
                                                    text-4
                                                    text-gray-6
                                                    class="i-mdi-theme-light-dark"
                                                ></div>
                                                System
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
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
const isDropdownOpen = ref(false)
const theme = ref()
const themeText = ref('System')
onMounted(() => {
    loadTheme()
})
watch(
    () => page.isMenuOpen,
    () => {
        loadTheme()
    }
)
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
            themeText.value = 'Dark'
            document.documentElement.classList.add('dark')
        } else if (
            localStorage.theme === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-theme-light-dark')
            themeText.value = 'System'
            document.documentElement.classList.add('dark')
        } else if (localStorage.theme === 'system') {
            theme.value.className = ''
            theme.value.classList.add('i-mdi-theme-light-dark')
            themeText.value = 'System'
        } else {
            themeText.value = 'Light'
            theme.value.className = ''
            theme.value.classList.add('i-mdi-white-balance-sunny')
        }
        if (localStorage.theme === 'light') {
            theme.value.style.color = '#3b82f6'
        }
        if (localStorage.theme === 'system') {
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

function lightTheme() {
    themeText.value = 'Light'
    localStorage.theme = 'light'
    theme.value.style.color = '#3b82f6'
    document.documentElement.className = ''
    if (!theme.value.classList.contains('i-mdi-white-balance-sunny')) {
        theme.value.className = ''
        theme.value.classList.add('i-mdi-white-balance-sunny')
    }
    isDropdownOpen.value = false
}
function darkTheme() {
    localStorage.theme = 'dark'
    themeText.value = 'Dark'
    theme.value.style.color = '#3b82f6'
    document.documentElement.className = ''
    document.documentElement.classList.add('dark')
    if (!theme.value.classList.contains('i-mdi-weather-night')) {
        theme.value.className = ''
        theme.value.classList.add('i-mdi-weather-night')
    }
    isDropdownOpen.value = false
}
function systemTheme() {
    themeText.value = 'System'
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
    isDropdownOpen.value = false
}
</script>
<style scoped>
.mask {
    --un-bg-opacity: 0.5;
}

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
