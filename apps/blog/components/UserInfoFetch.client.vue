<script setup lang="ts">
// fetch the user info from the server
import userStore from '~/stores/user'

const user = userStore()
const appConfig = useAppConfig()
fetch(`${appConfig.backend_url}/api/check_login`, {
  credentials: 'include',
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
          bio: data.user.userBio ?? '',
        })
      }
    }
  })
</script>
