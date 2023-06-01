<template>
    <div>
        <NuxtLayout>
            <div flex flex-col gap-3 z-10 fixed bottom-5 right-5>
                <TransitionGroup>
                    <NewToast
                        v-for="(toast, index) of toasts"
                        :toast="toast"
                        :key="toast.id"
                    ></NewToast>
                </TransitionGroup>
            </div>
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
const apiConfig = useAppConfig()

const {
    data,
    error
}: {
    data: any
    error: any
} = await useFetch('/api/check_login', {
    baseURL: apiConfig.backend_url,
    credentials: 'include',
    mode: 'cors',
    server: false,
    lazy: false
})

watch(data, () => {
    if (data.value) {
        if (data.value.login === true) {
            user.$patch({
                avatar_path: data.value.user.avatar_path,
                email: data.value.user.email,
                username: data.value.user.username,
                id: data.value.user.user_id,
                isLogin: true
            })
        }
    }
})
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
