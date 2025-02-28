<script async setup lang="ts">
import { MovementData, type Patrimony } from '~/core/Patrimony';



const isOpen = usePatrimonyMovementOpen()

const { stores } = useStores()
const { sectors } = useSectors()
const { status } = useStatus()
const { movementPatrimony } = usePatrimony()

interface Props {
  data: Patrimony
}

const props = defineProps<Props>()

const datas = reactive<MovementData>({
  patrimony_id: props.data.id!,
  description: '',
  it_went_out_date: new Date().toISOString().split('T')[0],
  entered_date: new Date().toISOString().split('T')[0],
  entered_store_id: '',
  entered_sector_id: '',
  status_id: '',
})

const cleanState = () => {
  datas.patrimony_id = props.data.id!,
    datas.description = '',
    datas.it_went_out_date = new Date().toISOString().split('T')[0],
    datas.entered_date = new Date().toISOString().split('T')[0],
    datas.entered_store_id = '',
    datas.entered_sector_id = ''
    datas.status_id = ''
}
const closed = () => {
  isOpen.value = false

}


const onSubmit = async () => {

  await movementPatrimony(props.data.id, datas)
  isOpen.value = false
}

watchEffect(() => {

  cleanState()

})

</script>

<template>
  <div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold">Movimentar</h1>
            <div class="flex flex-col ">
              <span class=" text-gray-600 font-semibold text-sm">Patrimonio: {{ props.data.id }} {{
                props.data.description }}</span>
              <div class="flex  gap-2">

                <span class=" text-gray-600 font-semibold text-sm">Loja Saída: {{stores.find(f => f.id ===
                  props.data.store_id)?.description }}</span>
                <span class="text-gray-600 font-semibold text-sm"> - </span>
                <span class=" text-gray-600 font-semibold text-sm">Loja Entrada: {{stores.find(f => f.id ===
                  datas.entered_store_id)?.description }}</span>
              </div>
              <div class="flex gap-2">

                <span class=" text-gray-600 font-semibold text-sm">Setor Saída: {{sectors.find(f => f.id ===
                  props.data.sector_id)?.description }}</span>
                <span class="text-gray-600 font-semibold text-sm"> - </span>
                <span class=" text-gray-600 font-semibold text-sm">Setor Entrada: {{sectors.find(f => f.id ===
                  datas.entered_sector_id)?.description }}</span>
              </div>
            </div>
          </div>
        </template>
        <UForm v-if="true" :schema="MovementData" :state="datas" class="space-y-4" @submit="onSubmit">

          <div class="flex flex-col gap-2">
            <div class="flex flex-col md:flex-row gap-2">
              <UFormGroup label="Saída" name="it_went_out_date" class='w-full' required>
                <UInput type="date" v-model="datas.it_went_out_date" />
              </UFormGroup>
              <UFormGroup label="Entrada" name="entered_date" class='w-full' required>
                <UInput type="date" v-model="datas.it_went_out_date" />
              </UFormGroup>
              <UFormGroup label="Status" name="status_id" class='w-full' required>
                <USelectMenu clear-search-on-close placeholder="Escolha um Status" :options="status"
                  option-attribute="description" searchable searchable-placeholder="Buscar Status" value-attribute="id"
                  v-model="datas.status_id" />
              </UFormGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-2">

              <UFormGroup label="Loja" name="entered_store_id" class='w-full' required>
                <USelectMenu clear-search-on-close placeholder="Escolha uma loja" :options="stores"
                  option-attribute="description" searchable searchable-placeholder="Buscar Loja" value-attribute="id"
                  v-model="datas.entered_store_id" />
              </UFormGroup>
              <UFormGroup label="Setor" name="entered_sector_id" class='w-full' required>
                <USelectMenu clear-search-on-close placeholder="Escolha um setor" :options="sectors"
                  option-attribute="description" searchable searchable-placeholder="Buscar Setor" value-attribute="id"
                  v-model="datas.entered_sector_id" />
                </ UFormGroup>
            </div>
            <UFormGroup label="Motivo" name="description" class='w-full' required>
              <UTextarea placeholder="Motivo" v-model="datas.description" />
              </ UFormGroup>
          </div>
          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />

            <UButton label="Salvar" type='submit' />
          </div>
        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
          <h1 class='text-2xl'>Fazendo a transferência do Patrimonio...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>