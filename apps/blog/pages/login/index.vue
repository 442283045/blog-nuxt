<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2
                    class="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Log in
                </h2>
            </div>
            <form @submit.prevent="LogIn" novalidate class="mt-8 space-y-6">
                <div flex flex-col gap-8 rounded-md shadow-sm>
                    <div>
                        <label for="email-address" class="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            v-model="email"
                            required
                            class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
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
                            id="password"
                            name="password"
                            type="password"
                            v-model="password"
                            required
                            class="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                        Sign in
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
                    Don't have an account,
                    <NuxtLink
                        to="/register"
                        hover:text-indigo-800
                        cursor-pointer
                        text-indigo-600
                    >
                        sign up
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false
})
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
function LogIn() {}
</script>
