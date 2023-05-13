<template>
    <main relative>
        <div
            flex
            flex-col
            items-center
            top-0
            w-full
            h-60
            justify-center
            style="background-image: url(/article-image.jpg)"
        >
            <UserAvatar rounded-10 h-20 w-20></UserAvatar>

            <UserName></UserName>
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
            >
                edit
            </div>
        </div>
        <div bg-white relative flex gap-8 p-4>
            <input
                appearance-none
                type="radio"
                v-model="page"
                id="favorites"
                name="page"
                value="favorites"
            />
            <label for="favorites">
                <div
                    cursor-pointer
                    rounded-md
                    hover:shadow-lg
                    px-2
                    py-1
                    text-gray-6
                    bg-gray-100
                >
                    favorites
                </div>
            </label>
            <input
                appearance-none
                type="radio"
                id="history"
                name="page"
                value="history"
                v-model="page"
            />
            <label for="history">
                <div
                    cursor-pointer
                    rounded-md
                    hover:shadow-lg
                    px-2
                    py-1
                    text-gray-6
                    bg-gray-100
                >
                    history
                </div>
            </label>
        </div>
        <div>
            <ul flex flex-col items-center>
                <li>{{ page }}</li>
                <li>history</li>
                <li>history</li>
                <li>history</li>
                <li>history</li>
                <li>history</li>
                <li>history</li>
                <li>history</li>
                <li>history</li>
            </ul>
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

const page = ref('')
const appConfig = useAppConfig()
const user = useUser()
</script>
