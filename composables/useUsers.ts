import { IconToast, ToastType } from '~/core/Toast'
import type {  User, UserResponse } from '~/core/Users'

const users = ref<UserResponse[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

export function useUsers() {
    const { addToast } = useMyToast()

    const getAllUsers = async () => {
        loading.value = true
        try {
            const response = await $fetch<UserResponse[]>('/api/users', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            users.value = response 
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

    const createUser = async (data:User) => {
        loading.value = true
        try {
            const response = await $fetch<UserResponse>('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
           users.value.push(response)
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

    const updateUser = async (id: string, data: User) => {
        loading.value = true
        try {
            const response = await $fetch<UserResponse>(`/api/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = users.value.findIndex(
                (user) => user.id === response.id
            )
            users.value.splice(index as number, 1, response)
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

    const deleteUser = async (id: string) => {
        loading.value = true
        try {
            await $fetch<UserResponse>(`/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = users.value.findIndex((user) => user.id === id)
            users.value.splice(index as number, 1)
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
    
    onMounted(async () => {
        await getAllUsers()
     })

    return {
        loading: loading,
        users: users,
        error: error,
        getAllUsers,
        createUser,
        updateUser,
        deleteUser,
    }
}
