<template>
    <main w-full flex justify-center bg-gray-200>
        <div flex-col w-full justify-between h-full flex max-w-7xl>
            <ul m-4 flex-col flex gap-4>
                <li
                    v-for="{ id, title, description, date, _path } in articles"
                    :key="id"
                    h-36
                    md:h-42
                    flex
                    bg-white
                    shadow-lg
                    rounded-2
                    p-2
                >
                    <div h-full flex items-center>
                        <NuxtImg
                            :src="`https://picsum.photos/200?r=${Math.random()}`"
                            alt="Discover Nuxt 3"
                            width="128"
                            height="128"
                            rounded-2
                            class="nuxt_img"
                        />
                    </div>
                    <div flex-1 grid px-4 py-1>
                        <div truncate text-xl>
                            <NuxtLink :to="`/blog${_path}`" hover:text-sky-500>
                                {{ title }}
                            </NuxtLink>
                        </div>
                        <div h-18 ref="description">
                            {{ description }}
                        </div>
                        <div
                            flex
                            items-end
                            text-gray-500
                            justify-between
                            w-full
                        >
                            <div text-sm text-gray-500>{{ date }}</div>
                            <div flex gap-4 items-center>
                                <Lottie translate-x-10px />
                                <div
                                    translate-y-1px
                                    flex
                                    i-mdi-comment-outline
                                ></div>
                                <div
                                    translate-y-1px
                                    i-mdi-eye-circle-outline
                                ></div>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>
<style scoped>
@media (min-width: 768px) {
    .nuxt_img {
        width: 152px;
        height: 152px;
    }
}
</style>
<script setup lang="ts">
const articles = await queryContent()
    .only(['_path', 'title', 'description', 'date', 'id'])
    .find()
    .catch((err) => {
        console.log(err)
    })

const description = ref(null)
interface CustomCSSStyleDeclaration extends CSSStyleDeclaration {
    ['-webkit-line-clamp']?: string
    ['-webkit-box-orient']?: string
    ['text-overflow']?: string
}

onMounted(() => {
    if (description.value) {
        ;(description.value as Array<HTMLElement>).forEach((element) => {
            const mediaQuery = window.matchMedia('(min-width: 768px)')
            mediaQuery.addEventListener('change', styleChange)
            function styleChange() {
                const styleDeclaration =
                    element.style as CustomCSSStyleDeclaration
                if (mediaQuery.matches) {
                    styleDeclaration['-webkit-line-clamp'] = '3'
                    styleDeclaration.display = '-webkit-box'
                    styleDeclaration['-webkit-box-orient'] = 'vertical'
                    styleDeclaration.overflow = 'hidden'
                    styleDeclaration['text-overflow'] = 'ellipsis'
                    styleDeclaration.display = 'block'
                } else {
                    styleDeclaration['-webkit-line-clamp'] = 'unset'
                    styleDeclaration.display = 'unset'
                    styleDeclaration['-webkit-box-orient'] = 'unset'
                    styleDeclaration.overflow = 'unset'
                    styleDeclaration['text-overflow'] = 'unset'
                    styleDeclaration.display = 'none'
                }
            }
            styleChange()
        })
    }
})
</script>
