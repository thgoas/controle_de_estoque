import type { Department, DepartmentResponse } from "~/core/Department"
import { IconToast, ToastType } from "~/core/Toast"

const loading = ref<boolean>(false)
const departments = ref<DepartmentResponse[] >([])
const error = ref<string | null>(null)

export default function useDepartments() {
    const { addToast } = useMyToast()

    const getAllDepartments = async () => {
        loading.value = true
        try {
            const response = await $fetch<DepartmentResponse[]>('/api/departments', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
            })
            departments.value = response
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

    const createDepartment = async (data: Department) => {
        loading.value = true
        try {
            const response = await $fetch<DepartmentResponse>('/api/departments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            departments.value.push(response)
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

    const updateDepartment = async (id: string, data: Department) => {
        loading.value = true
        try {
            const response = await $fetch<DepartmentResponse>(`/api/departments/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${useCookie('auth_token').value}`,
                },
                body: JSON.stringify(data),
            })
            const index = departments.value.findIndex(
                (department) => department.id === response.id
            )
            departments.value.splice(index as number, 1, response)
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
        await getAllDepartments()
    })

    return {
        getAllDepartments,
        loadingDepartments: loading,
        departments: departments,
        errorDepartments: error,
        createDepartment,
        updateDepartment
    }
}