<template>
    <main w-full flex justify-center bg-gray-200 class="dark:bg-[#25282a]">
        <div flex-col w-full justify-between h-full flex max-w-5xl>
            <ul m-4 flex-col flex gap-4>
                <li
                    v-for="{
                        id,
                        title,
                        description,
                        _path,
                        published_date,
                        comments,
                        favorites,
                        view_count
                    } in combinedInfo"
                    :key="id"
                    h-36
                    md:h-42
                    flex
                    bg-white
                    class="dark:bg-[#181a1b]"
                    shadow-lg
                    rounded-2
                    p-2
                >
                    <div h-full flex items-center>
                        <NuxtImg
                            src="/linux.png"
                            alt="Discover Nuxt 3"
                            width="128"
                            height="128"
                            rounded-2
                            class="nuxt_img"
                        />
                    </div>
                    <div class="dark:text-neutral-200" flex-1 grid px-4 py-1>
                        <div truncate text-xl>
                            <NuxtLink
                                :to="`/blog${_path}?id=${id}`"
                                hover:text-sky-500
                            >
                                {{ title }}
                            </NuxtLink>
                        </div>
                        <div text-sm h-18 ref="description">
                            {{ description }}
                        </div>
                        <div
                            flex
                            items-end
                            text-gray-500
                            justify-between
                            w-full
                            text-xs
                        >
                            <div text-gray-500>
                                {{ published_date }}
                            </div>
                            <div flex gap-4 items-end>
                                <div translate-y-12px gap-1 flex items-center>
                                    <Lottie dark:bg-black translate-x-10px />
                                    <div z-30>{{ favorites }}</div>
                                </div>
                                <div gap-1 flex items-center>
                                    <div
                                        translate-y-1px
                                        flex
                                        i-mdi-comment-outline
                                    ></div>
                                    <div>{{ comments }}</div>
                                </div>
                                <div gap-1 flex items-center>
                                    <div
                                        translate-y-1px
                                        i-mdi-eye-circle-outline
                                    ></div>
                                    <div>{{ view_count }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>
<style scoped>
@media (min-width: 768px) {
    .nuxt_img {
        width: 152px;
        height: 152px;
    }
}
</style>
<script setup lang="ts">
const appConfig = useAppConfig()
const articles = await queryContent()
    .only(['article_id', 'title', 'description', '_path'])
    .sort({ article_id: 1 })
    .find()
    .catch((err) => {
        console.log(err)
    })
console.log(articles)
const articlesInfo = await fetch(`${appConfig.backend_url}/articles`, {
    method: 'GET'
})
    .then((res) => {
        return res.json()
    })
    .catch((err) => {
        console.log(err)
    })
interface Article {
    _path: string
    title: string
    description: string
    article_id: number
    id: number
    author_id: string
    published_date: string
    thumbs_up: number
    favorites: number
    updated_date: string | null
    comments: number
    view_count: number
}

const combinedInfo: Array<Article> = []
if (articles) {
    for (let i = 0; i < articles.length; i++) {
        combinedInfo.push({ ...articles[i], ...articlesInfo[i] })
    }
}
console.log(combinedInfo)
const description = ref(null)
interface CustomCSSStyleDeclaration extends CSSStyleDeclaration {
    ['-webkit-line-clamp']?: string
    ['-webkit-box-orient']?: string
    ['text-overflow']?: string
}

onMounted(() => {
    if (description.value) {
        ;(description.value as Array<HTMLElement>).forEach((element) => {
            const mediaQuery = window.matchMedia('(min-width: 768px)')
            mediaQuery.addEventListener('change', styleChange)
            function styleChange() {
                const styleDeclaration =
                    element.style as CustomCSSStyleDeclaration
                if (mediaQuery.matches) {
                    styleDeclaration['-webkit-line-clamp'] = '3'
                    styleDeclaration.display = '-webkit-box'
                    styleDeclaration['-webkit-box-orient'] = 'vertical'
                    styleDeclaration.overflow = 'hidden'
                    styleDeclaration['text-overflow'] = 'ellipsis'
                    styleDeclaration.display = 'block'
                } else {
                    styleDeclaration['-webkit-line-clamp'] = 'unset'
                    styleDeclaration.display = 'unset'
                    styleDeclaration['-webkit-box-orient'] = 'unset'
                    styleDeclaration.overflow = 'unset'
                    styleDeclaration['text-overflow'] = 'unset'
                    styleDeclaration.display = 'none'
                }
            }
            styleChange()
        })
    }
})
</script>
