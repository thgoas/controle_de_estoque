import type { ICep } from "~/core/Cep"
import { IconToast, ToastType } from "~/core/Toast"

const fullCep = ref<ICep | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

export default function useViaCep() {
    const { addToast } = useMyToast()
    const fetchAddress = async (value: string) => {
            loading.value = true
        try {
            const response = await $fetch<ICep>(
                `https://viacep.com.br/ws/${value}/json/`
            )
            fullCep.value = response
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

    return { fullCep, loading, error, fetchAddress }
}
