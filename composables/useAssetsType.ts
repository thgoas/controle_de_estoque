import type { AssetsType} from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const assetsTypes = ref<AssetsType[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useAssetsType() {
    const { addToast } = useMyToast()
    const getAllAssetsTypes = async () => {
        loading.value = true
        try {
            assetsTypes.value = await $fetch<AssetsType  []>('/api/assets-type', {
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

    const createAssetsType = async (data: AssetsType) => {
 
        loading.value = true
        try {
            const response = await $fetch<AssetsType>('/api/assets-type', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            assetsTypes.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Tipo de Ativo criado com sucesso!',
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

    const updateAssetsType = async (id: string, data: AssetsType) => {
        loading.value = true
        try {
            const response = await $fetch<AssetsType>(`/api/assets-type/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = assetsTypes.value.findIndex((f) => f.id === id)
            assetsTypes.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Tipo de ativo atualizado com sucesso!',
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

    const deleteAssetsType = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/assets-type/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = assetsTypes.value.findIndex((f) => f.id === id)
            assetsTypes.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Tipo de ativo deletado com sucesso!',
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
        await getAllAssetsTypes()
    })

    return {
        assetsTypes,
        getAllAssetsTypes   ,
        loading,
        error,
        createAssetsType,
        deleteAssetsType,
        updateAssetsType,
    }
}
