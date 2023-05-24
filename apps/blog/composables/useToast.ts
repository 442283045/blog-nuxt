enum ToastType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
    Default = 'info'
}
// type ToastType = 'info' | 'success' | 'warning' | 'error' | ''
export default function useToast() {
    const toastMessage = useState<string>('toastMessage', () => 'Hello World')
    const toastType = useState<ToastType>('toastType', () => ToastType.Default)
    const toastVisible = useState<boolean>('toastVisible', () => false)
    function showToast({
        message,
        type = ToastType.Default
    }: {
        message: string
        type: ToastType
    }) {
        if (toastVisible.value === true) return
        toastMessage.value = message
        toastType.value = type
        toastVisible.value = true

        setTimeout(() => {
            toastVisible.value = false
        }, 3000) // Hide the toast after 3 seconds
    }
    return {
        toastMessage,
        toastType,
        toastVisible,
        showToast,
        ToastType
        // Export the ToastType enum so it can be used in components
    }
}
