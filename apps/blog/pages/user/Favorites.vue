<script lang="ts" setup>
// const slider = ref()
// const page = ref('')
import useToast from '~/stores/toast'

const appConfig = useAppConfig()
// const user = useUser()
// const initialFocus = ref()

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
  article_cover: string
}

interface Favorite {
  favorite_id: number
  favorite_user_id: number
  favorite_article_id: number
  favorite_date: string
  articles: Article
}
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
      .only<
      ['article_id', 'title', 'description', '_path', 'article_cover']
    >(['article_id', 'title', 'description', '_path', 'article_cover'])
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
</script>

<template>
  <div
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
            articles: {
              article_comments_count,
              article_favorites_count,
              article_id,
              article_published_date,
              article_view_count,
              _path,
              description,
              title,
              article_cover,
            },
            favorite_id,
          } in favorites_data"
          :key="favorite_id"

          class="dark:bg-[#181a1b]"

          h-36 flex rounded-2 bg-white p-2 shadow-lg md:h-42
        >
          <div h-full flex items-center>
            <NuxtImg
              v-if="article_cover"
              :src="`/article-covers/${article_cover}`"
              alt="Discover Nuxt 3"
              width="128"
              height="128"
              rounded-2
              class="nuxt_img"
            />
          </div>

          <div
            class="dark:text-neutral-200"

            grid flex-1 justify-items-start px-4 py-1
          >
            <div truncate text-xl>
              <NuxtLink
                :to="
                  _path
                    ? `/blog${_path}?id=${article_id}`
                    : '/'
                "
                hover:text-sky-500
              >
                {{ title }}
              </NuxtLink>
            </div>
            <div h-18 text-sm font-normal>
              {{ description }}
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
                  <div>
                    {{ article_favorites_count }}
                  </div>
                </div>
                <div flex items-center gap-1>
                  <div i-mdi-comment-outline flex />
                  <div>
                    {{ article_comments_count }}
                  </div>
                </div>
                <div flex items-center gap-1>
                  <div i-mdi-eye-circle-outline />
                  <div>
                    {{ article_view_count }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
    .nuxt_img {
        width: 152px;
        height: 152px;
    }
}
</style>
