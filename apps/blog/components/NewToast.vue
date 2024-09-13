<script lang="ts" setup>
import useToast from '~/stores/toast'

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
})
const toastStore = useToast()
const toast_container = ref<HTMLElement>()
setTimeout(() => {
  toastStore.clearToast()
}, 3000)
onMounted(() => {
  if (!toast_container.value) {
    return
  }
  switch (props.toast.type) {
    case 'warning':
      toast_container.value.style.backgroundColor = '#F59E0B'
      break
    case 'success':
      toast_container.value.style.backgroundColor = '#10B981'
      break
    default:
      break
  }
})
</script>

<template>
  <div>
    <div
      ref="toast_container"

      rounded-md bg-blue px-3 py-2 text-white shadow-2xl
    >
      <div max-w-80 flex items-center gap-2 leading-6>
        <div
          v-show="props.toast.type === 'info'"

          i-tabler-info-circle text-6
        />
        <div
          v-show="props.toast.type === 'success'"

          i-tabler-circle-check text-6
        />
        <div
          v-show="props.toast.type === 'warning'"

          i-tabler-exclamation-circle text-6
        />
        <p flex-1>
          {{ props.toast.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    transition: transform 20s ease;
}

.v-enter-from,
.v-leave-to {
    transform: translateX(500px);
}
</style>
