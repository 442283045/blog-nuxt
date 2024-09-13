<script lang="ts" setup>
import useToast from '~/stores/toast'
import useUser from '~/stores/user'

const comment = ref('')
const showComment = ref(false)
const button = ref()
const apiConfig = useAppConfig()
const route = useRoute()
const user = useUser()
const toastStore = useToast()
interface Comment {
  comment_id: number
  comment_content: string
  comment_published_date: string
  comment_author_user_id: number
  comment_article_id: number
  username: string
  avatar_path: string
}

const { data, error, refresh } = await useFetch<{ data: Comment[] }>(
  `/comments?article_id=${route.query.id}`,
  {
    baseURL: apiConfig.backend_url,

    key: 'comments',
    server: false,
  },
)
const comments = computed(() => data.value?.data)
onBeforeMount(() => {
  refresh()
})
onMounted(async () => {
  if (error.value) {
    await nextTick()
    toastStore.addToast({
      message: '网络错误，请稍后再试',
      type: 'warning',
    })
  }
})

async function submitComment() {
  if (!(comment.value !== '' && user.id && route.query.id)) {
    toastStore.addToast({
      message: '你还不能评论',
      type: 'warning',
    })
  }
  useFetch(`/add_comment`, {
    baseURL: apiConfig.backend_url,
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      article_id: route.query.id,
      content: comment.value,
    }),
    onResponse: () => {
      comment.value = ''
      button.value.blur()
      isDisableButton()
      showComment.value = false
      refreshNuxtData('comments')
    },
    onResponseError: (res) => {
      if (!res.response.ok) {
        toastStore.addToast({
          message: '发表评论失败，请稍后再试',
          type: 'warning',
        })
      }
    },
  })
}
function isDisableButton() {
  if (comment.value === '') {
    button.value.disabled = true
    button.value.style.cursor = 'not-allowed'
  }
  else {
    button.value.disabled = false
    button.value.style.cursor = 'pointer'
  }
}
onMounted(() => {
  document.documentElement.addEventListener('click', () => {
    showComment.value = false
  })
})
</script>

<template>
  <div

    mx-4 max-w-5xl w-full flex flex-col justify-center bg-white p-4 lg:mt-4 lg:rounded-4 md:p-16
  >
    <div class="dark:text-[#E8E6E3]" text-xl font-bold>
      Comments
    </div>
    <div>
      <div v-show="user.isLogin" mt-4 flex @click.stop="">
        <UserAvatar h-10 w-10 rounded-5 />
        <div ml-10 w-full>
          <textarea
            v-model.trim="comment"

            class="dark:bg-[#1e2021] dark:caret-white dark:focus:bg-[#1e2021] dark:focus:outline-none"

            placeholder=" Add a comment..."

            rows="3"

            w-full resize-none appearance-none border-1 rounded-md bg-neutral-100 p-3 outline-1 focus:bg-white dark:text-gray-300 placeholder:text-gray-400 focus:outline-blue-500
            @click="
              () => {
                showComment = true
                isDisableButton()
              }
            "
            @input="isDisableButton"
          />
          <div v-show="showComment">
            <button

              ref="button"
              float-right border-0 rounded-full bg-blue-500 px-6 py-2 text-white transition-all duration-150 focus:border-blue-900 active:bg-blue-800 dark:bg-gray-500 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:hover:bg-gray-700
              @click="submitComment"
            >
              comment
            </button>
          </div>
        </div>
      </div>
      <div v-show="!user.isLogin" py-5 text-gray-400 text-white>
        You haven't logged in yet,
        <NuxtLink to="/login">
          login
        </NuxtLink>
        to comment
      </div>
    </div>
    <div
      v-for="{
        username,
        comment_id,
        avatar_path,
        comment_content,
        comment_published_date,
      } in comments"

      :key="comment_id" class="dark:text-[#B4AEA4]" my-5 flex b-b-1
      b-gray-200
      dark:b-gray-700
    >
      <img

        h-10 w-10 rounded-5
        :src="`${apiConfig.backend_url}${avatar_path}`"
        alt="user avatar"
      >
      <div ml-10 w-full flex flex-col items-center>
        <div

          class="dark:text-[#B4AEA4]"

          w-full flex items-center justify-between text-sm text-gray-5 leading-10
        >
          <div w-30 truncate>
            {{ username }}
          </div>
          <div>{{ formatChineseTime(comment_published_date) }}</div>
        </div>
        <div
          class="dark:text-[#B4AEA4]"
          my-4
          w-full
          text-sm
          text-neutral-600
        >
          {{ comment_content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
