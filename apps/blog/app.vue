<template>
    <div>
        <NuxtLayout>
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
            user.isLogin = true
            console.log(res.user)
            user.avatar_path = res.user.avatar_path
            user.email = res.user.email
            user.username = res.user.username
            user.id = res.user.id
            console.log(user)
        } else {
            console.log(res)
        }
        console.log('success')
    })
    .catch((err) => {
        console.log(err)
    })
</script>
