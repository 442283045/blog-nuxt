<template>
    <main
        class="markdown"
        w-full
        bg-gray-200
        lg:pt-4
        flex
        flex-col
        items-center
    >
        <article
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

// window.addEventListener('locationchange', function () {
//     console.log('location changed!')
// })
if (route.path === '/') {
    router.push('/')
}
</script>

<style></style>
