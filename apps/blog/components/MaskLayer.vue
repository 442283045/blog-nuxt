<script setup lang="ts">
import usePage from '../stores/page'

const page = usePage()
const isDropdownOpen = ref(false)
const theme = ref()
let changeTheme: (theme: 'light' | 'dark' | 'auto') => void
let mode: any
const themeColor = ref('')
onMounted(() => {
  mode = useColorMode({
    emitAuto: true,
  })
  changeThemeColor(mode.value)
  changeTheme = function (theme) {
    mode.value = theme
    changeThemeColor(theme)

    isDropdownOpen.value = false
  }
  function changeThemeColor(theme: 'light' | 'dark' | 'auto') {
    switch (theme) {
      case 'light':
        themeColor.value = '明亮'
        break

      case 'dark':
        themeColor.value = '黑暗'
        break

      case 'auto':
        themeColor.value = '自动'
        break
    }
  }
})
</script>

<template>
  <Transition name="fade">
    <div
      v-show="page.isMenuOpen"

      class="mask" fixed top-0 h-screen w-screen flex
      bg-black
      @click="isDropdownOpen = false"
    >
      <Transition name="translate">
        <div
          v-show="page.isMenuOpen"

          h-screen w-80 flex flex-col gap-2 bg-white p-12 dark:bg-gray-800
        >
          <div

            mb-8 w-8 rounded-8 bg-white shadow-gray-400 dark:bg-gray-700
          >
            <div

              i-tabler-circle-x
              cursor-pointer text-8 text-gray-500 hover:rotate-180 @click="page.isMenuOpen = false"
            />
          </div>
          <div flex flex-col gap-4>
            <NuxtLink to="/" @click="page.isMenuOpen = false">
              <div

                h-8 flex cursor-pointer items-center border-1 border-gray-300 rounded-2 rounded-lg bg-gray-100 px-4 text-center text-gray-500 leading-8 dark:border-gray-600 dark:bg-gray-700 hover:bg-gray-200 dark:text-white focus:outline-none focus:ring-4 focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700
              >
                <div i-tabler-home pr-10 text-4 />
                主页
              </div>
            </NuxtLink>
            <div flex flex-col>
              <button
                id="states-button"
                data-dropdown-toggle="dropdown-states"
                z-10

                inline-flex flex-shrink-0 items-center border-1 border-gray-300 rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm text-gray-500 font-medium dark:border-gray-600 dark:bg-gray-700 hover:bg-gray-200 dark:text-white focus:outline-none focus:ring-4 focus:ring-gray-100 dark:hover:bg-gray-600 dark:focus:ring-gray-700 type="button"
                @click.stop="isDropdownOpen = !isDropdownOpen"
              >
                <div class="inline-flex items-center">
                  <div

                    ref="theme" i-carbon-sun dark:i-carbon-moon pr-10 text-4
                    text-gray-6
                  />
                  {{ themeColor }}
                </div>
                <svg
                  aria-hidden="true"
                  class="ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              <div
                v-show="isDropdownOpen"
                id="dropdown-states"

                z-10 w-44 rounded-lg bg-light-100 shadow divide-y divide-gray-100 dark:bg-gray-700
                :style="{ '--un-bg-opacity': '1' }"
              >
                <ul
                  class="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="states-button"
                >
                  <li>
                    <button
                      type="button"

                      w-full inline-flex bg-light-100 px-4 py-2 text-sm text-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white
                      @click.stop="changeTheme('light')"
                    >
                      <div
                        dark:text-white
                        class="inline-flex items-center"
                      >
                        <div

                          pr-10 text-4 text-gray-6 dark:text-white
                          class="i-carbon-sun"
                        />
                        明亮
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      bg-light-100
                      dark:bg-gray-700
                      class="w-full inline-flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      @click.stop="changeTheme('dark')"
                    >
                      <div
                        dark:text-white
                        class="inline-flex items-center"
                      >
                        <div

                          pr-10 text-4 text-gray-6 dark:text-white
                          class="i-carbon-moon"
                        />
                        黑暗
                      </div>
                    </button>
                  </li>
                  <li>
                    <button
                      bg-light-100
                      type="button"
                      dark:bg-gray-700
                      class="w-full inline-flex px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                      @click.stop="changeTheme('auto')"
                    >
                      <div
                        dark:text-white
                        class="inline-flex items-center"
                      >
                        <div

                          pr-10 text-4 text-gray-6 dark:text-white
                          class="i-carbon-screen"
                        />
                        自动
                      </div>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <div flex-1 @click="page.toggleMask" />
    </div>
  </Transition>
</template>

<style scoped>
.mask {
    --un-bg-opacity: 0.5;
}

.translate-enter-active,
.translate-leave-active {
    transition: transform 0.5s ease;
}

.translate-enter-from,
.translate-leave-to {
    transform: translateX(-320px);
}
.fade-enter-active,
.fade-leave-active {
    transition: background-color 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    background-color: transparent;
}
</style>
