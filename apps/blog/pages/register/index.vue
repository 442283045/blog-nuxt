<script setup lang="ts">
// import Toast from '../../components/Toast.vue'
import { useField } from 'vee-validate'

import useToast from '~/stores/toast'
import useUser from '../../stores/user'

const toastStore = useToast()
const user = useUser()

definePageMeta({
  layout: false,
})
enum sendState {
  sendCode = 'Send code',
  sending = 'Sending',
  resend = 'Resend',
}

// router guard
watch(user, () => {
  if (user.isLogin === true) {
    navigateTo('/')
  }
})
const messageState = ref<sendState>(sendState.sendCode)
const resendTime = ref(120)
watch(messageState, () => {
  if (messageState.value === sendState.resend) {
    const interval = setInterval(() => {
      resendTime.value--
      if (resendTime.value === 0) {
        clearInterval(interval)
        messageState.value = sendState.sendCode
      }
    }, 1000)
  }
  else if (messageState.value === sendState.sendCode) {
    resendTime.value = 120
  }
})
const {
  value: email,
  errorMessage: emailErrorMessage,
  validate: emailValidate,
} = useField('email', emailValidateField)

const appConfig = useAppConfig()
async function sendCode() {
  await emailValidate()

  if (emailErrorMessage.value) {
    toastStore.addToast({
      message: '请输入一个合法的邮箱',
      type: 'warning',
    })

    return
  }
  fetch(`${appConfig.backend_url}/api/send_code`, {
    method: 'POST', // or 'GET'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.value }),
  })
    .then(async (response) => {
      if (!response.ok) {
        const { message: errorMessage } = await response.json()
        messageState.value = sendState.sendCode
        return toastStore.addToast({
          message: errorMessage,
          type: 'warning',
        })
      }
      response.json().then(() => {
        messageState.value = sendState.resend
      })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
  messageState.value = sendState.sending
}
function emailValidateField(value: string) {
  if (!value) {
    return 'email is required'
  }
  const emailPattern = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i
  if (!emailPattern.test(value)) {
    return 'this email is invalid'
  }

  return true
}

function veriCodeValidateField(value: string) {
  if (!value) {
    return 'Verification code is required'
  }

  if (value.length !== 6) {
    return 'this field must contain 6 characters'
  }
  if (!/^\d{6}$/.test(value)) {
    return 'this field only contains digits'
  }
  return true
}
const {
  value: veriCode,
  errorMessage: veriCodeErrorMessage,
  validate: veriValidate,
} = useField('veriCode', veriCodeValidateField)

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
} = useField('password', passwordValidateField)
const router = useRouter()
async function singUp() {
  await Promise.all([emailValidate(), veriValidate(), passwordValidate()])

  if (
    emailErrorMessage.value
    || veriCodeErrorMessage.value
    || passwordErrorMessage.value
  ) {
    return
  }
  fetch(`${appConfig.backend_url}/register`, {
    method: 'POST', // or 'GET'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      code: veriCode.value,
    }),
    credentials: 'include',
  })
    .then(async (response) => {
      if (!response.ok) {
        const { message: errorMessage } = await response.json()
        return toastStore.addToast({
          message: errorMessage,
          type: 'warning',
        })
      }
      response.json().then((data) => {
        toastStore.addToast({
          message: 'Sign Success',
          type: 'success',
        })

        user.isLogin = true
        router.push('/')
        user.email = data.user.email
        user.username = data.user.username
        user.avatar_path = data.user.avatar_path
      })
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 lg:px-8 sm:px-6"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2
          dark:text-white
          class="mt-6 text-center text-3xl text-gray-900 font-extrabold"
        >
          注册
        </h2>
      </div>
      <form novalidate class="mt-8 space-y-6" @submit.prevent="singUp">
        <div class="rounded-md shadow-sm" flex flex-col gap-8>
          <div relative>
            <div flex gap-4>
              <label for="email-address" class="sr-only">
                Email address
              </label>
              <input

                id="email-address"
                v-model="email"
                name="email"
                type="email"

                required relative block flex-1 appearance-none border-1 border-gray-300 rounded-md rounded-t-md px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 dark:bg-gray-800 dark:caret-white focus:outline-none focus:ring-indigo-500 placeholder-gray-500
                placeholder="邮箱"
              >
              <div

                h-full
                flex translate-y-px cursor-pointer items-center rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 dark:caret-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 @click="sendCode"
              >
                <button
                  v-if="messageState === sendState.sendCode"
                  type="button"
                  bg-transparent
                >
                  发送
                </button>
                <div v-if="messageState === sendState.sending">
                  <LottieLoading h-6 w-6 />
                </div>
                <div v-if="messageState === sendState.resend">
                  重新发送 {{ resendTime }}
                </div>
              </div>
            </div>

            <div

              v-show="emailErrorMessage"

              absolute pl-2 text-red-500
            >
              {{ emailErrorMessage }}
            </div>
          </div>

          <div>
            <label for="verification-code" class="sr-only">
              verification code
            </label>
            <input

              id="verification-code"
              v-model="veriCode"
              name="veriCode"
              type="text"

              required dark:c dark:bg-gray-800 dark:caret-white
              class="relative block w-full appearance-none border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 placeholder-gray-500"
              placeholder="验证码"
            >
            <div

              v-show="veriCodeErrorMessage"

              absolute pl-2 text-red-500
            >
              {{ veriCodeErrorMessage }}
            </div>
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input

              id="password"
              v-model="password"
              name="password"
              type="password"

              dark:c required dark:bg-gray-800 dark:caret-white
              class="relative block w-full appearance-none border border-gray-300 rounded-md rounded-b-md px-3 py-2 text-gray-900 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 placeholder-gray-500"
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
          >
            注册
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
          已经有账号了,
          <NuxtLink to="/login" cursor-pointer text-indigo-600>
            登录
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    transform: translateX(400px);
}
</style>
