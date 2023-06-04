<script setup lang="ts">
// fetch the user info from the server
import userStore from '~/stores/user'
import useToast from '~/stores/toast'
const user = userStore()
const toast = useToast()
const appConfig = useAppConfig()
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
            if (data.login === true) {
                user.$patch({
                    avatar_path: data.user.avatar_path,
                    email: data.user.email,
                    username: data.user.username,
                    id: data.user.user_id,
                    isLogin: true,
                    bio: data.user.userBio ?? ''
                })
            }
        }
    })

// const toastStore = useToast()

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
<template></template>
