<script async setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { Provider } from '~/core/Patrimony';
import { useProviderOpen } from '~/composables/state';


const { loading, providers, deleteProvider } = useProviders()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isOpen = useProviderOpen()
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
        key: 'address',
        label: 'Endereço'
    },
    {
        key: 'phone',
        label: 'Telefone'
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
        selectedColumns.value = columns.filter((column) => column.key === 'description' || column.key === 'actions')
    }
})

const q = ref('')

const selected = ref<Provider>({
    id: '',
    description: '',
    status: true,
    cnpj: '',
    address: '',
    phone: '',
    email: '',
    contact_name: '',
    cep: '',
    obs: ''
})

const cleanState = () => {
    selected.value = {
        id: '',
        description: '',
        status: true,
        cnpj: '',
        address: '',
        phone: '',
        email: '',
        contact_name: '',
        cep: '',
        obs: ''
    }
}
function select(row: Provider) {
    const find = providers.value.find((f) => f.id === row.id)

    selected.value = find!
    isOpen.value = true

}

const description = ref('')
const idDelete = ref('')
function handleDeleteProvider(status: boolean) {
    if (status) {
        deleteProvider(idDelete.value)
    }
}
function handleDeleteOpenModal(row: Provider) {
    if (row.id === '') return
    idDelete.value = row.id!
    description.value = 'Tem certeza que deseja deletar esse fornecedor? ' + row.description
    isOpenDelete.value = true

}
const filteredRows = computed(() => {

    if (!q.value) {
        return providers.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return providers.value.filter((f) => {
        return Object.values(f).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const page = ref(1)
const pageCount = 5

function handleNew() {
    cleanState()
    isOpen.value = true
}


const items = (row: any) => [
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

    <MyProviderModal :data="selected" />
    <MyDeleteModal title="Deletar Fornecedor" :description="description" :fn="handleDeleteProvider" />
    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Fornecedores</h3>
            <div
                class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col gap-1 sm:flex-row">
                    <UInput v-model="q" placeholder="Procurar..." />

                </div>
                <div class="flex gap-1">
                    <UButton @click="handleNew">Novo</UButton>
                    <UButton color="gray" @click="() => navigateTo('/patrimonios')">Voltar</UButton>
                </div>
            </div>
            <UTable :loading="loading" :columns="selectedColumns" :rows="filteredRows"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }">
                <template #actions-data="{ row }">
                    <UDropdown :items="items(row)">
                        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                    </UDropdown>
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="providers.length" />
            </div>
        </UCard>
    </div>
</template>
