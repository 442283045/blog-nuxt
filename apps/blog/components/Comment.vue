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
            <div v-if="user.isLogin" @click.stop="" flex mt-4>
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
                            focus:outline-none
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
            <div py-5 v-else text-white text-gray-400>
                You haven't logged in yet,
                <NuxtLink to="/login">login</NuxtLink>
                to comment
            </div>
        </div>
        <div
            class="dark:text-[#B4AEA4]"
            b-b-1
            b-gray-200
            dark:b-gray-500
            flex
            my-5
            v-for="{
                comment_id,
                content,
                published_date,
                author_id,
                username,
                avatar_path
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
                    <div>{{ published_date }}</div>
                </div>
                <div
                    class="dark:text-[#B4AEA4]"
                    my-4
                    w-full
                    text-sm
                    text-neutral-600
                >
                    {{ content }}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import useUser from '~/stores/user'

const comment = ref('')
const showComment = ref(false)
const button = ref()
const apiConfig = useAppConfig()
const route = useRoute()
const user = useUser()
const { showToast, ToastType } = useToast()
// const comments = ref({})
const { data, error } = await useFetch(
    `/comments?article_id=${route.query.id}`,
    {
        baseURL: apiConfig.backend_url,
        default: () => {
            return {
                data: [
                    {
                        comment_id: 0,
                        content: '',
                        published_date: '',
                        author_id: 0,
                        article_id: 0,
                        username: '',
                        avatar_path: ''
                    }
                ]
            }
        }
    }
)
const comments = data.value?.data

function submitComment() {
    if (comment.value !== '' && user.id && route.query.id) {
        fetch(`${apiConfig.backend_url}/add_comment`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                author_id: user.id,
                article_id: route.query.id,
                content: comment.value
            })
        })
            .then((res) => {
                return res.json()
            })
            .then((res) => {
                if (!res.status) {
                    return showToast({
                        message: res.message,
                        type: ToastType.Warning
                    })
                }
                showToast({
                    message: res.message,
                    type: ToastType.Success
                })
            })
            .catch((err) => {})
    } else {
    }
}
function isDisableButton() {
    if (comment.value.trim() === '') {
        button.value.disabled = true
    } else {
        button.value.disabled = false
    }
}
onMounted(() => {
    document.documentElement.addEventListener('click', () => {
        showComment.value = false
    })
})
</script>
<style scoped></style>
