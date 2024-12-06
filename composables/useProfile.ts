import { IconToast, ToastType } from "~/core/Toast"

export function useProfile () {
    const loading = ref(false)
    const error = ref('')
    const {logout} = useLogin()
    const { addToast } = useMyToast()


    const updateProfile = async (id: string, data: any) => {
        loading.value = true
        try {
            await $fetch('/api/profiles/${id}', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            logout()
        } catch (e) {
            error.value = (e as Error).message
            addToast({
                type: ToastType.Error,
                title: 'Error',
                description: (e as any).message,
                icon: IconToast.Error,
            })
        } finally {
            loading.value = false
        }
    }
    
    return {
        updateProfile,
        loading,
        error
    }
}