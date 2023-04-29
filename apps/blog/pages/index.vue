<template>
    <main h-7xl w-full flex justify-center bg-gray-200>
        <div flex-col w-full justify-between h-full flex max-w-7xl>
            <ul m-16 flex-col flex gap-4>
                <li
                    v-for="{ id, title, description, date, _path } in articles"
                    :key="id"
                    h-48
                    flex
                    bg-white
                    shadow-lg
                >
                    <div h-full w-48>
                        <img
                            src="~/assets/article-image.jpg"
                            alt="Discover Nuxt 3"
                        />
                    </div>
                    <div flex-1 grid px-8>
                        <div
                            truncate
                            text-xl
                            flex
                            items-center
                            hover:text-sky-500
                        >
                            <NuxtLink :to="`/blog${_path}`">
                                {{ title }}
                            </NuxtLink>
                        </div>
                        <div
                            :style="{
                                '-webkit-line-clamp': 3,
                                display: '-webkit-box',
                                '-webkit-box-orient':
                                    'vertical' /* Required for -webkit-line-clamp */,
                                overflow: 'hidden',
                                'text-overflow': 'ellipsis',
                                height: '4.5rem'
                            }"
                        >
                            {{ description }}
                        </div>
                        <div flex justify-between w-full>
                            <div text-sm text-gray-500>{{ date }}</div>
                            <div flex gap-4>
                                <div i-material-symbols-favorite-outline></div>
                                <div i-mdi-comment-outline></div>
                                <div i-mdi-eye-circle-outline></div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>
<script setup lang="ts">
const articles = await queryContent()
    .only(['_path', 'title', 'description', 'date', 'id'])
    .find()
console.log(articles)
</script>
