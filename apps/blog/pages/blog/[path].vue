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
            h-50
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
                    v-if="isFavorite"
                    @click="removeFromFavorites"
                    class="i-tabler-star-filled"
                ></div>
                <div v-else @click="addToFavorites" class="i-tabler-star"></div>
            </div>
            <div py-3 b-b-1 b-gray-200 cursor-pointer text-5>
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
const toastStore = useToast()
const route = useRoute()
const router = useRouter()
const path = route.params.path
const apiConfig = useAppConfig()
import useUser from '~/stores/user'
const user = useUser()
if (route.path === '/') {
    router.push('/')
}
const isFavorite = ref(false)
function addToFavorites() {
    if (!route.query.id || !user.id) {
        return
    }

    useFetch('/add_favorite', {
        baseURL: apiConfig.backend_url,
        method: 'GET',
        query: {
            article_id: route.query.id,
            user_id: user.id
        },
        onResponse(opt) {
            console.log(opt)
            if (!opt.response.ok) {
                return
            }
            isFavorite.value = true
            toastStore.addToast({
                message: 'Favorite it successfully',
                type: 'success'
            })
        },
        onResponseError(opt) {
            isFavorite.value = false
            console.log(opt.response._data.message)
            toastStore.addToast({
                message: 'Favorite it unsuccessfully',
                type: 'warning'
            })
        }
    })
}
function removeFromFavorites() {
    isFavorite.value = false
}
</script>
