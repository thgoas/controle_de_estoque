<script async setup lang="ts">

import { Provider } from '~/core/Patrimony';
import formatCEP from '~/utils/cepMask';
import formatCNPJ from '~/utils/cnpjMaks';
import formatPhone from '~/utils/phoneMask';


const isOpen = useProviderOpen()
const { updateProvider, createProvider, loading } = useProviders()
const { fullCep, fetchAddress, loading: loadingCep } = useViaCep()

interface Props {
  data: Provider
}

const props = defineProps<Props>()


let status = ref('true')

let state = reactive<Provider>({
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
  state.id = ''
  state.description = ''
  state.status = true
  state.cnpj = ''
  state.address = ''
  state.phone = ''
  state.email = ''
  state.contact_name = ''
  state.cep = ''
  state.obs
}

const onSubmit = async () => {
  if (state?.id !== '') {

    await updateProvider(props.data.id!, state)
  } else {
    await createProvider(state)

  }

  isOpen.value = false

}

const closed = () => {
  isOpen.value = false

}

async function onChangeCep(e: string) {
  const cep = e.replace(/\D/g, '')
  if (cep.length === 8) {
    await fetchAddress(e)
  }
}

watch(fullCep, () => {
  if (fullCep.value?.cep) {
    state.address = fullCep.value.logradouro + ', ' + fullCep.value.localidade + ', ' + fullCep.value.uf + ', ' + fullCep.value.bairro
    state.cep = fullCep.value.cep
  }
})

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
          <h1 class="text-2xl font-bold">{{ state?.id !== '' ? 'Editar Fornecedor' : 'Novo Fornecedor' }}</h1>
        </template>

        <UForm v-if="!loading" :schema="Provider" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>


            <div class="flex flex-col md:flex-row gap-2">
              <UFormGroup label="CNPJ" name="cnpj" class='w-full' required>
                <UInput placeholder="CNPJ" v-model="state.cnpj" watch="cnpj"
                  @update:modelValue="state.cnpj = formatCNPJ($event)" />
              </UFormGroup>
              <UFormGroup label="Status" name="status" class='w-full' required>

                <USelect v-model="status" :options="[
                  { label: 'Ativo', value: 'true' },
                  { label: 'Inativo', value: 'false' },
                ]" option-attribute="label" />
              </UFormGroup>
            </div>
            <UFormGroup label="Descrição" name="description" class='w-full' required>
              <UInput placeholder="Descrição" v-model="state.description" />
            </UFormGroup>

            <UFormGroup label="CEP" name="cep" class='w-full'>
              <UInput placeholder="CEP" v-model="state.cep" :disabled="loadingCep" @change="onChangeCep"
                @update:model-value="state.cep = formatCEP($event)" />
            </UFormGroup>

            <UFormGroup label="Endereço" name="address" class='w-full' required>
              <UInput placeholder="Endereço" v-model="state.address" :disabled="loadingCep" />
            </UFormGroup>
            <div class="flex flex-col md:flex-row gap-2">

              <UFormGroup label="Contato" name="contact_name" class='w-full' >
              <UInput placeholder="Contato" v-model="state.contact_name" />
            </UFormGroup>

            <UFormGroup label="Telefone" name="phone" class='w-full' >
              <UInput placeholder="Telefone" v-model="state.phone" @update:model-value="state.phone = formatPhone($event)" />
            </UFormGroup>

            </div>
            
              <UFormGroup label="E-mail" name="email" class='w-full' >
              <UInput placeholder="E-mail" v-model="state.email" />
            </UFormGroup>
           
            <UFormGroup label="Observação" name="obs" class='w-full' >
              <UTextarea placeholder="Observação" v-model="state.obs" />
            </UFormGroup>








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