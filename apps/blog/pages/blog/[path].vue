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
            lg:rounded-4
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
            lg:rounded-4
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
</script>
