import type { Status} from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const status = ref<Status[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useStatus() {
    const { addToast } = useMyToast()
    const getAllStatus = async () => {
        loading.value = true
        try {
            status.value = await $fetch<Status  []>('/api/status', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
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

    const createStatus = async (data: Status) => {
 
        loading.value = true
        try {
            const response = await $fetch<Status>('/api/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            status.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Status criado com sucesso!',
                icon: IconToast.Success,
            })
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

    const updateStatus = async (id: string, data: Status) => {
        loading.value = true
        try {
            const response = await $fetch<Status>(`/api/status/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = status.value.findIndex((f) => f.id === id)
            status.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Status atualizado com sucesso!',
                icon: IconToast.Success,
            })
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

    const deleteStatus = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/status/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = status.value.findIndex((f) => f.id === id)
            status.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Status deletado com sucesso!',
                icon: IconToast.Success,
            })
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
        await getAllStatus()
    })

    return {
        status,
        getAllStatus   ,
        loading,
        error,
        createStatus,
        deleteStatus,
        updateStatus,
    }
}
