const appConfig = useAppConfig()
const { toastMessage, showToast, ToastType } = useToast()

async function fetchData(url: string, options = {}) {
    let initialOptions = {
        mode: 'cors',
        credentials: 'include'
    }
    let descriptors = Object.getOwnPropertyDescriptors(initialOptions)
    let finalOptions = Object.create(options, descriptors)
    console.log(finalOptions)
    let data = await fetch(`${appConfig.backend_url}${url}`, finalOptions)
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
            return response.json()
        })
        .catch((error) => {
            console.log(error)
            return showToast({
                message: error,
                type: ToastType.Error
            })
        })
    return data
}
const useFetchData = () => {
    return { fetchData }
}
export default useFetchData
