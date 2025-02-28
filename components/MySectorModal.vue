<script async setup lang="ts">

import { Sector } from '~/core/Patrimony';


const isOpen = useSectorOpen()
const { updateSector, createSector, loading } = useSectors()
interface Props {
  sector: Sector
}

const props = defineProps<Props>()


let status = ref('true')

let state = reactive<Sector>({
  id: '',
  description: '',
  status: true
})


const cleanState = () => {
  state.id = ''
  state.description = ''
  state.status =  true
  status.value = 'true'
}

const onSubmit = async () => {


  if (state?.id !== '') {

    await updateSector(props.sector.id!, state)
  } else {
    await createSector(state)

  }

  isOpen.value = false

}

const closed = () => {
  isOpen.value = false

}

watch(status, () => {

  state.status = status.value === 'true' ? true : false
})




watchEffect(() => {


  if (isOpen.value && props.sector.id === '') {
    cleanState()
  } else {
    if (props && props.sector) {
    
      state = props.sector
      status.value = props.sector.status.toString() 
     
    }
  }
})




</script>

<template>
  <div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{ state?.id !== '' ? 'Editar Setor' : 'Novo Setor' }}</h1>
        </template>

        <UForm v-if="!loading" :schema="Sector" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>


            <div class="flex gap-2">
              <UFormGroup label="Status" name="status" class='w-full' required>

                <USelect v-model="status" :options="[
                  { label: 'Ativo', value: 'true' },
                  { label: 'Inativo', value: 'false' },
                ]" option-attribute="label"   />
              </UFormGroup>
            </div>
            <div class="flex gap-2">

              <UFormGroup label="Descrição" name="description" class='w-full' required>
                <UInput placeholder="Descrição" v-model="state.description" />
              </UFormGroup>



            </div>








          </div>

          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />

            <UButton label="Salvar" type='submit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
          <h1 class='text-2xl'>Salvando Setor...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>