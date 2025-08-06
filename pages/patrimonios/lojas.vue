<script async setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import useStores from '../../composables/useStores';
import type { Store } from '~/core/Patrimony';
import MyStoreModal from '~/components/MyStoreModal.vue';


const { loading, stores, deleteStore } = useStores()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isOpen = useStoreOpen()
const isOpenDelete = useDeleteOpen()



const columns = [
    {
        key: 'description',
        label: 'Descrição'
    },
    {
        key: 'cnpj',
        label: 'CNPJ'
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

const selectedStore = ref<Store>({
    id: '',
    description: '',
    cnpj: '',
    status: true,
})

const cleanState = () => {
    selectedStore.value = {
        id: '',
        description: '',
        cnpj: '',
        status: true,
    }
}
function select(row: Store) {
    const findStore = stores.value.find((store) => store.id === row.id)

    selectedStore.value = findStore!
    isOpen.value = true

}

const description = ref('')
const idDeleteStore = ref('')
function deleteStores(status: boolean) {
   if(status){
    deleteStore(idDeleteStore.value)
   }
}
function handleDeleteStore(row: Store) {
    if(row.id === '') return
    idDeleteStore.value = row.id!
    description.value = 'Tem certeza que deseja deletar essa loja? ' + row.description
    isOpenDelete.value = true

}
const filteredRows = computed(() => {

    if (!q.value) {
        return stores.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return stores.value.filter((f) => {
        return Object.values(f).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const filteredRowsLength = computed(() => {

    if (!q.value) {
        return stores.value.length
    }
    return stores.value.filter((f) => {
        return Object.values(f).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).length
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
        click: () => handleDeleteStore(row)
    }]
]
</script>
<template>

    <MyStoreModal :store="selectedStore" />
    <MyDeleteModal title="Deletar Loja" :description="description" :fn="deleteStores" />
    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Lojas</h3>
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
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRowsLength" />
            </div>
        </UCard>
    </div>
</template>
