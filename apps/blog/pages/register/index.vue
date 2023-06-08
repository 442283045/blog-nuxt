<template>
    <div
        class="min-h-screen dark:bg-gray-900 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    dark:text-white
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Sign up
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
                                dark:bg-gray-800
                                dark:caret-white
                                flex-1
                                id="email-address"
                                name="email"
                                type="email"
                                v-model="email"
                                required
                                appearance-none
                                rounded-md
                                relative
                                block
                                px-3
                                py-2
                                border-1
                                border-gray-300
                                placeholder-gray-500
                                text-gray-900
                                rounded-t-md
                                focus:outline-none
                                focus:ring-indigo-500
                                focus:border-indigo-500
                                focus:z-10
                                placeholder="Email address"
                            />
                            <div
                                dark:caret-white
                                text-white
                                bg-indigo-600
                                hover:bg-indigo-700
                                focus:outline-none
                                focus:ring-2
                                focus:ring-offset-2
                                focus:ring-indigo-500
                                rounded-md
                                px-3
                                py-2
                                translate-y-px
                                h-full
                                flex
                                items-center
                                @click="sendCode"
                                cursor-pointer
                            >
                                <button
                                    type="button"
                                    bg-transparent
                                    v-if="messageState === sendState.sendCode"
                                >
                                    Send Code
                                </button>
                                <div v-if="messageState === sendState.sending">
                                    <LottieLoading w-6 h-6></LottieLoading>
                                </div>
                                <div v-if="messageState === sendState.resend">
                                    Resend {{ resendTime }}
                                </div>
                            </div>
                        </div>

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
                        <label for="verification-code" class="sr-only">
                            verification code
                        </label>
                        <input
                            dark:caret-white
                            id="verification-code"
                            name="veriCode"
                            v-model="veriCode"
                            type="text"
                            required
                            dark:bg-gray-800
                            dark:c
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                            placeholder="verification code"
                        />
                        <div
                            pl-2
                            v-show="veriCodeErrorMessage"
                            text-red-500
                            absolute
                        >
                            {{ veriCodeErrorMessage }}
                        </div>
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            dark:caret-white
                            id="password"
                            name="password"
                            type="password"
                            v-model="password"
                            dark:bg-gray-800
                            dark:c
                            required
                            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                            placeholder="Password"
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
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign up
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
                    Go home
                </NuxtLink>
                <div float-right>
                    Already have an account,
                    <NuxtLink to="/login" cursor-pointer text-indigo-600>
                        log in
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// import Toast from '../../components/Toast.vue'
import { useField, validate } from 'vee-validate'

import usePage from '../../stores/page'
import useUser from '../../stores/user'
import useToast from '~/stores/toast'
const toastStore = useToast()
const page = usePage()
const user = useUser()

definePageMeta({
    layout: false
})
enum sendState {
    sendCode = 'Send code',
    sending = 'Sending',
    resend = 'Resend'
}
console.log(user.isLogin)

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
        let interval = setInterval(() => {
            resendTime.value--
            if (resendTime.value === 0) {
                clearInterval(interval)
                messageState.value = sendState.sendCode
            }
        }, 1000)
    } else if (messageState.value === sendState.sendCode) {
        resendTime.value = 120
    }
})

const appConfig = useAppConfig()
async function sendCode() {
    await emailValidate()

    if (emailErrorMessage.value) {
        toastStore.addToast({
            message: 'Please enter a valid email address',
            type: 'warning'
        })

        return
    }
    fetch(`${appConfig.backend_url}/api/send_code`, {
        method: 'POST', // or 'GET'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.value })
    })
        .then(async (response) => {
            console.log(response)
            if (!response.ok) {
                const { message: errorMessage } = await response.json()
                messageState.value = sendState.sendCode
                return toastStore.addToast({
                    message: errorMessage,
                    type: 'warning'
                })
            }
            response.json().then((data) => {
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
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(value)) {
        return 'this email is invalid'
    }

    return true
}
const {
    value: email,
    errorMessage: emailErrorMessage,
    validate: emailValidate
} = useField('email', emailValidateField)

function veriCodeValidateField(value: string) {
    if (!value) {
        return 'Verification code is required'
    }

    if (value.length != 6) {
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
    validate: veriValidate
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
    if (!/^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/.test(value)) {
        return 'Password is invalid'
    }
    return true
}

const {
    value: password,
    errorMessage: passwordErrorMessage,
    validate: passwordValidate
} = useField('password', passwordValidateField)
const router = useRouter()
async function singUp() {
    await Promise.all([emailValidate(), veriValidate(), passwordValidate()])

    if (
        emailErrorMessage.value ||
        veriCodeErrorMessage.value ||
        passwordErrorMessage.value
    ) {
        return toastStore.addToast({
            message: 'Email, verification code or password is invalid',
            type: 'warning'
        })
        return
    }
    fetch(`${appConfig.backend_url}/register`, {
        method: 'POST', // or 'GET'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            code: veriCode.value
        }),
        credentials: 'include'
    })
        .then(async (response) => {
            console.log(response)
            if (!response.ok) {
                const { message: errorMessage } = await response.json()
                console.log(errorMessage)
                return toastStore.addToast({
                    message: errorMessage,
                    type: 'warning'
                })
            }
            interface userData {
                email: string
                username: string
                avatar_path: string
            }
            response.json().then((data) => {
                toastStore.addToast({
                    message: 'Sign Success',
                    type: 'success'
                })

                user.isLogin = true
                router.push('/')
                user.email = data.user.email
                user.username = data.user.username
                user.avatar_path = data.user.avatar_path
                console.log('Sign Success:', data)
            })
        })
        .catch((error) => {
            console.error('Error:', error)
        })
}
</script>
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
