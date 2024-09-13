<script setup lang="ts">
import useUser from '~/stores/user'

const props = defineProps<{ url?: string | null }>()
const appConfig = useAppConfig()
const user = useUser()
const imgUrl = ref('')

if (props.url) {
  imgUrl.value = props.url
}
else if (user.isLogin) {
  imgUrl.value = `${appConfig.backend_url}${user.avatar_path}`
}
onUpdated(() => {
  if (props.url) {
    imgUrl.value = props.url
  }
  else if (user.isLogin) {
    imgUrl.value = `${appConfig.backend_url}${user.avatar_path}`
  }
})
watch(
  () => user.avatar_path,
  async () => {
    await nextTick()
    imgUrl.value = `${appConfig.backend_url}${user.avatar_path}`
  },
)
</script>

<template>
  <img alt="user avatar" :src="imgUrl" hover:shadow-lg>
</template>
