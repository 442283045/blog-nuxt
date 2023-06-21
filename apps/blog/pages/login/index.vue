<template>
    <div
        dark:bg-gray-900
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    dark:text-white
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    登录
                </h2>
            </div>
            <form @submit.prevent="" novalidate class="mt-8 space-y-6">
                <div flex flex-col gap-8 rounded-md shadow-sm>
                    <div>
                        <label for="email-address" class="sr-only">
                            Email address
                        </label>
                        <input
                            dark:bg-gray-700
                            dark:caret-white
                            id="email-address"
                            name="email"
                            type="email"
                            v-model="email"
                            required
                            class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="邮箱"
                        />
                        <div
                            pl-2
                            v-show="emailErrorMessage"
                            text-red-500
                            absolute
                        >
                            {{ emailErrorMessage }}
                        </div>
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            dark:bg-gray-700
                            dark:caret-white
                            id="password"
                            name="password"
                            type="password"
                            v-model="password"
                            required
                            class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="密码"
                        />
                        <div
                            pl-2
                            v-show="passwordErrorMessage"
                            text-red-500
                            absolute
                        >
                            {{ passwordErrorMessage }}
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        @click="signIn"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        hover:text-indigo-800
                        cursor-pointer
                        text-indigo-600
                    >
                        注册
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useToast from '~/stores/toast'
import useUser from '../../stores/user'
import { useField } from 'vee-validate'
const user = useUser()
const toastStore = useToast()
definePageMeta({
    layout: false
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
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(value)) {
        return 'This email is invalid'
    }

    return true
}
const {
    value: email,
    errorMessage: emailErrorMessage,
    validate: emailValidate
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
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/.test(value)) {
        return 'Password is invalid'
    }
    return true
}

const router = useRouter()

const {
    value: password,
    errorMessage: passwordErrorMessage,
    validate: passwordValidate
} = useField('fullName', passwordValidateField)
password.value = 'qq121274182'
async function signIn() {
    await Promise.all([emailValidate(), passwordValidate()]).catch((err) => {
        console.log(err)
    })

    if (emailErrorMessage.value || passwordErrorMessage.value) {
        return toastStore.addToast({
            message: '请输入合法的账号和密码',
            type: 'warning'
        })
    }
    useFetch(`/login`, {
        baseURL: appConfig.backend_url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        credentials: 'include',
        mode: 'cors',
        onResponse: async (res) => {
            if (!res.response.ok) {
                console.log(res.error?.message)
                return console.log('response error')
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
                type: 'warning'
            })
        }
    })
}
</script>
