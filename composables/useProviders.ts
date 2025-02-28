import type { Provider } from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const providers = ref<Provider[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useProviders() {
    const { addToast } = useMyToast()
    const getAllProviders = async () => {
        loading.value = true
        try {
            providers.value = await $fetch<Provider[]>('/api/providers', {
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

    const createProvider = async (data: Provider) => {
 
        loading.value = true
        try {
            const response = await $fetch<Provider>('/api/providers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            providers.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Fornecedor criado com sucesso!',
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

    const updateProvider = async (id: string, data: Provider) => {
        loading.value = true
        try {
            const response = await $fetch<Provider>(`/api/providers/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = providers.value.findIndex((provider) => provider.id === id)
            providers.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Fornecedor atualizado com sucesso!',
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

    const deleteProvider = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/providers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = providers.value.findIndex((f) => f.id === id)
            providers.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Fronecedor deletado com sucesso!',
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
        await getAllProviders()
    })

    return {
        providers,
        getAllProviders,
        loading,
        error,
        createProvider,
        deleteProvider,
        updateProvider,
    }
}
