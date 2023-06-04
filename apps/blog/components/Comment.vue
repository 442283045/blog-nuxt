<template>
    <div
        lg:mt-4
        flex
        flex-col
        justify-center
        max-w-5xl
        w-full
        p-4
        mx-4
        md:p-16
        bg-white
        lg:rounded-4
    >
        <div class="dark:text-[#E8E6E3]" text-xl font-bold>Comments</div>
        <div>
            <div v-show="user.isLogin" @click.stop="" flex mt-4>
                <UserAvatar w-10 h-10 rounded-5></UserAvatar>
                <div ml-10 w-full>
                    <textarea
                        class="dark:bg-[#1e2021] dark:caret-white dark:focus:outline-none dark:focus:bg-[#1e2021]"
                        resize-none
                        placeholder=" Add a comment..."
                        border-1
                        outline-1
                        rows="3"
                        rounded-md
                        v-model.trim="comment"
                        p-3
                        w-full
                        appearance-none
                        focus:outline-blue-500
                        bg-neutral-100
                        focus:bg-white
                        placeholder:text-gray-400
                        dark:text-gray-300
                        @click="
                            () => {
                                showComment = true
                                isDisableButton()
                            }
                        "
                        @input="isDisableButton"
                    ></textarea>
                    <div v-show="showComment">
                        <button
                            px-6
                            py-2
                            text-white
                            bg-blue-500
                            border-0
                            rounded-full
                            hover:bg-blue-700
                            active:bg-blue-800
                            dark:bg-gray-500
                            focus:outline-none
                            dark:hover:bg-gray-700
                            focus:border-blue-900
                            focus:ring-2
                            focus:ring-blue-300
                            transition-all
                            duration-150
                            float-right
                            @click="submitComment"
                            disabled:opacity-50
                            ref="button"
                        >
                            comment
                        </button>
                    </div>
                </div>
            </div>
            <div py-5 v-show="!user.isLogin" text-white text-gray-400>
                You haven't logged in yet,
                <NuxtLink to="/login">login</NuxtLink>
                to comment
            </div>
        </div>
        <div
            class="dark:text-[#B4AEA4]"
            b-b-1
            b-gray-200
            dark:b-gray-700
            flex
            my-5
            v-for="{
                username,
                comment_id,
                avatar_path,
                comment_article_id,
                comment_author_user_id,
                comment_content,
                comment_published_date
            } in comments"
            :key="comment_id"
        >
            <img
                rounded-5
                w-10
                h-10
                :src="`${apiConfig.backend_url}${avatar_path}`"
                alt="user avatar"
            />
            <div ml-10 w-full flex items-center flex-col>
                <div
                    items-center
                    class="dark:text-[#B4AEA4]"
                    text-gray-5
                    text-sm
                    w-full
                    flex
                    justify-between
                    leading-10
                >
                    <div truncate w-30>{{ username }}</div>
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
<script lang="ts" setup>
import useUser from '~/stores/user'
import useToast from '~/stores/toast'

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
        server: false
    }
)
const comments = computed(() => data.value?.data)
onBeforeMount(() => {
    refresh()
})
onMounted(() => {
    if (error.value) {
        console.log(error)
        toastStore.addToast({
            message: 'Something went wrong',
            type: 'warning'
        })
    }
})

async function submitComment() {
    if (!(comment.value !== '' && user.id && route.query.id)) {
        toastStore.addToast({
            message: 'Something went wrong',
            type: 'warning'
        })
    }
    useFetch(`/add_comment`, {
        baseURL: apiConfig.backend_url,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            article_id: route.query.id,
            content: comment.value
        }),
        onResponse: () => {
            comment.value = ''
            button.value.blur()
            isDisableButton()
            showComment.value = false
            refreshNuxtData('comments')
            toastStore.addToast({
                message: 'Comment added successfully',
                type: 'warning'
            })
        },
        onResponseError: (res) => {
            if (!res.response.ok) {
                toastStore.addToast({
                    message: 'fail to publish comment',
                    type: 'warning'
                })
            }
        }
    })
}
function isDisableButton() {
    if (comment.value === '') {
        button.value.disabled = true
        button.value.style.cursor = 'not-allowed'
    } else {
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
<style scoped></style>
