<template>
    <main
        class="markdown dark:bg-[#25282a]"
        w-full
        lg:pt-4
        flex
        flex-col
        items-center
    >
        <div
            flex
            items-center
            w-10
            flex-col
            fixed
            right-10
            bottom-10
            bg-white
            rounded-md
            shadow-lg
            class="<lg:hidden"
        >
            <div py-3 b-b-1 b-gray-200 cursor-pointer text-5>
                <div
                    v-show="isFavorite"
                    @click="removeFromFavorites"
                    class="i-tabler-star-filled"
                ></div>
                <div
                    v-show="!isFavorite"
                    @click="addToFavorites"
                    class="i-tabler-star"
                ></div>
            </div>
            <div py-3 b-gray-200 cursor-pointer text-5>
                <a href="#comments">
                    <div
                        text-gray-600
                        class="i-mdi-comment-processing-outline"
                    ></div>
                </a>
            </div>
        </div>

        <article
            class="dark:text-[#E8E6E3] dark:bg-[#181a1b] dark:text-[rgb(232, 230, 227)]"
            flex
            flex-col
            justify-center
            max-w-5xl
            w-full
            p-4
            mx-4
            md:p-16
            bg-white
            lg:rounded-md
        >
            <ContentDoc :path="`/${path}`">
                <template v-slot="{ doc }">
                    <h1>{{ doc.title }}</h1>
                    <div>{{ doc.description }}</div>
                    <ContentRenderer :value="doc" />
                </template>
            </ContentDoc>
        </article>
        <Comment
            class="dark:bg-[#181a1b] dark:text-[rgb(232, 230, 227)]"
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
            lg:rounded-md
            id="comments"
        ></Comment>
    </main>
</template>

<script setup lang="ts">
import '../../styles/markdown.css'
import useToast from '~/stores/toast'
import useUser from '~/stores/user'

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
            article_id: route.query.id
        }
    })

    watch(data, () => {
        if (data.value) {
            isFavorite.value = data.value.status
        }
    })
}
function addToFavorites() {
    if (!route.query.id || !user.id) {
        console.log(route.query.id)
        console.log(user.id)
        console.log('no id')
        return toastStore.addToast({
            message: '请登录后再试',
            type: 'warning'
        })
    }

    useFetch('/add_favorite', {
        baseURL: apiConfig.backend_url,
        method: 'GET',
        query: {
            article_id: route.query.id,
            user_id: user.id
        },
        credentials: 'include',
        onResponse(opt) {
            if (!opt.response.ok) {
                return
            }
            isFavorite.value = true
        },
        onResponseError(opt) {
            isFavorite.value = false
            console.log(opt.response._data.message)
            toastStore.addToast({
                message: '评论失败，请稍后再试',
                type: 'warning'
            })
        }
    })
}
function removeFromFavorites() {
    isFavorite.value = false
    useFetch('/remove_favorite', {
        baseURL: apiConfig.backend_url,
        method: 'GET',
        query: {
            article_id: route.query.id
        },
        credentials: 'include',
        onResponse(opt) {
            if (!opt.response.ok) {
                return
            }
            isFavorite.value = false
            toastStore.addToast({
                message: opt.response._data.message,
                type: 'success'
            })
        },
        onResponseError(opt) {
            isFavorite.value = false
            console.log(opt.response._data.message)
            toastStore.addToast({
                message: '操作失败，请稍后再试',
                type: 'warning'
            })
        }
    })
}
</script>
