import type { AssetsClassification} from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const assetsClassifications = ref<AssetsClassification[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useAssetsClassification() {
    const { addToast } = useMyToast()
    const getAllAssetsClassifications = async () => {
        loading.value = true
        try {
            assetsClassifications.value = await $fetch<AssetsClassification  []>('/api/assets-classifications', {
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

    const createAssetsClassification = async (data: AssetsClassification) => {
 
        loading.value = true
        try {
            const response = await $fetch<AssetsClassification>('/api/assets-classifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            assetsClassifications.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Classificação de Ativo criado com sucesso!',
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

    const updateAssetsClassification = async (id: string, data: AssetsClassification) => {
        loading.value = true
        try {
            const response = await $fetch<AssetsClassification>(`/api/assets-classifications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = assetsClassifications.value.findIndex((f) => f.id === id)
            assetsClassifications.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Classificação de ativo atualizado com sucesso!',
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

    const deleteAssetsClassification = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/assets-classifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = assetsClassifications.value.findIndex((f) => f.id === id)
            assetsClassifications.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Classificação de ativo deletado com sucesso!',
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
        await getAllAssetsClassifications()
    })

    return {
        assetsClassifications,
        getAllAssetsClassifications,
        loading,
        error,
        createAssetsClassification,
        deleteAssetsClassification,
        updateAssetsClassification,
    }
}
