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
        <div text-xl font-bold>Comments</div>

        <div @click.stop="" flex mt-4>
            <UserAvatar w-10 h-10 rounded-5></UserAvatar>
            <div ml-10 w-full>
                <textarea
                    resize-none
                    placeholder="Add a comment..."
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
        <div b-b-1 flex my-5 v-for="i in 10" :key="i">
            <UserAvatar rounded-5 w-10 h-10></UserAvatar>
            <div ml-10 w-full flex items-center flex-col>
                <div
                    items-center
                    text-gray-5
                    text-sm
                    w-full
                    flex
                    justify-between
                    leading-10
                >
                    <UserName truncate w-30></UserName>
                    <div>one month ago</div>
                </div>
                <div my-4 w-full text-sm text-neutral-600>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Eveniet placeat molestiae blanditiis dolorem quos autimpedit
                    consequuntur, magni saepe fugit omnis, repudiandae magnam
                    officia alias aperiam perspiciatis iure expedita minima.
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
                console.log(res)
                return res.json()
            })
            .then((res) => {
                console.log(res)
            })
    } else {
        console.log('error')
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
