<template>
    <main relative>
        <NuxtImg
            absolute
            w-full
            bg-cover
            h-60
            blur-sm
            opacity-30
            :src="`https://picsum.photos/200?r=${Math.random()}`"
            bg-center
            overflow-hidden
        ></NuxtImg>

        <div
            flex
            flex-col
            items-center
            z-10
            relative
            w-full
            h-60
            justify-center
        >
            <NuxtImg
                bg-cover
                h-20
                w-20
                rounded-10
                :src="`https://picsum.photos/200?r=${Math.random()}`"
                bg-center
            ></NuxtImg>
            <div text-gray-5>一只大青蛙</div>
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
const page = ref('')
</script>
