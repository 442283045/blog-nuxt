<template>
    <main w-full flex justify-center bg-gray-200>
        <div flex-col w-full justify-between h-full flex max-w-7xl>
            <ul m-4 flex-col flex gap-4>
                <li
                    v-for="{ id, title, description, date, _path } in articles"
                    :key="id"
                    h-36
                    flex
                    bg-white
                    shadow-lg
                    rounded-2
                    p-2
                >
                    <div h-full flex items-center>
                        <NuxtImg
                            src="/article-image.jpg"
                            alt="Discover Nuxt 3"
                            height="128"
                            rounded-2
                        />
                    </div>
                    <div flex-1 grid px-4 py-1>
                        <div truncate text-xl>
                            <NuxtLink :to="`/blog${_path}`" hover:text-sky-500>
                                {{ title }}
                            </NuxtLink>
                        </div>
                        <div
                            !hidden
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
                        <div
                            flex
                            items-end
                            text-gray-500
                            justify-between
                            w-full
                        >
                            <div text-sm text-gray-500>{{ date }}</div>
                            <div flex gap-4>
                                <div
                                    cursor-pointer
                                    i-material-symbols-favorite-outline
                                ></div>
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
