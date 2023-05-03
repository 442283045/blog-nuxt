<template>
    <main class="markdown" w-full bg-gray-200 pt-4>
        <article
            flex
            flex-col
            justify-center
            max-w-7xl
            p-4
            mx-4
            md:p-16
            bg-white
            rounded-4
        >
            <ContentDoc :path="`/${path}`">
                <template v-slot="{ doc }">
                    <h1>{{ doc.title }}</h1>
                    <div>{{ doc.description }}</div>
                    <ContentRenderer :value="doc" />
                </template>
                <!-- <template v-slot:not-found>
                    <h1>Document not found</h1>
                </template> -->
            </ContentDoc>
        </article>
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
