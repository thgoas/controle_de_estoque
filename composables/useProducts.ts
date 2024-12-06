import type { Product } from "~/core/Product"
import { IconToast, ToastType } from "~/core/Toast"

const products = ref<Product[] >([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useProducts() {
    const { addToast } = useMyToast()
   const getAllProducts = async () => {
      loading.value = true
      try {
         const response = await $fetch<Product[]>('/api/products', {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${useCookie('auth_token').value}`,
            },
         })
         products.value = response
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

   const createProduct = async (data: Product) => {
      loading.value = true
      try {
         const response = await $fetch<Product>('/api/products', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${useCookie('auth_token').value}`,
            },
            body: JSON.stringify(data),
         })
         products.value?.push(response)
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

   const updateProduct = async (id: number, data: Product) => {
      loading.value = true
      try {
         const response = await $fetch<Product>(`/api/products/${id}`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${useCookie('auth_token').value}`,
            },
            body: JSON.stringify(data),
         })
         const index = products.value.findIndex(
            (product) => product.id === response.id
        )
        products.value.splice(index as number, 1, response)
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
      await getAllProducts()
   })

   return {
      products,
      loading,
      error,
      getAllProducts,
      createProduct,
      updateProduct
   }
}