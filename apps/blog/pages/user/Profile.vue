<template>
    <div flex justify-center items-center class="h-[calc(100vh-356px)]">
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
            @click="isEditProfileOpen = true"
        >
            <div mr-2 i-carbon-edit></div>
            Edit profile
        </div>

        <div
            v-show="isEditProfileOpen"
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
                <div>Edit profile</div>
                <div
                    @click="isEditProfileOpen = false"
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
                    <div>Profile photo</div>
                    <div
                        absolute
                        class="top-50% left-50% -translate-x-10 -translate-y-10"
                    >
                        <UserAvatar w-20 h-20 rounded-10></UserAvatar>
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
                    <div w-30 text-left>Email</div>
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
                    <div w-30 text-left>Username</div>
                    <input
                        w-100
                        bg-gray-200
                        dark:bg-gray-500
                        h-10
                        pl-3
                        rounded-md
                        border-1
                        focus:outline-none
                        focus:border-gray-300
                        outline-1
                        class="mr-20%"
                        caret-red
                        type="text"
                        v-model="username"
                    />
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
                    <div text-left w-30>Bio</div>
                    <textarea
                        dark:bg-gray-500
                        pl-3
                        w-100
                        bg-gray-200
                        h-20
                        rounded-md
                        border-1
                        focus:outline-none
                        focus:border-gray-300
                        outline-1
                        class="mr-20%"
                        caret-red
                        type="text"
                        v-model="bio"
                        resize-none
                        p-3
                    ></textarea>
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
                    >
                        Cancel
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
                        Save
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
const isEditProfileOpen = ref(false)
import useUser from '~/stores/user'
const user = useUser()
const username = ref(user.username)
let email = ''

const bio = ref('')
onMounted(() => {
    email = user.email
})
let avatarFile: File | null = null
function selectFile() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/png, image/jpeg' // Optional: Specify accepted file types

    fileInput.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement
        if (target.files) {
            avatarFile = target.files[0]
            console.log(target.files[0])
        }
    })

    fileInput.click()
}
import appConfig from '~/app.config'

function uploadProfile() {
    console.log(avatarFile)
    if (avatarFile) {
        const formData = new FormData()
        formData.append('imageFile', avatarFile)

        // Perform the file upload using an HTTP request
        console.log('Uploading file...')
        useFetch('/update_profile', {
            method: 'POST',
            body: formData,
            server: false,
            credentials: 'include',
            baseURL: appConfig.backend_url
        })
    }
}
</script>
