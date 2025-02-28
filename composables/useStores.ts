import type { Store } from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const stores = ref<Store[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useStores() {
    const { addToast } = useMyToast()
    const getAllStores = async () => {
        loading.value = true
        try {
            stores.value = await $fetch<Store[]>('/api/stores', {
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

    const createStore = async (data: Store) => {
 
        loading.value = true
        try {
            const response = await $fetch<Store>('/api/stores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            stores.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Loja criada com sucesso!',
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

    const updateStore = async (id: string, data: Store) => {
        loading.value = true
        try {
            const response = await $fetch<Store>(`/api/stores/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = stores.value.findIndex((store) => store.id === id)
            stores.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Loja atualizada com sucesso!',
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

    const deleteStore = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/stores/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = stores.value.findIndex((store) => store.id === id)
            stores.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Loja deletada com sucesso!',
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
        await getAllStores()
    })

    return {
        stores,
        getAllStores,
        loading,
        error,
        createStore,
        deleteStore,
        updateStore,
    }
}
