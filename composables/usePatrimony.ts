import type { MovementData, Patrimony, PatrimonyConnection, StatusData } from '~/core/Patrimony'
import { IconToast, ToastType } from '~/core/Toast'
import { getErrorMessage } from '~/erros/errorMessage'

const patrimonies = ref<Patrimony[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function usePatrimony() {
    const {errorToast, successToast } = useMyToast()


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
            error.value = getErrorMessage(e)
            
           errorToast(e)
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

            successToast('Patrimônio criado com sucesso!')
            
        } catch (e) {
            error.value = getErrorMessage(e)
           errorToast(e)
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
            if(index !== -1) {
                patrimonies.value[index] = response
            }
            patrimonies.value[index] = response
            successToast('Patrimônio atualizado com sucesso!')
            
        } catch (e) {
            error.value = getErrorMessage(e)
           errorToast(e)
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
            
            patrimonies.value = patrimonies.value.filter((f) => f.id !== id)

            successToast('Patrimônio deletado com sucesso!')
            
        } catch (e) {
            error.value = getErrorMessage(e)
           errorToast(e)
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

            successToast('Patrimônio movido com sucesso!')
            
        } catch (e) {
            error.value = getErrorMessage(e)
           errorToast(e)
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

            successToast('Status do Patrimônio alterado com sucesso!')
            
        } catch (e) {
            error.value = getErrorMessage(e)
           errorToast(e)
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
           
            patrimonies.value = response
            successToast('Conexões do Patrimônio Efetuado com sucesso!')
            
        } catch (e) {
            error.value = getErrorMessage(e)
           errorToast(e)
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
