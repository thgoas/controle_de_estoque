import type { Historic } from "~/core/Patrimony"
import { IconToast, ToastType } from "~/core/Toast"

const historical = ref<Historic[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useHistorical() {
    const { addToast } = useMyToast()
        const getHistoricByPatrimonyId = async (patrimonyId: string) => {
            loading.value = true
            try {
                historical.value = await $fetch<Historic  []>(`/api/historical/${patrimonyId}`, {
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
  return {
    historical,
    loading,
    error,
    getHistoricByPatrimonyId,
  }
}
