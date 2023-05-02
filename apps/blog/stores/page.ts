const usePage = defineStore('page', {
    state: () => ({
        isMaskOpen: false
    }),
    actions: {
        toggleMask() {
            this.isMaskOpen = !this.isMaskOpen
            console.log(this.isMaskOpen)
        }
    }
})

export default usePage
