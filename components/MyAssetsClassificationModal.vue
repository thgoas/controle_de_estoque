<script async setup lang="ts">

import { AssetsClassification } from '~/core/Patrimony';


const isOpen = useAssetsClassificationOpen()
const { updateAssetsClassification, createAssetsClassification, loading } = useAssetsClassification()
interface Props {
  data: AssetsClassification
}

const props = defineProps<Props>()


let status = ref('true')

let state = reactive<AssetsClassification>({
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

    await updateAssetsClassification(props.data.id!, state)
  } else {
    await createAssetsClassification(state)

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


  if (isOpen.value && props.data.id === '') {
    cleanState()
  } else {
    if (props && props.data) {
    
      state = props.data
      status.value = props.data.status.toString() 
     
    }
  }
})




</script>

<template>
  <div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{ state?.id !== '' ? 'Editar Classificação de Ativos' : 'Nova Classificação de Ativos' }}</h1>
        </template>

        <UForm v-if="!loading" :schema="AssetsClassification" :state="state" class="space-y-4" @submit="onSubmit">

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
          <h1 class='text-2xl'>Salvando Classificação de Ativo...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>