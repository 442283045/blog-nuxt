<template>
    <main bg-gray-200 relative>
        <div
            flex
            flex-col
            items-center
            top-0
            w-full
            relative
            h-60
            justify-center
            style="background-image: url(/article-image.jpg)"
        >
            <div
                w-full
                h-full
                flex
                flex-col
                items-center
                justify-center
                class="bg-[rgb(255,255,255,0.2)] dark:bg-[rgb(0,0,0,0.5)]"
            >
                <UserAvatar rounded-10 h-20 w-20></UserAvatar>

                <UserName dark:text-gray-200 drop-shadow-lg></UserName>
                <div
                    absolute
                    right-1
                    bottom-1
                    border-1
                    rounded-md
                    text-gray-6
                    text-sm
                    hover:text-cyan-500
                    cursor-pointer
                    px-2
                    py-1
                    dark:text-gray-200
                >
                    edit
                </div>
            </div>
        </div>

        <div
            :style="{ '--un-bg-opacity': '1' }"
            bg-white
            text-sm
            font-medium
            text-center
            text-gray-500
            border-b
            border-gray-200
            dark:border-gray-700
            dark:bg-gray-700
            dark:text-gray-100
        >
            <ul @click="changeTab" class="flex flex-wrap -mb-px">
                <li class="mr-2">
                    <a
                        href="#"
                        class="inline-block p-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    >
                        Profile
                    </a>
                </li>
                <li class="mr-2">
                    <a
                        href="#"
                        class="inline-block p-4 text-blue-600 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500"
                        aria-current="page"
                    >
                        Favorites
                    </a>
                </li>
                <li class="mr-2">
                    <a
                        href="#"
                        class="inline-block p-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    >
                        Settings
                    </a>
                </li>
                <li class="mr-2">
                    <a
                        href="#"
                        class="inline-block p-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    >
                        Contacts
                    </a>
                </li>
                <li>
                    <a
                        class="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500"
                    >
                        Disabled
                    </a>
                </li>
            </ul>
            <div bg-pink relative>
                <div
                    transition-all
                    ref="slider"
                    absolute
                    left-20
                    h-0.5
                    bg-blue-600
                    w-20
                ></div>
            </div>
        </div>
    </main>
</template>
<style scoped>
input[type='radio']:checked + label div {
    color: pink;
}
</style>
<script lang="ts" setup>
import useUser from '~/stores/user'
const slider = ref()
const page = ref('')
const appConfig = useAppConfig()
const user = useUser()
function changeTab(e: MouseEvent) {
    if (!slider.value) {
        return
    }

    slider.value.style.width =
        (e.target as Element).getBoundingClientRect().width + 'px'
    slider.value.style.left =
        (e.target as Element).getBoundingClientRect().left + 'px'

    if ((e.target as HTMLElement).parentElement?.parentElement) {
        const children = Array.from(
            (e.target as HTMLElement).parentElement?.parentElement?.children ||
                []
        ) as HTMLElement[]
        children.forEach((child) => {
            ;(child.children[0] as HTMLElement).style.color = 'unset'
        })
    }
    ;(e.target as HTMLElement).style.color =
        'rgba(37, 99, 235, var(--un-text-opacity))'
    // ;(e.target as HTMLElement).parentElement?.children.style.color = 'unset'
}
</script>
