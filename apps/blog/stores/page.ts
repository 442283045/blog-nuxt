const usePage = defineStore('page', {
  state: () => ({
    isMenuOpen: false,
    isSignUpOpen: false,
  }),
  actions: {
    toggleMask() {
      this.isMenuOpen = !this.isMenuOpen
    },
  },
})

export default usePage
