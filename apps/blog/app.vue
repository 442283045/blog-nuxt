<template>
    <div>
        <NuxtLayout>
            <div flex flex-col gap-3 z-10 fixed bottom-5 right-5>
                <ClientOnly>
                    <TransitionGroup>
                        <NewToast
                            v-for="(toast, index) of toasts"
                            :toast="toast"
                            :key="toast.id"
                        ></NewToast>
                    </TransitionGroup>
                </ClientOnly>
            </div>
            <!-- <UserInfoFetch></UserInfoFetch> -->
            <NuxtLoadingIndicator />
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import './styles/global.css'

import useUser from './stores/user'
import useToast from './stores/toast'
const toastStore = useToast()

const toasts = computed(() => {
    return toastStore.toasts
})
const user = useUser()
const appConfig = useAppConfig()

if (process.client) {
    fetch(`${appConfig.backend_url}/api/check_login`, {
        credentials: 'include'
    })
        .then((res) => {
            if (!res.ok) {
                return
            }
            return res.json()
        })
        .then((data) => {
            if (data) {
                console.log(data)
                if (data.login === true) {
                    user.$patch({
                        avatar_path: data.user.avatar_path,
                        email: data.user.email,
                        username: data.user.username,
                        id: data.user.userId,
                        isLogin: true,
                        bio: data.user.userBio ?? ''
                    })
                    console.log(user)
                }
            }
        })
}
// const { data, error } = await useFetch<{
//     user: {
//         avatar_path: string
//         email: string
//         username: string
//         user_id: number
//         userBio: string
//     }
//     login: boolean
// }>('/api/check_login', {
//     baseURL: appConfig.backend_url,
//     credentials: 'include',
//     mode: 'cors',
//     server: false,
//     lazy: false
// })

// watch(data, () => {
//     if (data.value) {
//         if (data.value.login === true) {
//             user.$patch({
//                 avatar_path: data.value.user.avatar_path,
//                 email: data.value.user.email,
//                 username: data.value.user.username,
//                 id: data.value.user.user_id,
//                 isLogin: true,
//                 bio: data.value.user.userBio ?? ''
//             })
//         }
//     }
// })
</script>
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
