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
                bg-white
                w-full
                h-full
                flex
                flex-col
                items-center
                justify-center
                :style="{ '--un-bg-opacity': '0.2' }"
            >
                <UserAvatar rounded-10 h-20 w-20></UserAvatar>

                <UserName drop-shadow-lg></UserName>
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
        </div>

        <!-- <div bg-white relative flex gap-8 p-4>
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
        </div> -->

        <div w-30 bg-white h-30 border-1>hello</div>
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
