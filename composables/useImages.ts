import type { Image } from '~/core/Images'
import { IconToast, ToastType } from '~/core/Toast'

const images = ref<Image[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export default function useImages() {
    const { addToast } = useMyToast()
    const getAllImagesByPatrimony_id = async (patrimony_id: string) => {
        loading.value = true
        try {
            images.value = await $fetch<Image []>(`/api/images/patrimony/${patrimony_id}`, {
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

    const getAllImagesByProduct_id = async (product_id: string) => {
        loading.value = true
        try {
            images.value = await $fetch<Image []>(`/api/images/product/${product_id}`, {
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

    const getAllImagesByHistoric_id = async (historic_id: string) => {
        loading.value = true
        try {
            images.value = await $fetch<Image []>(`/api/images/historic/${historic_id}`, {
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

    const uploadImages = async (data: Image[]) => {
 
        loading.value = true
        try {
            const response = await $fetch<Image>('/api/images', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            images.value?.push(response)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Upload enviado com sucesso!',
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

    

    const deleteImage = async (id: string) => {
        loading.value = true
        try {
            await $fetch(`/api/images/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            const index = images.value.findIndex((f) => f.id === id)
            images.value.splice(index as number, 1)
            addToast({
                type: ToastType.Success,
                title: 'Success',
                description: 'Ativo deletado com sucesso!',
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
        
    })

    return {
        images,
        loading,
        error,
        getAllImagesByPatrimony_id,
        getAllImagesByProduct_id,
        getAllImagesByHistoric_id,
        uploadImages,
        deleteImage,
    }
}
