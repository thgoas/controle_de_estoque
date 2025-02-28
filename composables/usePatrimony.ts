import type { MovementData, Patrimony, PatrimonyConnection, StatusData } from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'

const patrimonies = ref<Patrimony[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function usePatrimony() {
    const { addToast } = useMyToast()
    const getAllPatrimonies = async () => {
        loading.value = true
        try {
            patrimonies.value = await $fetch<Patrimony[]>('/api/patrimonies', {
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

    const createPatrimony = async (data: Patrimony) => {
        loading.value = true

        try {
            const response = await $fetch<Patrimony>('/api/patrimonies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            patrimonies.value.push(response)


            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Patrimônio criado com sucesso!',
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

    const updatePatrimony = async (id: string, data: Patrimony) => {
        loading.value = true
        try {
            const response = await $fetch<Patrimony>(`/api/patrimonies/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = patrimonies.value.findIndex((f) => f.id === id)
            patrimonies.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Patrimônio atualizado com sucesso!',
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

    const deletePatrimony = async (id: string) => {
        loading.value = true
        try {
             await $fetch<Patrimony>(`/api/patrimonies/${id}`, {
                method: 'DELETE' ,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = patrimonies.value.findIndex((f) => f.id === id)
            patrimonies.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Patrimônio deletado com sucesso!',
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
    const movementPatrimony = async (id: string, movement: MovementData) => {
        loading.value = true
        try {
            const response = await $fetch<Patrimony>(
                `/api/patrimonies/movement/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${
                            useCookie('auth_token').value
                        }`,
                    },
                    body: JSON.stringify(movement),
                }
            )
            const index = patrimonies.value.findIndex((f) => f.id === id)
            patrimonies.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Patrimônio movido com sucesso!',
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

    const statusPatrimony = async (id: string, statusData: StatusData) => {
        loading.value = true
        try {
            const response = await $fetch<Patrimony>(
                `/api/patrimonies/status/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${
                            useCookie('auth_token').value
                        }`,
                    },
                    body: JSON.stringify(statusData),
                }
            )
            const index = patrimonies.value.findIndex((f) => f.id === id)
            patrimonies.value[index] = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Status do Patrimônio alterado com sucesso!',
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

    const addConnections = async (connections: PatrimonyConnection[]) => {
        loading.value = true
        try {
            const response = await $fetch<Patrimony[]>(`/api/patrimonies/connections`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${
                        useCookie('auth_token').value
                    }`,
                },
                body: JSON.stringify(connections),
            })
            console.log(response)
            patrimonies.value = response
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Conexões do Patrimônio Efetuado com sucesso!',
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
        await getAllPatrimonies()
    })

    return {
        patrimonies,
        getAllPatrimonies,
        loading,
        error,
        createPatrimony,
        deletePatrimony,
        updatePatrimony,
        movementPatrimony,
        statusPatrimony,
        addConnections,
    }
}
