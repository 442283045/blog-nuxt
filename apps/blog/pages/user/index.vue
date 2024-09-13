<script lang="ts" setup>
import useToast from '~/stores/toast'
// const Profile = resolveComponent('./Profile')
import useUser from '~/stores/user'
import Favorites from './Favorites.vue'
import Profile from './Profile.vue'

const pageTab = ref('Favorites')
const slider = ref()
const appConfig = useAppConfig()
const user = useUser()
const initialFocus = ref()

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

// router guard
watch(user, () => {
  if (user.isLogin === false) {
    navigateTo('/login')
  }
})
const favorites_data: Ref<Array<Favorite>> = ref([])
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

    const articles_id: number[] = []
    for (const favorite of favorites_data.value) {
      articles_id.push(favorite.articles.article_id)
    }

    const articles = await queryContent()
      .where({
        article_id: { $in: articles_id },
      })
      .only(['article_id', 'title', 'description', '_path'])
      .sort({ article_id: 1 })
      .find()
      .catch((err) => {
        console.error({ err, address: 'index page' })
      })
    const sortedArticles: {
      [key: number]: object
    } = {}
    if (!articles) {
      return
    }
    for (const article of articles) {
      sortedArticles[article.article_id as number] = article
    }
    for (let i = 0; i < favorites_data.value.length; i++) {
      favorites_data.value[i].articles = {
        ...favorites_data.value[i].articles,
        ...sortedArticles[favorites_data.value[i].articles.article_id],
      }
    }
  },
  onResponseError() {
    toast.addToast({ message: 'loading failed', type: 'warning' })
  },
})

onMounted(() => {
  if (initialFocus.value) {
    slider.value.style.width
            = `${(initialFocus.value as HTMLElement).getBoundingClientRect().width
      }px`
    slider.value.style.left
            = `${(initialFocus.value as HTMLElement).getBoundingClientRect().left
      }px`
    ;(initialFocus.value as HTMLElement).style.color
            = 'rgba(37, 99, 235, var(--un-text-opacity))'
  }
})
function changeTab(e: MouseEvent) {
  // when the mount is not finished, don't do anything
  if (!slider.value || e.target === null) {
    return
  }

  // When click other zones, don't do anything
  if ((e.target as HTMLElement).tagName !== 'A') {
    return
  }
  const content = (e.target as HTMLElement).textContent?.trim()

  if (content) {
    switch (content) {
      case '收藏':
        pageTab.value = 'Favorites'
        break
      case '个人资料':
        pageTab.value = 'Profile'
        break
    }
  }
  slider.value.style.width
        = `${(e.target as Element).getBoundingClientRect().width}px`
  slider.value.style.left
        = `${(e.target as Element).getBoundingClientRect().left}px`

  if ((e.target as HTMLElement).parentElement?.parentElement) {
    const children = Array.from(
      (e.target as HTMLElement).parentElement?.parentElement?.children
      || [],
    ) as HTMLElement[]
    children.forEach((child) => {
      ;(child.children[0] as HTMLElement).style.color = 'unset'
    })
  }
  ;(e.target as HTMLElement).style.color
        = 'rgba(37, 99, 235, var(--un-text-opacity))'
}
</script>

<template>
  <main relative bg-gray-200>
    <div

      relative top-0 h-60 w-full flex flex-col items-center justify-center
      style="background-image: url(/article-image.jpg)"
    >
      <div

        h-full w-full flex flex-col items-center justify-center
        class="bg-[rgb(255,255,255,0.2)] dark:bg-[rgb(0,0,0,0.5)]"
      >
        <UserAvatar h-20 w-20 rounded-10 />

        <UserName drop-shadow-lg dark:text-gray-200 />
      </div>
    </div>

    <div
      :style="{ '--un-bg-opacity': '1' }"

      border-b border-gray-200 bg-white text-center text-sm text-gray-500 font-medium dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100
    >
      <ul class="flex flex-wrap -mb-px" @click="changeTab">
        <li class="mr-2">
          <a
            ref="initialFocus"
            href="#"
            class="active inline-block rounded-t-lg p-4"
            aria-current="page"
          >
            收藏
          </a>
        </li>
        <li class="mr-2">
          <a
            href="#"
            class="inline-block border-transparent rounded-t-lg p-4 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
          >
            个人资料
          </a>
        </li>
      </ul>
      <div relative>
        <div

          ref="slider"

          absolute h-0.5 bg-blue-600 transition-all
        />
      </div>
      <div>
        <Profile v-show="pageTab === 'Profile'" />
        <Favorites v-show="pageTab === 'Favorites'" />
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
