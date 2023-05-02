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
</script>

<style></style>
