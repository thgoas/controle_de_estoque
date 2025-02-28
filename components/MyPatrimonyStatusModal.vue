<script async setup lang="ts">
import { StatusData, type Patrimony } from '~/core/Patrimony';



const isOpen = usePatrimonyStatusOpen()

const { status } = useStatus()
const { statusPatrimony } = usePatrimony()

interface Props {
  data: Patrimony
}

const props = defineProps<Props>()

const datas = reactive<StatusData>({
  patrimony_id: props.data.id!,
  description: '',
  date: new Date().toISOString().split('T')[0],
  status_id: '',
})

const cleanState = () => {
    datas.patrimony_id = props.data.id!,
    datas.description = '',
    datas.date = new Date().toISOString().split('T')[0],
    datas.status_id = ''
}
const closed = () => {
  isOpen.value = false

}


const onSubmit = async () => {

  await statusPatrimony(props.data.id, datas)
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
            <h1 class="text-2xl font-bold">Status do patrimônio</h1>
            <div class="flex flex-col ">
              <span class=" text-gray-600 font-semibold text-sm">Patrimonio: {{ props.data.id }} {{
                props.data.description }}</span>
              <div class="flex  gap-2">

                <span class=" text-gray-600 font-semibold text-sm">Status: {{status.find(f => f.id ===
                  props.data.status_id)?.description}}</span>

              </div>

            </div>
          </div>
        </template>
        <UForm v-if="true" :schema="StatusData" :state="datas" class="space-y-4" @submit="onSubmit">

          <div class="flex flex-col gap-2">
            <div class="flex flex-col md:flex-row gap-2">
              <UFormGroup label="Data" name="date" class='w-full' required>
                <UInput type="date" v-model="datas.date" />
              </UFormGroup>
            </div>
            <div class="flex flex-col md:flex-row gap-2">

              <UFormGroup label="Status" name="status_id" class='w-full' required>
                <USelectMenu clear-search-on-close placeholder="Escolha um status" :options="status"
                  option-attribute="description" searchable searchable-placeholder="Buscar Status" value-attribute="id"
                  v-model="datas.status_id" />
              </UFormGroup>

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
          <h1 class='text-2xl'>Alterando o status do Patrimônio...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>