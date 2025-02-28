<script async setup lang="ts">

import  {Store}  from '~/core/Patrimony';
import formatCNPJ from '~/utils/cnpjMaks';


const isOpen = useStoreOpen()
const {updateStore, createStore, loading } = useStores()
interface Props {
  store: Store
}

const props = defineProps<Props>()


let status = ref('true')

let state = reactive<Store>({
  id: '',
  description: '',
  status:  true,
  cnpj: '',
})


const cleanState = () => {
  state.id = ''
  state.description = ''
  state.status =  true
  state.cnpj = ''
}

const onSubmit = async () => {
  if (state?.id !== '') {

    await updateStore(props.store.id! ,state)
  } else {
    await createStore(state)

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


  if (isOpen.value && props.store.id === '') {
    cleanState()
  } else {
    if (props && props.store) {
      state = props.store
      status.value = props.store.status.toString()
    }
  }
})




</script>

<template>
  <div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{ state?.id !== '' ? 'Editar Loja' : 'Nova Loja' }}</h1>
        </template>

        <UForm v-if="!loading" :schema="Store" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>
            
            
            <div class="flex gap-2">
              <UFormGroup label="CNPJ" name="cnpj" class='w-full' required>
                <UInput placeholder="CNPJ" v-model="state.cnpj"  watch="cnpj" @update:modelValue="state.cnpj = formatCNPJ($event)"/>
              </UFormGroup>
              <UFormGroup label="Status" name="status" class='w-full' required>
                
                <USelect v-model="status" :options="[
                  { label: 'Ativo', value: 'true' },
                  { label: 'Inativo', value: 'false' },
                ]" option-attribute="label" />
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
          <h1 class='text-2xl'>Salvando Loja...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div> 
</template>