import type { Assets} from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const assets = ref<Assets[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useAssets() {
    const { addToast } = useMyToast()
    const getAllAssets = async () => {
        loading.value = true
        try {
            assets.value = await $fetch<Assets  []>('/api/assets', {
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

    const createAssets = async (data: Assets) => {
 
        loading.value = true
        try {
            const response = await $fetch<Assets>('/api/assets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            assets.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Ativo criado com sucesso!',
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

    const updateAssets = async (id: string, data: Assets) => {
        loading.value = true
        try {
            const response = await $fetch<Assets>(`/api/assets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = assets.value.findIndex((f) => f.id === id)
            assets.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Ativo atualizado com sucesso!',
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

    const deleteAssets = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/assets/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = assets.value.findIndex((f) => f.id === id)
            assets.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Ativo deletado com sucesso!',
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
        await getAllAssets()
    })

    return {
        assets,
        getAllAssets   ,
        loading,
        error,
        createAssets,
        deleteAssets,
        updateAssets,
    }
}
