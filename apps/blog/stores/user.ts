const useUser = defineStore('user', {
    state: () => ({
        isLogin: false,
        avatar_path: '',
        email: '',
        username: '',
        id: 0
    }),
    actions: {}
})

export default useUser
