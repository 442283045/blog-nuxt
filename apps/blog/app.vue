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

useFetch('/api/check_login', {
    baseURL: apiConfig.backend_url,
    credentials: 'include',
    mode: 'cors',
    server: false,
    default: () => {
        return {
            login: false,
            user: { avatar_path: '', email: '', username: '', user_id: -1 }
        }
    }
})
    .then(({ data }) => {
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
    .catch((err) => {
        console.log(err)
    })
</script>
