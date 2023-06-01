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
            @click="isDropdownOpen = false"
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
                            i-tabler-circle-x
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
                                <div pr-10 text-4 i-tabler-home></div>
                                Home
                            </div>
                        </NuxtLink>
                        <div flex flex-col>
                            <button
                                id="states-button"
                                @click.stop="isDropdownOpen = !isDropdownOpen"
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
                                        i-carbon-sun
                                        dark:i-carbon-moon
                                        ref="theme"
                                    ></div>
                                    {{
                                        String(mode).charAt(0).toUpperCase() +
                                        String(mode).slice(1)
                                    }}
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
                                            @click.stop="changeTheme('light')"
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
                                                    class="i-carbon-sun"
                                                ></div>
                                                Light
                                            </div>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            @click.stop="changeTheme('dark')"
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
                                                    class="i-carbon-moon"
                                                ></div>
                                                Dark
                                            </div>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            bg-light-100
                                            @click.stop="changeTheme('auto')"
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
                                                    class="i-carbon-screen"
                                                ></div>
                                                Auto
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
let changeTheme: Function
let mode: any
onMounted(() => {
    mode = useColorMode({
        emitAuto: true
    })

    changeTheme = function (theme: 'light' | 'dark' | 'auto') {
        mode.value = theme

        isDropdownOpen.value = false
    }
})
</script>
<style scoped>
.mask {
    --un-bg-opacity: 0.5;
}

.translate-enter-active,
.translate-leave-active {
    transition: transform 0.5s ease;
}

.translate-enter-from,
.translate-leave-to {
    transform: translateX(-320px);
}
.fade-enter-active,
.fade-leave-active {
    transition: background-color 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    background-color: transparent;
}
</style>
