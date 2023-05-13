<template>
    <img alt="user avatar" ref="avatar_url" hover:shadow-lg />
</template>
<script setup lang="ts">
import useUser from '~/stores/user'
const appConfig = useAppConfig()
const user = useUser()
let avatar_url = ref<HTMLImageElement>()
onMounted(() => {
    if (avatar_url.value && user.avatar_path) {
        avatar_url.value.src = `${appConfig.backend_url}${user.avatar_path}`
    }
})
</script>
