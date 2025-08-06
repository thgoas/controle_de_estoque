<script async setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

import type { Patrimony } from '~/core/Patrimony';
const { loading, patrimonies, deletePatrimony } = usePatrimony()
const { status } = useStatus()
const { stores } = useStores()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isOpen = usePatrimonyOpen()
const isOpenDelete = useDeleteOpen()
const isOpenHistoric = useHistoricOpen()
const isOpenPatrimonyMovement = usePatrimonyMovementOpen()
const isOpenPatrimonyStatus = usePatrimonyStatusOpen()
const isOpenPatrimonyConnect = usePatrimonyConnectOpen()




const columns = [
    {
        key: 'id',
        label: 'Patrimônio'
    },
    {
        key: 'description',
        label: 'Descrição'
    },
    {
        key: 'status_id',
        label: 'Status'
    },
    {
        key: 'store_id',
        label: 'Loja'
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

const actions = ref('')

const q = ref('')

const selected = ref<Patrimony>({
    id: '',
    description: '',
    assets_id: '',
    assets_subgroup_id: '',
    guarantee_date: undefined,
    invoice: '',
    low_date: undefined,
    note: '',
    people: '',
    price: 0,
    purchase_date: undefined,
    serial_number: '',
    sector_id: '',
    store_id: '',
    provider_id: '',
    status_id: '',
})

const cleanState = () => {
    selected.value = {
        id: '',
        description: '',
        assets_id: '',
        assets_subgroup_id: '',
        guarantee_date: undefined,
        invoice: '',
        low_date: undefined,
        note: '',
        people: '',
        price: 0,
        purchase_date: undefined,
        serial_number: '',
        sector_id: '',
        store_id: '',
        provider_id: '',
        status_id: '',
    }
}
function select(row: Patrimony) {
    const findStore = patrimonies.value.find((f) => f.id === row.id)

    selected.value = findStore!
    isOpen.value = true

}

function handleHistoricOpenModal(row: Patrimony) {
    if (row.id === '') return
    selected.value = row
    isOpenHistoric.value = true
}

const description = ref('')
const idDelete = ref('')
function handleDelete(status: boolean) {
    if (status) {
        deletePatrimony(idDelete.value)
    }
}
function handleDeleteOpenModal(row: Patrimony) {
    if (row.id === '') return
    idDelete.value = row.id!
    description.value = 'Tem certeza que deseja deletar esse patrimônio? ' + row.description
    isOpenDelete.value = true

}

function handlePatrimonyMovementOpenModal(row: Patrimony) {
    if (row.id === '') return
    selected.value = row
    isOpenPatrimonyMovement.value = true
}

function handlePatrimonyStatusOpenModal(row: Patrimony) {
    if (row.id === '') return
    selected.value = row
    isOpenPatrimonyStatus.value = true
}

function handlePatrimonyConnectOpenModal(row: Patrimony) {
    if (row.id === '') return
    selected.value = row
    isOpenPatrimonyConnect.value = true
}
const searchOptions = ['Tudo', 'Patrimônio', 'Descrição', 'Status', 'Lojas', 'Número de Série', 'Data de Compra', 'Data de Baixa', 'Valor']
const typeSearch = ref(searchOptions[0])

const filteredRows = computed(() => {

    if (!q.value) {
        return patrimonies.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    if (typeSearch.value === 'tudo') {
        return patrimonies.value.filter((f) => {

            return Object.values(f).some((value) => {

                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)

    } else if (typeSearch.value === 'Patrimônio') {
        return patrimonies.value.filter((f) => {

            return String(f.id).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Descrição') {
        return patrimonies.value.filter((f) => {

            return String(f.description).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Número de Série') {
        return patrimonies.value.filter((f) => {

            return String(f.serial_number).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Data de Compra') {
        return patrimonies.value.filter((f) => {

            return String(f.purchase_date).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Data de Baixa') {
        return patrimonies.value.filter((f) => {

            return String(f.low_date).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Valor') {
        return patrimonies.value.filter((f) => {

            return String(f.price).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Status') {
        return patrimonies.value.filter((f) => {

            return String(f.status_id).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    } else if (typeSearch.value === 'Lojas') {
        return patrimonies.value.filter((f) => {

            return String(f.store_id).toLowerCase().includes(q.value.toLowerCase())
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)

    } else {
        return patrimonies.value.filter((f) => {
            return Object.values(f).some((value) => {
                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }


    // patrimonies.value.filter((f) => {

    //    return Object.values(f).some((value) => {

    //        return String(value).toLowerCase().includes(q.value.toLowerCase())
    //    })
})

const filteredRowsLength = computed(() => {

    if (!q.value) {
        return patrimonies.value.length
    }
    if (typeSearch.value === 'tudo') {
        return patrimonies.value.filter((f) => {

            return Object.values(f).some((value) => {

                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).length

    } else if (typeSearch.value === 'Patrimônio') {
        return patrimonies.value.filter((f) => {

            return String(f.id).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Descrição') {
        return patrimonies.value.filter((f) => {

            return String(f.description).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Número de Série') {
        return patrimonies.value.filter((f) => {

            return String(f.serial_number).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Data de Compra') {
        return patrimonies.value.filter((f) => {

            return String(f.purchase_date).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Data de Baixa') {
        return patrimonies.value.filter((f) => {

            return String(f.low_date).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Valor') {
        return patrimonies.value.filter((f) => {

            return String(f.price).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Status') {
        return patrimonies.value.filter((f) => {

            return String(f.status_id).toLowerCase().includes(q.value.toLowerCase())
        }).length
    } else if (typeSearch.value === 'Lojas') {
        return patrimonies.value.filter((f) => {

            return String(f.store_id).toLowerCase().includes(q.value.toLowerCase())
        }).length

    } else {
        return patrimonies.value.filter((f) => {
            return Object.values(f).some((value) => {
                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).length
    }


    // patrimonies.value.filter((f) => {

    //    return Object.values(f).some((value) => {

    //        return String(value).toLowerCase().includes(q.value.toLowerCase())
    //    })
})

const page = ref(1)
const pageCount = 5


function newStore() {
    cleanState()
    actions.value = 'new'
    isOpen.value = true
}


const items = (row: any) => [
    [
        {
            label: 'Visualizar',
            icon: 'i-heroicons-eye-20-solid',
            click: () => {
                select(row)
                actions.value = 'view'
            }
        },
        {
            label: 'Histórico',
            icon: 'i-heroicons-clock-20-solid',
            click: () => {
                handleHistoricOpenModal(row)
            }
        },

    ],
    [
        {
            label: 'Movimentar',
            icon: 'i-heroicons-arrow-path-20-solid',
            click: () => {
                handlePatrimonyMovementOpenModal(row)
            }
        },
        {
            label: 'Status',
            icon: 'i-heroicons-rocket-launch-20-solid',
            click: () => {
                handlePatrimonyStatusOpenModal(row)
            }
        },
        {
            label: 'Conexões',
            icon: 'i-heroicons-arrows-pointing-in-20-solid',
            click: () => {
                handlePatrimonyConnectOpenModal(row)
            }
        },

    ],
    [
        {
            label: 'Editar',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => {
                select(row)
                actions.value = 'edit'
            }
        },
        {
            label: 'Deletar',
            icon: 'i-heroicons-trash-20-solid',
            click: () => handleDeleteOpenModal(row)
        }
    ]
]

</script>
<template>

    <MyPatrimonyModal :data="selected" :actions="actions" />
    <MyHistoricModal :data="selected" />
    <MyPatrimonyMovementModal :data="selected" />
    <MyDeleteModal title="Deletar Patrimônio" :description="description" :fn="handleDelete" />
    <MyPatrimonyStatusModal :data="selected" />
    <MyPatrimonyConnectModal :data="selected" />

    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Patrimonios</h3>
            <div
                class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col gap-1 sm:flex-row">
                    <UInput v-if="typeSearch !== 'Status' && typeSearch !== 'Lojas'" v-model="q"
                        placeholder="Procurar..." :type="typeSearch.includes('Data') ? 'date' : 'text'" />
                    <USelect v-if="typeSearch === 'Status'" v-model="q" :options="status" option-attribute="description"
                        value-attribute="id" />
                    <USelect v-if="typeSearch === 'Lojas'" v-model="q" :options="stores" option-attribute="description"
                        value-attribute="id" />
                    <USelect v-model="typeSearch" :options="searchOptions" @change="q = ''" />
                </div>
                <div class="flex gap-1">
                    <UButton @click="newStore">Novo</UButton>
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
                <template #status_id-data="{ row }">
                    <UBadge size="sm" :label="status.find((f) => f.id === row.status_id)?.description"
                        :color="status.find((f) => f.id === row.status_id)?.color as any" />
                </template>
                <template #store_id-data="{ row }">
                    <span>{{stores.find((f) => f.id === row.store_id)?.description}}</span>
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRowsLength" />
            </div>
        </UCard>
    </div>
</template>
