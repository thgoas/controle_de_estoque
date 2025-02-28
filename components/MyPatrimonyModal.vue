<script async setup lang="ts">


import { Patrimony } from '~/core/Patrimony';



const isOpen = usePatrimonyOpen()
const { updatePatrimony, createPatrimony, loading } = usePatrimony()

const { assetsSubgroups } = useAssetsSubgroup()
const { assets } = useAssets()
const { stores } = useStores()
const { sectors } = useSectors()
const { providers } = useProviders()
const { addToast } = useMyToast()
const { status } = useStatus()
const { patrimonies } = usePatrimony()
interface Props {
  data: Patrimony
  actions: string
}

const props = defineProps<Props>()




let state = reactive<Patrimony>({
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
  patrimoniesConnections: [],
  status_id: ''
})

const subgroup = ref()

const cleanState = () => {
  state.id = '',
    state.description = '',
    state.assets_id = '',
    state.assets_subgroup_id = '',
    state.guarantee_date = undefined,
    state.invoice = '',
    state.low_date = undefined,
    state.note = '',
    state.people = '',
    state.price = 0,
    state.purchase_date = undefined,
    state.serial_number = '',
    state.sector_id = '',
    state.store_id = '',
    state.provider_id = '',
    state.patrimoniesConnections = [],
    state.status_id = ''
}

const onSubmit = async () => {


  if (props.actions === 'edit') {

    await updatePatrimony(props.data.id!, state)
  } else {
    await createPatrimony(state)
  }


  isOpen.value = false

}

const closed = () => {
  isOpen.value = false

}

const selectAssetsGroups = () => {

  if (state.assets_id !== '') {

    const assetsFind = assets.value.find((f) => f.id === state.assets_id)?.assetsSubgroupAssets
    const sub = []
    for (let i = 0; i < assetsFind!.length; i++) {
      const item = assetsSubgroups.value.find((f) => f.id === assetsFind![i].assetsSubgroupId)
      sub.push(item)
    }
    subgroup.value = sub

  }
  state.description = assets.value.find((f) => f.id === state.assets_id)?.description!
}



watchEffect(() => {


  if (isOpen.value && props.data.id === '') {
    cleanState()
  } else {
    if (props && props.data) {

      state = props.data
      state.price = Number(state.price)

    }
  }
})

const patrimoniesConnectionsColumns = [
  {
    key: 'patrimonyIdTwo',
    label: 'Patrimônio',
  },
  {
    key: 'description',
    label: 'Descrição',
  }
]


</script>

<template>
  <div>

    <UModal v-model="isOpen" fullscreen>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">{{ props.actions === 'edit' ? 'Editar Patrimônio' : props.actions === 'view' ? 'Visualizar Patrimônio' : 'Novo Patrimônio' }}</h1>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>

        <UForm v-if="!loading" :schema="Patrimony" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>


            <div class="flex flex-col sm:flex-row gap-2">

              <UFormGroup label="Patrimônio" name="id" class='w-full' required>
                <UInput v-model="state.id" placeholder="Patrimônio" />
              </UFormGroup>

              <UFormGroup label="Ativo" name="assets_id" class='w-full' required>
                <USelectMenu clear-search-on-close placeholder="Escolha um ativo" :options="assets"
                  option-attribute="description" searchable searchable-placeholder="Buscar Ativo" value-attribute="id"
                  v-model="state.assets_id" v-on:change="selectAssetsGroups" />

              </UFormGroup>
              <UFormGroup label="Subgrupo" name="assets_subgroup_id" class='w-full' required>

                <USelectMenu clear-search-on-close placeholder="Escolha um Subgrupo" :options="subgroup"
                  option-attribute="description" value-attribute="id" searchable
                  searchable-placeholder="Buscar Subgrupo" v-model="state.assets_subgroup_id"
                  v-on:change="state.description = state.description + ' ' + assetsSubgroups.find((f) => f.id === state.assets_subgroup_id)?.description + ' '" />
              </UFormGroup>

              <UFormGroup label="Status" name="status_id" class='w-full' required>

                <USelectMenu clear-search-on-close placeholder="Escolha um Status" :options="status" option-attribute="description"
                  value-attribute="id" searchable searchable-placeholder="Buscar Status" v-model="state.status_id" />
              </UFormGroup>
            </div>

            <UFormGroup label="Descrição" name="description" class='w-full' required>
              <UInput placeholder="Descrição" v-model="state.description" />
            </UFormGroup>


            <div class="flex flex-col md:flex-row gap-2">
              <UFormGroup label='N° de Série' name='serial_number' class='w-full'>

                <UInput placeholder="N° de Série" v-model="state.serial_number" />
              </UFormGroup>
              <UFormGroup label='Empresa' name='store_id' class='w-full' required>

                <USelectMenu clear-search-on-close placeholder="Escolha uma Empresa" :options="stores"
                  option-attribute="description" searchable searchable-placeholder="Buscar Empresa" value-attribute="id"
                  v-model="state.store_id" />
              </UFormGroup>

              <UFormGroup label='Setor' name='sector_id' class='w-full' required>

                <USelectMenu clear-search-on-close placeholder="Escolha uma Setor" :options="sectors"
                  option-attribute="description" searchable searchable-placeholder="Buscar Setor" value-attribute="id"
                  v-model="state.sector_id" />
              </UFormGroup>
              <UFormGroup label='NF-e' name='invoice' class='w-full'>

                <UInput placeholder="Nf-e" v-model="state.invoice" />
              </UFormGroup>

              <UFormGroup label='Fornecedor' name='provider_id' class='w-full'>

                <USelectMenu clear-search-on-close placeholder="Escolha um Fornecedor" :options="providers"
                  option-attribute="description" searchable searchable-placeholder="Buscar Fornecedor"
                  value-attribute="id" v-model="state.provider_id" />
              </UFormGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-2">

              <UFormGroup label='Compra' name='purchase_date' class='w-full'>

                <UInput placeholder="Data" type="date" v-model="state.purchase_date" />
              </UFormGroup>

              <UFormGroup label='Valor' name='price' class='w-full'>

                <CurrencyInput v-model="state.price" />
              </UFormGroup>

              <UFormGroup label='Garantia' name='guarantee_date' class='w-full'>

                <UInput placeholder="Data" type="date" v-model="state.guarantee_date" />
              </UFormGroup>

              <UFormGroup label='Baixa' name='low_date' class='w-full'>

                <UInput placeholder="Data" type="date" v-model="state.low_date" />
              </UFormGroup>


              <UFormGroup label='Usuário' name='people' class='w-full'>

                <UInput placeholder="Usuário" v-model="state.people" />
              </UFormGroup>

            </div>
            <UFormGroup label='Baixa' name='low_date' class='w-full'>

              <UTextarea placeholder="Nota" v-model="state.note" />
            </UFormGroup>

            <div v-if="state.patrimoniesConnections && state.patrimoniesConnections.length > 0"
              class="flex flex-col gap-2">

              <span class="font-semibold text-sm text-gray-800">Conexões</span>
             
              <UTable :columns="patrimoniesConnectionsColumns" :rows="state.patrimoniesConnections" >
                <template #description-data="{ row }" >{{ patrimonies.find((f) => f.id === row.patrimonyIdTwo)?.description }}</template>
              </UTable>  
            </div>
          </div>

          <div v-if="props.actions !== 'view'" class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />

            <UButton label="Salvar" type='submit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
          <h1 class='text-2xl'>Salvando Patrimonio...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>