<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <transition name="fade">
            <Toast
                v-if="showToast"
                :message="toastMessage"
                :type="toastType"
            ></Toast>
        </transition>
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Sign up
                </h2>
            </div>
            <form novalidate class="mt-8 space-y-6" @submit.prevent="singUp">
                <div
                    class="rounded-md shadow-sm -space-y-px"
                    flex
                    flex-col
                    gap-8
                >
                    <div relative>
                        <div flex gap-4>
                            <label for="email-address" class="sr-only">
                                Email address
                            </label>
                            <input
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
                                border
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
                            <button
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
                            >
                                Send Code
                            </button>
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
                            id="verification-code"
                            name="veriCode"
                            v-model="veriCode"
                            type="text"
                            required
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
                            id="password"
                            name="password"
                            type="password"
                            v-model="password"
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
definePageMeta({
    layout: false
})

const { toastMessage, toastType, showToast, toast } = useToast()
import { useField } from 'vee-validate'

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
const { value: email, errorMessage: emailErrorMessage } = useField(
    'email',
    emailValidateField
)

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
const { value: veriCode, errorMessage: veriCodeErrorMessage } = useField(
    'veriCode',
    veriCodeValidateField
)

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

const { value: password, errorMessage: passwordErrorMessage } = useField(
    'fullName',
    passwordValidateField
)

function singUp() {
    if (!email.value || !veriCode.value || !password.value) {
        return toast.trigger({ message: 'email is empty', type: 'error' })
    }
    if (
        emailErrorMessage.value ||
        veriCodeErrorMessage.value ||
        passwordErrorMessage.value
    ) {
        return
    }
    fetch('http://127.0.0.1:3001/sendCode').then()
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
