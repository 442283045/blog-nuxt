<template>
    <header
        h-16
        bg-white
        flex
        justify-center
        sticky
        top-0
        backdrop-filter
        z-10
        :style="{
            '--un-bg-opacity': '0.8',
            '--un-backdrop-blur': 'blur(0.75rem)'
        }"
    >
        <div w-full items-center justify-between h-full flex max-w-7xl>
            <div flex justify-start gap-16 h-full>
                <div class="logo" flex justify-center items-center h-full w-16>
                    Logo
                </div>
                <nav flex gap-8 items-center>
                    <NuxtLink hover:text-sky-500 to="/">Home</NuxtLink>

                    <!-- <NuxtLink to="/blog">Blog</NuxtLink> -->
                </nav>
            </div>
            <div flex items-center class="settings" pr-4>Sign in</div>
        </div>
    </header>
</template>
