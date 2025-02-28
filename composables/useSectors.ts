import type { Sector } from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const sectors = ref<Sector[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useSector() {
    const { addToast } = useMyToast()
    const getAllSectors = async () => {
        loading.value = true
        try {
            sectors.value = await $fetch<Sector[]>('/api/sectors', {
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

    const createSector = async (data: Sector) => {
 
        loading.value = true
        try {
            const response = await $fetch<Sector>('/api/sectors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            sectors.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Setor criado com sucesso!',
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

    const updateSector = async (id: string, data: Sector) => {
        loading.value = true
        try {
            const response = await $fetch<Sector>(`/api/sectors/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = sectors.value.findIndex((sector) => sector.id === id)
            sectors.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Setor atualizado com sucesso!',
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

    const deleteSector = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/sectors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = sectors.value.findIndex((sector) => sector.id === id)
            sectors.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Setor deletado com sucesso!',
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
        await getAllSectors()
    })

    return {
        sectors,
        getAllSectors,
        loading,
        error,
        createSector,
        deleteSector,
        updateSector,
    }
}
