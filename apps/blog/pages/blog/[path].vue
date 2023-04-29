<template>
    <main class="markdown" w-full bg-gray-200 pt-16>
        <article m-auto flex flex-col justify-center max-w-7xl p-16 bg-white>
            <ContentDoc :path="`/${$route.params.path}`">
                <template v-slot="{ doc }">
                    <h1>{{ doc.title }}</h1>
                    <div>{{ doc.description }}</div>
                    <ContentRenderer :value="doc" />
                </template>
                <template v-slot:not-found>
                    <h1>Document not found</h1>
                </template>
            </ContentDoc>
        </article>
    </main>
</template>

<script setup lang="ts">
import '../../styles/markdown.css'
const { data: navigation } = await useAsyncData('navigation', () =>
    fetchContentNavigation()
)
console.log(navigation)
const articles = await queryContent().limit(10).find()
console.log(articles)
// import '../../styles/markdown.css'
const route = useRoute()
console.log(route.params.path)
</script>

<style></style>
