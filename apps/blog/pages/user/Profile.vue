<template>
    <div flex justify-center items-center class="h-[calc(100vh-356px)]">
        <ClientOnly>
            <ImageCropper
                @close-image-cropper="closeCroppedImage"
                @get-cropped-image="handleCroppedImage"
                v-if="showImageCropper"
                :imageFile="imageFile"
            ></ImageCropper>
        </ClientOnly>
        <div
            font-500
            border-1
            rounded-md
            h-10
            px-5
            flex
            justify-center
            items-center
            cursor-pointer
            shadow-gray-400
            hover:shadow-lg
            hover:shadow-gray-300
            hover:border-blue-200
            @click="showEditProfile = true"
        >
            <div mr-2 i-carbon-edit></div>
            修改资料
        </div>

        <div
            v-show="showEditProfile"
            class="<md:w-100%"
            text-black
            w-200
            h-150
            dark:bg-gray-800
            bg-white
            rounded-md
            border-1
            top-30
            dark:border-gray-500
            dark:text-white
            fixed
        >
            <div
                dark:border-gray-500
                border-b-1
                p-5
                flex
                justify-center
                font-normal
                text-6
            >
                <div>修改资料</div>
                <div
                    @click="closeEditProfile"
                    right-5
                    absolute
                    cursor-pointer
                    i-carbon-close
                ></div>
            </div>
            <div pa-5>
                <div
                    dark:border-gray-500
                    relative
                    h-30
                    text-4
                    flex
                    border-b-1
                    pt-5
                >
                    <div>头像</div>
                    <div
                        absolute
                        class="top-50% left-50% -translate-x-10 -translate-y-10"
                    >
                        <UserAvatar
                            :url="avatarPath"
                            w-20
                            h-20
                            rounded-10
                        ></UserAvatar>
                        <div
                            right-0
                            bottom-0
                            absolute
                            border-1
                            w-6
                            h-6
                            class="rounded-50%"
                            bg-white
                            flex
                            justify-center
                            items-center
                            cursor-pointer
                            hover:border-gray-500
                        >
                            <div
                                @click="selectFile"
                                text-dark
                                i-carbon-edit
                            ></div>
                        </div>
                    </div>
                </div>
                <div
                    relative
                    text-4
                    flex
                    justify-between
                    border-b-1
                    items-center
                    dark:border-gray-500
                    font-normal
                    h-15
                >
                    <div w-30 text-left>邮箱</div>
                    <div
                        absolute
                        leading-10
                        rounded-md
                        focus:outline-none
                        w-full
                        focus:border-gray-300
                        outline-1
                        class="mr-20% top-50% left-50% -translate-x-50% -translate-y-50%"
                    >
                        {{ email }}
                    </div>
                </div>
                <div
                    relative
                    h-30
                    text-4
                    flex
                    justify-between
                    border-b-1
                    items-center
                    dark:border-gray-500
                    font-normal
                >
                    <div w-30 text-left>昵称</div>
                    <div relative class="mr-20%" w-100>
                        <input
                            w-full
                            bg-gray-200
                            dark:bg-gray-500
                            h-10
                            pl-3
                            rounded-md
                            border-1
                            @input="handleUsername"
                            focus:outline-none
                            focus:border-gray-300
                            outline-1
                            caret-red
                            type="text"
                            v-model="username"
                        />
                        <div text-xs text-gray-500 right-0 absolute>
                            {{ username?.length }}/30
                        </div>
                    </div>
                </div>
                <div
                    font-normal
                    relative
                    h-30
                    text-4
                    flex
                    justify-between
                    border-b-1
                    items-center
                    dark:border-gray-500
                >
                    <div text-left w-30>描述</div>
                    <div w-100 class="mr-20%" relative>
                        <textarea
                            dark:bg-gray-500
                            pl-3
                            w-full
                            bg-gray-200
                            h-20
                            rounded-md
                            border-1
                            focus:outline-none
                            focus:border-gray-300
                            outline-1
                            caret-red
                            type="text"
                            v-model="bio"
                            resize-none
                            p-3
                            @input="handleBio"
                        ></textarea>
                        <div text-xs text-gray-500 right-0 absolute>
                            {{ bio?.length }}/80
                        </div>
                    </div>
                </div>
                <div
                    relative
                    h-30
                    text-4
                    flex
                    justify-end
                    items-center
                    dark:border-gray-500
                    gap-5
                >
                    <div
                        dark:bg-gray-300
                        text-dark
                        border-gray-700
                        border-1
                        px-5
                        py-2
                        rounded-md
                        cursor-pointer
                        hover:bg-gray-100
                        @click="closeEditProfile"
                    >
                        退出
                    </div>
                    <div
                        dark:bg-gray-300
                        text-dark
                        border-gray-700
                        border-1
                        px-5
                        py-2
                        rounded-md
                        cursor-pointer
                        hover:bg-gray-100
                        @click="uploadProfile"
                    >
                        保存
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import useUser from '~/stores/user'
import useToast from '~/stores/toast'
const showEditProfile = ref(false)

