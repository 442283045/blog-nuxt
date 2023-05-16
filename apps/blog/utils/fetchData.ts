const appConfig = useAppConfig()
const { toastMessage, showToast, ToastType } = useToast()
async function fetchData(url: string, options = {}) {
    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    fetch(`${appConfig.backend_url}/login`, options)
        .then(async (response) => {
            console.log(response)
            if (!response.ok) {
                const { msg: errorMessage } = await response.json()

                return showToast({
                    message: errorMessage,
                    type: ToastType.Error
                })
            }
            interface userData {
                email: string
                username: string
                avatar_path: string
            }
            response.json()
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    return await response.json()
}
