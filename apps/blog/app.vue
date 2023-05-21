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

fetch(`${apiConfig.backend_url}/api/check_login`, {
    credentials: 'include',
    mode: 'cors'
})
    .then((res) => res.json())
    .then((res) => {
        console.log(res)
        if (res.login === true) {
            user.$patch({
                avatar_path: res.user.avatar_path,
                email: res.user.email,
                username: res.user.username,
                id: res.user.id,
                isLogin: true
            })
            console.log('patch successfully')
        } else {
            console.log(res)
        }
    })
    .catch((err) => {
        console.log(err)
    })
</script>
