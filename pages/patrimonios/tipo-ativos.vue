<script async setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import type { AssetsType } from '~/core/Patrimony';
const { loading, assetsTypes, deleteAssetsType } = useAssetsType()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isOpen = useAssetsTypeOpen()
const isOpenDelete = useDeleteOpen()



const columns = [
    {
        key: 'description',
        label: 'Descrição'
    },
    {
        key: 'actions',
        label: 'Ações'
    }
]


const selectedColumns = ref([...columns])
watchEffect(() => {
    if (!isMobile.value) {

        selectedColumns.value = columns
    } else {
        selectedColumns.value = columns.filter((column) => column.key !== 'cnpj')
    }
})

const q = ref('')

const selected = ref<AssetsType>({
    id: '',
    description: '',
    status: true,
})

const cleanState = () => {
    selected.value = {
        id: '',
        description: '',
        status: true,
    }
}
function select(row: AssetsType) {
    const findStore = assetsTypes.value.find((f) => f.id === row.id)

    selected.value = findStore!
    isOpen.value = true

}

const description = ref('')
const idDelete= ref('')
function handleDelete(status: boolean) {
   if(status){
    deleteAssetsType(idDelete.value)
   }
}
function handleDeleteOpenModal(row: AssetsType) {
    if(row.id === '') return
    idDelete.value = row.id!
    description.value = 'Tem certeza que deseja deletar essa Tipo de Ativo? ' + row.description
    isOpenDelete.value = true

}
const filteredRows = computed(() => {

    if (!q.value) {
        return assetsTypes.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return assetsTypes.value.filter((f) => {
        return Object.values(f).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const page = ref(1)
const pageCount = 5

function newStore() {
    cleanState()
    isOpen.value = true
}


const items = (row: any)=> [
    [{
        label: 'Editar',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => select(row)
    }], [{
        label: 'Deletar',
        icon: 'i-heroicons-trash-20-solid',
        click: () => handleDeleteOpenModal(row)
    }]
]
</script>
<template>

    <MyAssetsTypeModal :data="selected" />
    <MyDeleteModal title="Deletar Tipo de Ativo" :description="description" :fn="handleDelete" />
    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Tipo de Ativos</h3>
            <div
                class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col gap-1 sm:flex-row">
                    <UInput v-model="q" placeholder="Procurar..." />

                </div>
                <div class="flex gap-1">
                    <UButton @click="newStore">Novo</UButton>
                    <UButton color="gray" @click="() => navigateTo('/patrimonios')">Voltar</UButton>
                </div>
            </div>
            <UTable :loading="loading" :columns="selectedColumns" :rows="filteredRows"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }" >
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="assetsTypes.length" />
            </div>
        </UCard>
    </div>
</template>
