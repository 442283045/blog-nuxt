const useToast = defineStore('toast', {
    state: () => ({
        toasts: [] as { message: string; type: string; id: number }[]
    }),
    actions: {
        addToast(toast: { message: string; type: string }) {
            const number = Math.random().toString().slice(2)
            this.toasts.push({
                id: Number(number),
                message: number,
                type: toast.type
            })
        },
        clearToast(id: number) {
            // const index = this.toasts.findIndex((toast) => toast.id === id) // find toast
            this.toasts.shift() // remove toast from array
        }
    }
})

export default useToast
