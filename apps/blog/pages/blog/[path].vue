<script setup lang="ts">
import useToast from '~/stores/toast'
import useUser from '~/stores/user'
import '../../styles/markdown.css'

const toastStore = useToast()
const route = useRoute()
const router = useRouter()
const path = route.params.path
const apiConfig = useAppConfig()
const user = useUser()
if (route.path === '/') {
  router.push('/')
}
const isFavorite = ref(false)

if (user.isLogin) {
  const { data } = useFetch<{ status: boolean }>('/is_favorite', {
    baseURL: apiConfig.backend_url,
    method: 'GET',
    server: false,
    lazy: true,
    credentials: 'include',
    query: {
      article_id: route.query.id,
    },
  })

  watch(data, () => {
    if (data.value) {
      isFavorite.value = data.value.status
    }
  })
}
function addToFavorites() {
  if (!route.query.id || !user.id) {
    return toastStore.addToast({
      message: '请登录后再试',
      type: 'warning',
    })
  }

  useFetch('/add_favorite', {
    baseURL: apiConfig.backend_url,
    method: 'GET',
    query: {
      article_id: route.query.id,
      user_id: user.id,
    },
    credentials: 'include',
    onResponse(opt) {
      if (!opt.response.ok) {
        return
      }
      isFavorite.value = true
    },
    onResponseError() {
      isFavorite.value = false
      toastStore.addToast({
        message: '评论失败，请稍后再试',
        type: 'warning',
      })
    },
  })
}
function removeFromFavorites() {
  isFavorite.value = false
  useFetch('/remove_favorite', {
    baseURL: apiConfig.backend_url,
    method: 'GET',
    query: {
      article_id: route.query.id,
    },
    credentials: 'include',
    onResponse(opt) {
      if (!opt.response.ok) {
        return
      }
      isFavorite.value = false
      toastStore.addToast({
        message: opt.response._data.message,
        type: 'success',
      })
    },
    onResponseError() {
      isFavorite.value = false
      toastStore.addToast({
        message: '操作失败，请稍后再试',
        type: 'warning',
      })
    },
  })
}
</script>

<template>
  <main
    class="markdown dark:bg-[#25282a]"

    w-full flex flex-col items-center lg:pt-4
  >
    <div

      fixed bottom-10 right-10 w-10 flex flex-col items-center rounded-md bg-white shadow-lg
      class="<lg:hidden"
    >
      <div cursor-pointer b-b-1 b-gray-200 py-3 text-5>
        <div
          v-show="isFavorite"
          class="i-tabler-star-filled"
          @click="removeFromFavorites"
        />
        <div
          v-show="!isFavorite"
          class="i-tabler-star"
          @click="addToFavorites"
        />
      </div>
      <div cursor-pointer b-gray-200 py-3 text-5>
        <a href="#comments">
          <div
            text-gray-600
            class="i-mdi-comment-processing-outline"
          />
        </a>
      </div>
    </div>

    <article
      class="230, 227)] dark:text-[rgb(232, dark:bg-[#181a1b] dark:text-[#E8E6E3]"

      mx-4 max-w-5xl w-full flex flex-col justify-center bg-white p-4 lg:rounded-md md:p-16
    >
      <ContentDoc :path="`/${path}`">
        <template #default="{ doc }">
          <h1>{{ doc.title }}</h1>
          <div>{{ doc.description }}</div>
          <ContentRenderer :value="doc" />
        </template>
      </ContentDoc>
    </article>
    <Comment
      id="comments"

      class="dark:text-[rgb(232, 230, 227)] dark:bg-[#181a1b]" mx-4 max-w-5xl w-full flex flex-col justify-center bg-white p-4 lg:mt-4 lg:rounded-md
      md:p-16
    />
  </main>
</template>
