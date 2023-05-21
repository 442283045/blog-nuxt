const usePage = defineStore('page', {
    state: () => ({
        isMenuOpen: false,
        isSignUpOpen: false,
        theme: 'system'
    }),
    actions: {
        toggleMask() {
            this.isMenuOpen = !this.isMenuOpen
        }
    }
})

export default usePage
