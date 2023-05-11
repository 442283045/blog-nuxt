const useUser = defineStore('user', {
    state: () => ({
        isLogin: false,
        avatar_path: '',
        email: '',
        username: ''
    }),
    actions: {}
})

export default useUser
