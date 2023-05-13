import { ref } from 'vue'

export default function useToast() {
    const toastMessage = ref('')
    const toastType = ref('success')
    const showToast = ref(false)

    const toast = {
        trigger({
            message,
            type
        }: {
            message: string
            type: 'success' | 'warning' | 'error'
        }) {
            toastMessage.value = message
            toastType.value = type
            showToast.value = true
            setTimeout(() => (showToast.value = false), 3000)
        }
    }
    return { toast, toastMessage, toastType, showToast }
}
