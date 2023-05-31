<template>
    <main bg-gray-200 relative>
        <div
            flex
            flex-col
            items-center
            top-0
            w-full
            relative
            h-60
            justify-center
            style="background-image: url(/article-image.jpg)"
        >
            <div
                w-full
                h-full
                flex
                flex-col
                items-center
                justify-center
                class="bg-[rgb(255,255,255,0.2)] dark:bg-[rgb(0,0,0,0.5)]"
            >
                <UserAvatar rounded-10 h-20 w-20></UserAvatar>

                <UserName dark:text-gray-200 drop-shadow-lg></UserName>
            </div>
        </div>

        <div
            :style="{ '--un-bg-opacity': '1' }"
            bg-white
            text-sm
            font-medium
            text-center
            text-gray-500
            border-b
            border-gray-200
            dark:border-gray-700
            dark:bg-gray-700
            dark:text-gray-100
        >
            <ul @click="changeTab" class="flex flex-wrap -mb-px">
                <li class="mr-2">
                    <a
                        href="#"
                        class="inline-block p-4 rounded-t-lg active"
                        aria-current="page"
                        ref="initialFocus"
                    >
                        Favorites
                    </a>
                </li>
                <li class="mr-2">
                    <a
                        href="#"
                        class="inline-block p-4 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                    >
                        Profile
                    </a>
                </li>
            </ul>
            <div relative>
                <div
                    transition-all
                    ref="slider"
                    absolute
                    h-0.5
                    bg-blue-600
                ></div>
            </div>
            <div>
                <Profile v-show="pageTab === 'Profile'"></Profile>
                <Favorites v-show="pageTab === 'Favorites'"></Favorites>
            </div>
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
<script lang="ts" setup>
import Profile from './Profile.vue'
import Favorites from './Favorites.vue'
// const Profile = resolveComponent('./Profile')
import useUser from '~/stores/user'
const pageTab = ref('Favorites')
const slider = ref()
const page = ref('')
const appConfig = useAppConfig()
const user = useUser()
const initialFocus = ref()
import useToast from '~/stores/toast'
const toast = useToast()
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

interface Favorite {
    favorite_id: number
    favorite_user_id: number
    favorite_article_id: number
    favorite_date: string
    articles: Article
}
const favorites_data: Ref<Array<Favorite>> = ref([])
const combinedFavorite: Ref<Array<Favorite>> = ref([])
useFetch('/favorites', {
    baseURL: appConfig.backend_url,
    credentials: 'include',
    mode: 'cors',
    server: false,
    async onResponse(opt) {
        if (!opt.response.ok) {
            return
        }
        favorites_data.value = opt.response._data
        console.log(favorites_data.value)

        let articles_id: number[] = []
        for (const favorite of favorites_data.value) {
            articles_id.push(favorite.articles.article_id)
        }
        console.log(articles_id)
        const articles = await queryContent()
            .where({
                article_id: { $in: articles_id }
            })
            .only(['article_id', 'title', 'description', '_path'])
            .sort({ article_id: 1 })
            .find()
            .catch((err) => {
                console.log({ err, address: 'index page' })
            })
        let sortedArticles: {
            [key: number]: object
        } = {}
        console.log(articles)
        if (!articles) {
            return
        }
        for (const article of articles) {
            sortedArticles[article.article_id as number] = article
        }
        console.log(sortedArticles)
        for (let i = 0; i < favorites_data.value.length; i++) {
            favorites_data.value[i].articles = {
                ...favorites_data.value[i].articles,
                ...sortedArticles[favorites_data.value[i].articles.article_id]
            }
        }
        console.log(combinedFavorite)
    },
    onResponseError() {
        toast.addToast({ message: 'loading failed', type: 'warning' })
    }
})

onMounted(() => {
    slider.value.style.width =
        (initialFocus.value as HTMLElement).getBoundingClientRect().width + 'px'
    slider.value.style.left =
        (initialFocus.value as HTMLElement).getBoundingClientRect().left + 'px'
    ;(initialFocus.value as HTMLElement).style.color =
        'rgba(37, 99, 235, var(--un-text-opacity))'
})
function changeTab(e: MouseEvent) {
    // when the mount is not finished, don't do anything
    if (!slider.value) {
        return
    }
    // When click other zones, don't do anything
    if ((e.target as HTMLElement).tagName !== 'A') {
        return
    }
    const content = (e.target as HTMLElement).textContent
    if (content) {
        pageTab.value = content.trim()
    }
    console.log((e.target as HTMLElement).textContent?.trim())
    slider.value.style.width =
        (e.target as Element).getBoundingClientRect().width + 'px'
    slider.value.style.left =
        (e.target as Element).getBoundingClientRect().left + 'px'

    if ((e.target as HTMLElement).parentElement?.parentElement) {
        const children = Array.from(
            (e.target as HTMLElement).parentElement?.parentElement?.children ||
                []
        ) as HTMLElement[]
        children.forEach((child) => {
            ;(child.children[0] as HTMLElement).style.color = 'unset'
        })
    }
    ;(e.target as HTMLElement).style.color =
        'rgba(37, 99, 235, var(--un-text-opacity))'
}
</script>
