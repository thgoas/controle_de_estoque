<script setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { type Department, type DepartmentResponse } from '~/core/Department';
definePageMeta({
    middleware: "config"
})

const { departments, loadingDepartments } = useDepartments()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isDepartmentOpen = useDepartmentOpen()



const columns = [
    {
        key: 'name',
        label: 'Nome'
    },
    {
        key: 'createdAt',
        label: 'Criado'
    },
    {
        key: 'updatedAt',
        label: 'Atualizado'
    }
    
    
]

const departmentMap = (department: DepartmentResponse) => {
    return {
        ...department,
        createdAt: dateConvert(department.createdAt),
        updatedAt: dateConvert(department.updatedAt)
    }
}
const selectedColumns = ref([...columns])
watchEffect(() => {
    if (!isMobile.value) {

        selectedColumns.value = columns
    } else {
        selectedColumns.value = columns.slice(0, 1)
    }
})

const q = ref('')

const selectedDepartment = ref<Department>({
    id: '',
    name: '',})

const cleanState = () => {
    selectedDepartment.value = {
        id: '',
        name: '',
    }
}    
function select(row: Department) {
    const findDepartment = departments.value.find((department) => department.id === row.id)

    selectedDepartment.value = findDepartment!
    isDepartmentOpen.value = true

}
const filteredRows = computed(() => {

    if (!q.value) {
        return departments.value.map((department: DepartmentResponse) => departmentMap(department)).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return departments.value.map((department: DepartmentResponse) => departmentMap(department))
        .filter((department) => {
            return Object.values(department).some((value) => {
                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const page = ref(1)
const pageCount = 5

function newUser() {
    cleanState()
    isDepartmentOpen.value = true
}



</script>
<template>
    <MyDepartmentModal :department="selectedDepartment" />

    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Departamentos</h3>
            <div
                class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col gap-1 sm:flex-row">
                    <UInput v-model="q" placeholder="Departamentos..." />

                </div>
                <div class="flex gap-1">
                    <UButton @click="newUser">Novo</UButton>
                </div>
            </div>
            <UTable :loading="loadingDepartments" :columns="selectedColumns" :rows="filteredRows"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }" @select="select" />
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="departments.length" />
            </div>
        </UCard>
    </div>
</template>