// create a function to close the EditProfile and clear the formData
function closeEditProfile() {
    showEditProfile.value = false
    for (let key of formData.keys()) {
        formData.delete(key)
    }
}
const appConfig = useAppConfig()

const toast = useToast()
// import ImageCropper from './ImageCropper.vue'
const ImageCropper = defineAsyncComponent(() => import('./ImageCropper.vue'))
const user = useUser()
const username = ref('')
const bio = ref('')
onMounted(() => {
    username.value = user.username
    bio.value = user.bio
    console.log(user.bio)
})
// validate the username, if the username is not valid, show the error message
function handleUsername() {
    username.value = username.value.slice(0, 30)

    if (username.value !== user.username) {
        formData.set('username', username.value)
    } else {
        formData.delete('username')
    }
    return true
}
let email = ''
const showImageCropper = ref(false)

function handleBio() {
    bio.value = bio.value.slice(0, 80)
    if (bio.value !== user.bio) {
        formData.set('bio', bio.value)
    } else {
        formData.delete('bio')
    }
    return true
}
const imageFile = ref<File | null>(null)
onMounted(() => {
    email = user.email
})

function selectFile() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/png, image/jpeg' // Optional: Specify accepted file types

    fileInput.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement
        if (target.files) {
            imageFile.value = target.files[0]
            showImageCropper.value = true
            showEditProfile.value = false
        }
    })

    fileInput.click()
}
const formData = new FormData()
function closeCroppedImage() {
    showImageCropper.value = false
    showEditProfile.value = true
}

const avatarPath = ref<string | null>(null)
function handleCroppedImage(file: File) {
    /**
     * use set method to avoid user to repeat upload
     */
    formData.set('imageFile', file)

    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
        avatarPath.value = fileReader.result as string
    }
    console.log(formData.entries)
    console.log(formData.get('imageFile'))
}
async function uploadProfile() {
    // Perform the file upload using an HTTP request
    console.log('Uploading file...')
    // for (let key of formData.keys()) {
    //     console.log(formData.get(key))
    // }
    if (
        formData.get('imageFile') === null &&
        formData.get('username') === null &&
        formData.get('bio') === null
    ) {
        toast.addToast({
            message: 'Nothing changed',
            type: 'warning'
        })
        return
    }
    // return
    fetch(`${appConfig.backend_url}/update_profile`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
        .then((response) => response.json())
        .then(
            async (result: {
                status: boolean
                message: string
                user: { username: string; bio: string; avatar_path: string }
            }) => {
                console.log('Success:', result)
                if (result.status) {
                    toast.addToast({
                        message: result.message,
                        type: 'success'
                    })

                    user.$patch({
                        username: result.user.username,
                        bio: result.user.bio,
                        avatar_path: result.user.avatar_path
                    })
                    console.log(user)
                    closeEditProfile()
                } else {
                    toast.addToast({
                        message: result.message,
                        type: 'warning'
                    })
                }
            }
        )
        .catch((error) => {
            console.error('Error:', error)
        })
    // const { data: res, error } = await useFetch<{
    //     status: boolean
    //     message: string
    // }>('/update_profile', {
    //     method: 'POST',
    //     body: formData,
    //     server: false,
    //     credentials: 'include',
    //     baseURL: appConfig.backend_url
    // })
    // watch(res, () => {
    //     console.log('executed')
    //     if (res.value?.status) {
    //         console.log(toast.toasts)
    //         toast.addToast({
    //             message: res.value?.message,
    //             type: 'success'
    //         })
    //     }
    // })
    // console.log(error.value)
    // if (error.value !== null) {
    //     console.log(error.value)
    //     toast.addToast({
    //         message: res.value?.message
    //             ? res.value?.message
    //             : 'update profile failed',
    //         type: 'warning'
    //     })
    // }
}
</script>
