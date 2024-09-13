<script setup lang="ts">
import useUser from '../stores/user'

const user = useUser()

const username = ref('username')

setTimeout(() => {
  username.value = user.username
})
watch(
  () => user.username,
  () => {
    username.value = user.username
  },
)
</script>

<template>
  <div>
    {{ username }}
  </div>
</template>
