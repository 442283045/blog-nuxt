<script setup lang="ts">
import useToast from '~/stores/toast'
import formatChineseTime from '~/utils/formatChineseTime'

useHead({
  title: 'Cows and Horses',
  meta: [
    {
      name: 'description',
      content: 'Cows and Horses Blog - A simple blog wrote by Nuxt3',
      hid: 'description',
      property: 'og:description',
    },
    {
      name: 'keywords',
      content: 'Cows and Horses, blog, nuxt3, web develop',
    },
  ],
})

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
  article_cover: string
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
  article_cover: string
}
const toastStore = useToast()
const appConfig = useAppConfig()

const combinedInfo: Ref<Record<number, Article>> = ref([])

const articles = await queryContent<ContentType>()
  .only<['article_id', 'title', 'description', '_path', 'article_cover']>([
    'article_id',
    'title',
    'description',
    '_path',
    'article_cover',
  ])
  .sort({ article_id: 1 })
  .find()
  .catch((err) => {
    console.error({ err, address: 'index page' })
  })

const sortedArticles: {
  [key: number]: ContentType
} = {}
// const { data: posts } = useNuxtData('articles')
const {
  data: articleData,
  error,
  refresh,
} = await useFetch<Array<ArticleData>>('/articles', {
  baseURL: appConfig.backend_url,
  server: false,
  key: 'articles',
  lazy: false,
  immediate: false,
})
watch(articleData, () => {
  if (articles && articleData.value) {
    for (const article of articles) {
      sortedArticles[article.article_id] = article
    }
    for (let i = 0; i < articleData.value.length; i++) {
      combinedInfo.value[i] = {
        ...articleData.value[i],
        ...sortedArticles[articleData.value[i].article_id],
      }
    }
  }
})
onBeforeMount(async () => {
  refresh()
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
// multiline ellipsis
onMounted(() => {
  if (description.value) {
    ;(description.value as Array<HTMLElement>).forEach((element) => {
      const mediaQuery = window.matchMedia('(min-width: 768px)')
      mediaQuery.addEventListener('change', styleChange)
      function styleChange() {
        const styleDeclaration
                    = element.style as CustomCSSStyleDeclaration
        if (mediaQuery.matches) {
          styleDeclaration['-webkit-line-clamp'] = '3'
          styleDeclaration.display = '-webkit-box'
          styleDeclaration['-webkit-box-orient'] = 'vertical'
          styleDeclaration.overflow = 'hidden'
          styleDeclaration['text-overflow'] = 'ellipsis'
          styleDeclaration.display = 'block'
        }
        else {
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

<template>
  <main
    w-full
    flex
    justify-center
    bg-gray-200
    class="min-h-[calc(100vh-4rem)] dark:bg-[#25282a]"
  >
    <div h-full max-w-5xl w-full flex flex-col justify-between>
      <ul m-4 flex flex-col gap-4>
        <li
          v-for="{
            article_id,
            title,
            description: _description,
            _path,
            article_published_date,
            article_comments_count,
            article_favorites_count,
            article_view_count,
            article_cover,
          } in combinedInfo"
          :key="article_id"

          class="dark:bg-[#181a1b]"

          h-36 flex rounded-2 bg-white p-2 shadow-lg md:h-42
        >
          <div h-full flex items-center>
            <NuxtImg
              :src="`/article-covers/${article_cover}`"
              alt="Discover Nuxt 3"
              width="128"
              height="128"
              rounded-2
              class="nuxt_img"
            />
          </div>
          <div class="dark:text-neutral-200" grid flex-1 px-4 py-1>
            <div truncate text-xl>
              <NuxtLink
                :to="`/blog${_path}?id=${article_id}`"
                hover:text-sky-500
              >
                {{ title }}
              </NuxtLink>
            </div>
            <div ref="description" h-18 text-sm>
              {{ _description }}
            </div>
            <div

              w-full flex items-end justify-between text-xs text-gray-500
            >
              <div text-gray-500>
                {{ formatChineseTime(article_published_date) }}
              </div>
              <div flex items-end gap-4>
                <div flex items-center gap-1>
                  <div i-tabler-star flex />
                  <div>{{ article_favorites_count }}</div>
                </div>
                <div flex items-center gap-1>
                  <div i-mdi-comment-outline flex />
                  <div>{{ article_comments_count }}</div>
                </div>
                <div flex items-center gap-1>
                  <div i-mdi-eye-circle-outline />
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
