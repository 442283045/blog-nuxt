const useUser = defineStore('user', {
    state: () => ({
        isLogin: false,
        avatar_path: '',
        email: '',
        username: '',
        id: 0,
        bio: ''
    }),
    actions: {
        logout() {
            this.isLogin = false
            this.avatar_path = ''
            this.email = ''
            this.username = ''
            this.id = 0
        }
    }
})

export default useUser
