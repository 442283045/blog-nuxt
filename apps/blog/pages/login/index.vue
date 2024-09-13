<script setup lang="ts">
import { useField } from 'vee-validate'
import useToast from '~/stores/toast'
import useUser from '../../stores/user'

const user = useUser()
const toastStore = useToast()
definePageMeta({
  layout: false,
})

// router guard
watch(user, () => {
  if (user.isLogin === true) {
    navigateTo('/')
  }
})

const appConfig = useAppConfig()
function emailValidateField(value: string) {
  if (!value) {
    return 'Please input the email'
  }
  const emailPattern = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  if (!emailPattern.test(value)) {
    return 'This email is invalid'
  }

  return true
}
const {
  value: email,
  errorMessage: emailErrorMessage,
  validate: emailValidate,
} = useField('email', emailValidateField)
email.value = 'dangweizhai@gmail.com'
function passwordValidateField(value: string) {
  if (!value) {
    return 'Password is required'
  }

  if (value.length < 6) {
    return 'Password must contain at least 6 characters'
  }
  if (value.length > 20) {
    return 'Password must contain at most 20 characters'
  }
  if (!/^[\w!@#$%^&*()+\-=[\]{};':"\\|,.<>/?]{8,20}$/.test(value)) {
    return 'Password is invalid'
  }
  return true
}

const {
  value: password,
  errorMessage: passwordErrorMessage,
  validate: passwordValidate,
} = useField('fullName', passwordValidateField)
password.value = 'qq121274182'
async function signIn() {
  await Promise.all([emailValidate(), passwordValidate()]).catch((err) => {
    console.error(err)
  })

  if (emailErrorMessage.value || passwordErrorMessage.value) {
    return toastStore.addToast({
      message: '请输入合法的账号和密码',
      type: 'warning',
    })
  }
  useFetch(`/login`, {
    baseURL: appConfig.backend_url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
    credentials: 'include',
    mode: 'cors',
    onResponse: async (res) => {
      if (!res.response.ok) {
        return console.error('response error')
      }

      user.isLogin = true
      user.email = res.response._data.user.email
      user.username = res.response._data.user.username
      user.avatar_path = res.response._data.user.avatar_path
      user.id = res.response._data.user.userId

      navigateTo('/')
    },
    onResponseError: () => {
      return toastStore.addToast({
        message: '邮箱或密码不正确',
        type: 'warning',
      })
    },
  })
}
</script>

<template>
  <div
    dark:bg-gray-900
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 lg:px-8 sm:px-6"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          dark:text-white
          class="mt-6 text-center text-3xl text-gray-900 font-extrabold"
        >
          登录
        </h2>
      </div>
      <form novalidate class="mt-8 space-y-6" @submit.prevent="">
        <div flex flex-col gap-8 rounded-md shadow-sm>
          <div>
            <label for="email-address" class="sr-only">
              Email address
            </label>
            <input

              id="email-address"
              v-model="email"
              name="email"
              type="email"
              required dark:bg-gray-700 dark:caret-white
              class="relative block w-full appearance-none border border-gray-300 rounded-md rounded-t-md px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 sm:text-sm focus:outline-none focus:ring-indigo-500 placeholder-gray-500"
              placeholder="邮箱"
            >
            <div

              v-show="emailErrorMessage"

              absolute pl-2 text-red-500
            >
              {{ emailErrorMessage }}
            </div>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input

              id="password"
              v-model="password"
              name="password"
              type="password"
              required dark:bg-gray-700 dark:caret-white
              class="relative block w-full appearance-none border border-gray-300 rounded-md rounded-b-md px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 sm:text-sm focus:outline-none focus:ring-indigo-500 placeholder-gray-500"
              placeholder="密码"
            >
            <div

              v-show="passwordErrorMessage"

              absolute pl-2 text-red-500
            >
              {{ passwordErrorMessage }}
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center border border-transparent rounded-md bg-indigo-600 px-4 py-2 text-sm text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="signIn"
          >
            登录
          </button>
        </div>
      </form>
      <div text-gray-500>
        <NuxtLink
          to="/"
          cursor-pointer
          text-indigo-600
          hover:text-indigo-800
        >
          主页
        </NuxtLink>
        <div float-right>
          还没有账户,
          <NuxtLink
            to="/register"

            cursor-pointer text-indigo-600 hover:text-indigo-800
          >
            注册
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
