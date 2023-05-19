<template>
    <main
        class="markdown dark:bg-[#25282a]"
        w-full
        bg-gray-200
        lg:pt-4
        flex
        flex-col
        items-center
    >
        <div
            flex
            items-center
            w-10
            flex-col
            h-50
            fixed
            right-10
            bottom-10
            bg-white
            rounded-md
            shadow-lg
            class="<lg:hidden"
        >
            <div
                py-3
                b-b-1
                b-gray-200
                @click="isFavorite = !isFavorite"
                cursor-pointer
                text-5
            >
                <div v-if="isFavorite" class="i-tabler-star-filled"></div>
                <div v-else class="i-tabler-star"></div>
            </div>
            <div py-3 b-b-1 b-gray-200 cursor-pointer text-5>
                <a href="#comments">
                    <div
                        text-gray-600
                        class="i-mdi-comment-processing-outline"
                    ></div>
                </a>
            </div>
        </div>

        <article
            class="dark:text-[#E8E6E3] dark:bg-[#181a1b] dark:text-[rgb(232, 230, 227)]"
            flex
            flex-col
            justify-center
            max-w-5xl
            w-full
            p-4
            mx-4
            md:p-16
            bg-white
            lg:rounded-md
        >
            <ContentDoc :path="`/${path}`">
                <template v-slot="{ doc }">
                    <h1>{{ doc.title }}</h1>
                    <div>{{ doc.description }}</div>
                    <ContentRenderer :value="doc" />
                </template>
            </ContentDoc>
        </article>
        <Comment
            class="dark:bg-[#181a1b] dark:text-[rgb(232, 230, 227)]"
            lg:mt-4
            flex
            flex-col
            justify-center
            max-w-5xl
            w-full
            p-4
            mx-4
            md:p-16
            bg-white
            lg:rounded-md
            id="comments"
        ></Comment>
    </main>
</template>

<script setup lang="ts">
import '../../styles/markdown.css'

const route = useRoute()
const router = useRouter()
const path = route.params.path

if (route.path === '/') {
    router.push('/')
}
const isFavorite = ref(false)
</script>
