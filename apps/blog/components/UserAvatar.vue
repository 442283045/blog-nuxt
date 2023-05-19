<template>
    <img alt="user avatar" :src="imgUrl" hover:shadow-lg />
</template>
<script setup lang="ts">
import useUser from '~/stores/user'
const appConfig = useAppConfig()
const user = useUser()

const imgUrl = ref('')
onMounted(() => {
    if (user.isLogin) {
        imgUrl.value = `${appConfig.backend_url}${user.avatar_path}`
    }
})
</script>
