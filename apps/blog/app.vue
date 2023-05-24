<template>
    <div>
        <NuxtLayout>
            <Toast></Toast>
            <NuxtLoadingIndicator />
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>
<script setup lang="ts">
import '@unocss/reset/tailwind-compat.css'
import './styles/global.css'
import 'vue3-lottie/dist/style.css'
import useUser from './stores/user'
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
        console.log(data.value)
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

console.log(user.id)
</script>
