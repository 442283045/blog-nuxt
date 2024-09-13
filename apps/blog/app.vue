<script setup lang="ts">
import useToast from './stores/toast'
import useUser from './stores/user'

import '@unocss/reset/tailwind-compat.css'
import './styles/global.css'

const toastStore = useToast()

const toasts = computed(() => {
  return toastStore.toasts
})
const user = useUser()
const appConfig = useAppConfig()

if (import.meta.client) {
  fetch(`${appConfig.backend_url}/api/check_login`, {
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        return
      }
      return res.json()
    })
    .then((data) => {
      if (data) {
        if (data.login === true) {
          user.$patch({
            avatar_path: data.user.avatar_path,
            email: data.user.email,
            username: data.user.username,
            id: data.user.userId,
            isLogin: true,
            bio: data.user.userBio ?? '',
          })
        }
      }
    })
}
</script>

<template>
  <div>
    <NuxtLayout>
      <div fixed bottom-5 right-5 z-10 flex flex-col gap-3>
        <ClientOnly>
          <TransitionGroup>
            <NewToast
              v-for="(toast) of toasts"
              :key="toast.id"
              :toast="toast"
            />
          </TransitionGroup>
        </ClientOnly>
      </div>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
/* .v-leave-active {
    position: absolute;
} */

.v-move,
.v-enter-active,
.v-leave-active {
    transition: all 0.5s ease;
}
.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateX(500px);
}
</style>
