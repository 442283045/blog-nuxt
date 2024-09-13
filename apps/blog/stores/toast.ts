const useToast = defineStore('toast', {
  state: () => ({
    toasts: [] as { message: string, type: string, id: number }[],
  }),
  actions: {
    addToast(toast: { message: string, type: string }) {
      this.toasts.push({
        id: Number(Math.random().toString().slice(2)),
        message: toast.message,
        type: toast.type,
      })
    },
    clearToast() {
      // const index = this.toasts.findIndex((toast) => toast.id === id) // find toast
      this.toasts.shift() // remove toast from array
    },
  },
})

export default useToast
