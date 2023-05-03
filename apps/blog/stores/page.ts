const usePage = defineStore('page', {
    state: () => ({
        isMenuOpen: false,
        isSignUpOpen: false
    }),
    actions: {
        toggleMask() {
            this.isMenuOpen = !this.isMenuOpen
        },
        toggleSignUp() {
            this.isSignUpOpen = !this.isSignUpOpen
        }
    }
})

export default usePage
