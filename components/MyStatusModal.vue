<script async setup lang="ts">

import { Status } from '~/core/Patrimony';


const isOpen = useStatusOpen()
const { updateStatus, createStatus, loading } = useStatus()
interface Props {
  data: Status
}

const props = defineProps<Props>()


let status = ref('true')

let state = reactive<Status>({
  id: '',
  description: '',
  status: true,
  color: ''
})


const cleanState = () => {
  state.id = ''
  state.description = ''
  state.status =  true
  status.value = 'true'
  state.color = ''
}

const onSubmit = async () => {


  if (state?.id !== '') {

    await updateStatus(props.data.id!, state)
  } else {
    await createStatus(state)

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
          <h1 class="text-2xl font-bold">{{ state?.id !== '' ? 'Editar Status' : 'Novo Status' }}</h1>
        </template>

        <UForm v-if="!loading" :schema="Status" :state="state" class="space-y-4" @submit="onSubmit">

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
            <UFormGroup label="Cor" name="color" class='w-full' >
              <UInput placeholder="Cor" v-model="state.color" />
            </UFormGroup>








          </div>

          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />

            <UButton label="Salvar" type='submit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
          <h1 class='text-2xl'>Salvando Status...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>