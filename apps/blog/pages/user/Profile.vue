<script lang="ts" setup>
import useToast from '~/stores/toast'
import useUser from '~/stores/user'

const showEditProfile = ref(false)
const formData = new FormData()

// create a function to close the EditProfile and clear the formData
function closeEditProfile() {
  showEditProfile.value = false
  for (const key of formData.keys()) {
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
})
// validate the username, if the username is not valid, show the error message
function handleUsername() {
  username.value = username.value.slice(0, 30)

  if (username.value !== user.username) {
    formData.set('username', username.value)
  }
  else {
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
  }
  else {
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
}
async function uploadProfile() {
  // Perform the file upload using an HTTP request
  if (
    formData.get('imageFile') === null
    && formData.get('username') === null
    && formData.get('bio') === null
  ) {
    toast.addToast({
      message: 'Nothing changed',
      type: 'warning',
    })
    return
  }
  // return
  fetch(`${appConfig.backend_url}/update_profile`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })
    .then(response => response.json())
    .then(
      async (result: {
        status: boolean
        message: string
        user: { username: string, bio: string, avatar_path: string }
      }) => {
        if (result.status) {
          toast.addToast({
            message: result.message,
            type: 'success',
          })

          user.$patch({
            username: result.user.username,
            bio: result.user.bio,
            avatar_path: result.user.avatar_path,
          })
          closeEditProfile()
        }
        else {
          toast.addToast({
            message: result.message,
            type: 'warning',
          })
        }
      },
    )
    .catch((error) => {
      console.error('Error:', error)
    })
}
</script>

<template>
  <div flex items-center justify-center class="h-[calc(100vh-356px)]">
    <ClientOnly>
      <ImageCropper
        v-if="showImageCropper"
        :image-file="imageFile"
        @close-image-cropper="closeCroppedImage"
        @get-cropped-image="handleCroppedImage"
      />
    </ClientOnly>
    <div

      h-10 flex cursor-pointer items-center justify-center border-1 rounded-md px-5 font-500 shadow-gray-400 hover:border-blue-200 hover:shadow-gray-300 hover:shadow-lg
      @click="showEditProfile = true"
    >
      <div i-carbon-edit mr-2 />
      修改资料
    </div>

    <div
      v-show="showEditProfile"
      class="<md:w-100%"

      fixed top-30 h-150 w-200 border-1 rounded-md bg-white text-black dark:border-gray-500 dark:bg-gray-800 dark:text-white
    >
      <div

        flex justify-center border-b-1 p-5 text-6 font-normal dark:border-gray-500
      >
        <div>修改资料</div>
        <div
          i-carbon-close

          absolute right-5 cursor-pointer @click="closeEditProfile"
        />
      </div>
      <div pa-5>
        <div

          relative h-30 flex border-b-1 pt-5 text-4 dark:border-gray-500
        >
          <div>头像</div>
          <div
            absolute
            class="left-50% top-50% -translate-x-10 -translate-y-10"
          >
            <UserAvatar
              :url="avatarPath"

              h-20 w-20 rounded-10
            />
            <div

              class="rounded-50%"

              absolute bottom-0 right-0 h-6 w-6 flex cursor-pointer items-center justify-center border-1 bg-white hover:border-gray-500
            >
              <div
                i-carbon-edit

                text-dark @click="selectFile"
              />
            </div>
          </div>
        </div>
        <div

          relative h-15 flex items-center justify-between border-b-1 text-4 font-normal dark:border-gray-500
        >
          <div w-30 text-left>
            邮箱
          </div>
          <div

            absolute w-full rounded-md leading-10 outline-1 focus:border-gray-300 focus:outline-none
            class="left-50% top-50% mr-20% -translate-x-50% -translate-y-50%"
          >
            {{ email }}
          </div>
        </div>
        <div

          relative h-30 flex items-center justify-between border-b-1 text-4 font-normal dark:border-gray-500
        >
          <div w-30 text-left>
            昵称
          </div>
          <div relative class="mr-20%" w-100>
            <input

              v-model="username"

              h-10 w-full border-1 rounded-md bg-gray-200 pl-3 caret-red outline-1 focus:border-gray-300 dark:bg-gray-500 focus:outline-none
              type="text"
              @input="handleUsername"
            >
            <div absolute right-0 text-xs text-gray-500>
              {{ username?.length }}/30
            </div>
          </div>
        </div>
        <div

          relative h-30 flex items-center justify-between border-b-1 text-4 font-normal dark:border-gray-500
        >
          <div w-30 text-left>
            描述
          </div>
          <div class="mr-20%" relative w-100>
            <textarea

              v-model="bio"
              type="text"

              h-20 w-full resize-none border-1 rounded-md bg-gray-200 p-3 pl-3 caret-red outline-1 focus:border-gray-300 dark:bg-gray-500 focus:outline-none
              @input="handleBio"
            />
            <div absolute right-0 text-xs text-gray-500>
              {{ bio?.length }}/80
            </div>
          </div>
        </div>
        <div

          relative h-30 flex items-center justify-end gap-5 text-4 dark:border-gray-500
        >
          <div

            cursor-pointer border-1 border-gray-700 rounded-md px-5 py-2 text-dark dark:bg-gray-300 hover:bg-gray-100
            @click="closeEditProfile"
          >
            退出
          </div>
          <div

            cursor-pointer border-1 border-gray-700 rounded-md px-5 py-2 text-dark dark:bg-gray-300 hover:bg-gray-100
            @click="uploadProfile"
          >
            保存
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
