<script setup lang="ts">
import usePage from '../stores/page'
import useUser from '../stores/user'
import MaskLayer from './MaskLayer.vue'

const page = usePage()
const user = useUser()
const appConfig = useAppConfig()
const avatar_url = ref<HTMLImageElement>()

const themePanel = ref(false)
const personPanel = ref(false)
const username = ref('username')
function toggleThemePanel() {
  themePanel.value = !themePanel.value
  if (personPanel.value) {
    personPanel.value = false
  }
}
const mode = useColorMode({
  emitAuto: true,
})
function changeTheme(theme: 'light' | 'dark' | 'auto') {
  mode.value = theme
}
function togglePersonPanel() {
  personPanel.value = !personPanel.value
  if (themePanel.value) {
    themePanel.value = false
  }
}
onMounted(() => {
  if (avatar_url.value && user.avatar_path) {
    avatar_url.value.src = `${appConfig.backend_url}${user.avatar_path}`
  }
  document.documentElement.addEventListener('click', () => {
    if (themePanel.value) {
      themePanel.value = false
    }
    if (personPanel.value) {
      personPanel.value = false
    }
  })
})

setTimeout(() => {
  username.value = user.username
})

function logout() {
  fetch(`${appConfig.backend_url}/api/logout`, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  })
    .then(res => res.json())
    .then(async () => {
      user.logout()
    })
    .catch((err) => {
      console.error(err)
    })
}
</script>

<template>
  <MaskLayer z-20 />

  <header

    class="dark:b-[#363b3d] dark:bg-[#18191a]"

    sticky top-0 z-10 h-16 flex justify-center b-b-1 bg-white backdrop-filter
  >
    <div h-full max-w-7xl w-full flex items-center justify-between>
      <div lg:hidden @click="page.toggleMask">
        <div

          i-mdi-menu ml-4 cursor-pointer text-8 text-gray-700 dark:text-white
        />
      </div>
      <div

        class="logo"

        h-full flex items-center justify-center font-500 dark:text-white
      >
        <NuxtLink to="/">
          <NuxtImg w-16 src="/logo.png" />
        </NuxtLink>
        <nav class="<lg:hidden" items-center gap-8 lg:flex>
          <NuxtLink ml-30 hover:text-sky-500 to="/">
            主页
          </NuxtLink>
        </nav>
      </div>

      <div relative flex items-center class="settings" pr-4>
        <div class="<lg:hidden">
          <div
            mr-20

            cursor-pointer rounded-5 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 @click.stop="toggleThemePanel"
          >
            <div
              i-carbon-sun dark:i-carbon-moon cursor-pointer text-gray-6 dark:text-gray-300
            />
          </div>
          <div
            v-show="themePanel"

            absolute top-12 z-100 w-30 flex flex-col cursor-pointer overflow-hidden border-1 rounded-md bg-white text-sm text-gray-6 shadow-lg dark:b-gray-800 dark:bg-gray-600 dark:text-gray-200
          >
            <div

              flex items-center b-b-1 b-white p-2 dark:b-gray-800 hover:bg-gray-100 dark:hover:bg-gray-400
              @click="changeTheme('light')"
            >
              <div

                ml-1 mr-3 text-gray-6 dark:text-gray-100
                class="i-carbon-sun"
              />
              明亮
            </div>
            <div

              flex items-center b-b-1 b-white p-2 dark:b-gray-800 hover:bg-gray-100 dark:hover:bg-gray-400
              @click="changeTheme('dark')"
            >
              <div

                ml-1 mr-3 text-gray-6 dark:text-gray-100
                class="i-carbon-moon"
              />
              黑暗
            </div>
            <div
              flex

              items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-400 @click="changeTheme('auto')"
            >
              <div

                ml-1 mr-3 text-gray-6 dark:text-gray-100
                class="i-carbon-screen"
              />
              自动
            </div>
          </div>
        </div>
        <div>
          <div v-show="user.isLogin" relative>
            <div
              flex

              cursor-pointer items-center gap-5 @click.stop="togglePersonPanel"
            >
              <UserAvatar

                h-10 w-10 rounded-5 hover:shadow-lg
              />

              <UserName
                :title="user.username"

                class="<lg:hidden"

                w-20 cursor-pointer truncate lg:block dark:text-gray-300 hover:hover:text-sky-5
              />
            </div>

            <div

              v-show="personPanel" absolute right-0 top-12 w-30 flex flex-col overflow-hidden border-1 rounded-md bg-white text-sm text-gray-6 shadow-lg dark:b-gray-800 dark:bg-gray-600
              dark:text-gray-200
            >
              <NuxtLink to="/user">
                <div

                  flex cursor-pointer items-center b-b-1 b-white px-4 py-2 dark:b-gray-800 hover:bg-gray-100 dark:hover:bg-gray-400
                >
                  个人主页
                </div>
              </NuxtLink>
              <div

                flex
                cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400 @click="logout"
              >
                退出登录
              </div>
            </div>
          </div>
          <div v-show="!user.isLogin" dark:text-white>
            <NuxtLink to="/login">
              登录
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
    --un-bg-opacity: 0.8;
    --un-backdrop-blur: blur(0.75rem);
}
</style>
