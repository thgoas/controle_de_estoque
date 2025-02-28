import type { AssetsSubgroup} from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const assetsSubgroups = ref<AssetsSubgroup[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useAssetsSubgroup() {
    const { addToast } = useMyToast()
    const getAllAssetsSubgroups = async () => {
        loading.value = true
        try {
            assetsSubgroups.value = await $fetch<AssetsSubgroup  []>('/api/assets-subgroup', {
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

    const createAssetsSubgroup = async (data: AssetsSubgroup) => {
 
        loading.value = true
        try {
            const response = await $fetch<AssetsSubgroup>('/api/assets-subgroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            assetsSubgroups.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Subgrupo de Ativo criado com sucesso!',
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

    const updateAssetsSubgroup = async (id: string, data: AssetsSubgroup) => {
        loading.value = true
        try {
            const response = await $fetch<AssetsSubgroup>(`/api/assets-subgroup/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = assetsSubgroups.value.findIndex((f) => f.id === id)
            assetsSubgroups.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Subgrupo de ativo atualizado com sucesso!',
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

    const deleteAssetsSubgroup = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/assets-subgroup/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = assetsSubgroups.value.findIndex((f) => f.id === id)
            assetsSubgroups.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Subgrupo de ativo deletado com sucesso!',
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
        await getAllAssetsSubgroups()
    })

    return {
        assetsSubgroups,
        getAllAssetsSubgroups   ,
        loading,
        error,
        createAssetsSubgroup,
        deleteAssetsSubgroup,
        updateAssetsSubgroup,
    }
}
