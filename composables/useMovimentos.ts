import type { Movimento, MovimentoCount, MovimentoResponse } from "~/core/Movimento";
import { IconToast, ToastType } from "~/core/Toast";

const movimentos = ref<Movimento[]>([])
const movimentosResponse = ref<MovimentoResponse[]>([])
const movimentosCount = ref<MovimentoCount[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

export function useMovimentos() {

    const {addToast} = useMyToast()

    const getMovimentos = async () => {
        loading.value = true
        try {
            const response = await $fetch<Movimento[]>('/api/movimentos')
            movimentos.value = response
           
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


    const createMovimento = async (data: Movimento) => {
        loading.value = true
        try {
            const response = await $fetch('/api/movimentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            if(response.statusCode === 200) {
                await getMovimentosCount()
                await getMovimentosByProductId(String(data.produtoId))
            }
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

    const getMovimentosCount = async () => {
        loading.value = true
        try {
            const response = await $fetch<MovimentoCount[]>('/api/movimentos/count', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            movimentosCount.value = response
           
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

    const getMovimentosByProductId = async (id: string) => {
        loading.value = true
        movimentosResponse.value = []
        try {
            const response = await $fetch<MovimentoResponse[]>(`/api/movimentos/produto/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                params: {
                    product_id: id
                }
            })
            movimentosResponse.value = response
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
       await getMovimentosCount()
    })

    return {
        movimentos,
        movimentosCount,
        loading,
        error,
        getMovimentos,
        createMovimento,
        getMovimentosCount,
        getMovimentosByProductId,
        movimentosResponse
    }

}