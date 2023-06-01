<template>
    <main
        w-full
        flex
        justify-center
        bg-gray-200
        class="min-h-[calc(100vh-4rem)] dark:bg-[#25282a]"
    >
        <div flex-col w-full justify-between h-full flex max-w-5xl>
            <ul m-4 flex-col flex gap-4>
                <li
                    v-for="{
                        article_id,
                        title,
                        description,
                        _path,
                        article_published_date,
                        article_comments_count,
                        article_favorites_count,
                        article_view_count
                    } in combinedInfo"
                    :key="article_id"
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
                                :to="`/blog${_path}?id=${article_id}`"
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
                                {{ formatChineseTime(article_published_date) }}
                            </div>
                            <div flex gap-4 items-end>
                                <div gap-1 flex items-center>
                                    <div flex i-tabler-star></div>
                                    <div>{{ article_favorites_count }}</div>
                                </div>
                                <div gap-1 flex items-center>
                                    <div flex i-mdi-comment-outline></div>
                                    <div>{{ article_comments_count }}</div>
                                </div>
                                <div gap-1 flex items-center>
                                    <div i-mdi-eye-circle-outline></div>
                                    <div>{{ article_view_count }}</div>
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
import formatChineseTime from '~/utils/formatChineseTime'
import useToast from '~/stores/toast'
interface Article {
    article_id: number
    article_title: string
    article_author_user_id: number
    article_published_date: string
    article_thumbs_up_count: number
    article_favorites_count: number
    article_updated_date: string | null
    article_comments_count: number
    article_view_count: number
    description: string
    title: string
    _path: string
}
interface ArticleData {
    article_id: number
    article_title: string
    article_author_user_id: number
    article_published_date: string
    article_thumbs_up_count: number
    article_favorites_count: number
    article_updated_date: string | null
    article_comments_count: number
    article_view_count: number
}
interface ContentType {
    description: string
    title: string
    _path: string
    article_id: number
}
const toastStore = useToast()
const appConfig = useAppConfig()

const combinedInfo: Ref<Record<number, Article>> = ref([])
const {
    data: articleData,
    error,
    refresh
} = await useFetch<Array<ArticleData>>('/articles', {
    baseURL: appConfig.backend_url,
    server: false,
    key: 'articles'
})

const articles = await queryContent<ContentType>()
    .only<['article_id', 'title', 'description', '_path']>([
        'article_id',
        'title',
        'description',
        '_path'
    ])
    .sort({ article_id: 1 })
    .find()
    .catch((err) => {
        console.log({ err, address: 'index page' })
    })

let sortedArticles: {
    [key: number]: ContentType
} = {}
watch(articleData, () => {
    console.log(articleData.value)
    if (articles && articleData.value) {
        for (const article of articles) {
            sortedArticles[article.article_id] = article
        }
        for (let i = 0; i < articleData.value.length; i++) {
            combinedInfo.value[i] = {
                ...articleData.value[i],
                ...sortedArticles[articleData.value[i].article_id]
            }
        }
    }
})
// if (articles && articleData.value) {
//     for (const article of articles) {
//         sortedArticles[article.article_id] = article
//     }
//     for (let i = 0; i < articleData.value.length; i++) {
//         combinedInfo[i] = {
//             ...articleData.value[i],
//             ...sortedArticles[articleData.value[i].article_id]
//         }
//     }
// }
onBeforeMount(() => {
    // const { data: posts } = useNuxtData('articles')
 
    refresh()
})
onMounted(() => {
    console.log(combinedInfo.value)
    if (error.value) {
        toastStore.addToast({ message: error.value.message, type: 'warning' })
    }
})

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
