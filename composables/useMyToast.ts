import { desc } from 'drizzle-orm'
import { IconToast, ToastType, type IToast } from '~/core/Toast'

export function useMyToast() {
    const toast = useToast()

    const addToast = (data: IToast) => {
        toast.add({
            id: data.type,
            title: data.type,
            description: data.description,
            icon: data.icon,
            timeout: 5000,
        })
    }

    const errorToast = (e: unknown) => {
        addToast({
            type: ToastType.Error,
            title: 'Error',
            description: (e as any).message,
            icon: IconToast.Error,
        })
    }

    const successToast = (description: string) => {
        addToast({
            type: ToastType.Success,
            title: 'Success',
            description: description,
            icon: IconToast.Success,
        })
    }

    return {
        addToast,
        errorToast,
        successToast
    }
}
