<script setup lang="ts">

import  { Product } from '~/core/Product';

const isProductOpen = useProductOpen()

const {  updateProduct, createProduct, loading} = useProducts()
interface Props {
  product: Product 
}

const props = defineProps<Props>()



let state = reactive<Product>({
    id: 0,
    descricao: '',
    referencia: '',
    cor: '',
    marca: '',
    complemento: '',
    grade: '',
    tipo: '',
    modelo: '',
    
})
const tamanho = ref('')

const cleanState = () => {
  state.id = 0
  state.descricao = ''
  state.referencia = ''
  state.cor = ''
  state.marca = ''
  state.complemento = ''
  state.grade = ''
  tamanho.value = ''
  state.tipo = ''
  state.modelo = ''

}

const onSubmit = async () => {
  console.log('state', state)
  if(state?.id !== 0) {
    await updateProduct(props.product.id! ,state)
  } else {
    await createProduct(state)

  }

  isProductOpen.value = false

}

const closed = () => {
  isProductOpen.value = false

}




watchEffect(() => {


  if (isProductOpen.value && props.product.id === 0) {
    cleanState()
  } else {
    if (props && props.product) {
      state = props.product

    }
  }
})

const addTamanho = (value: string) => {
  if(state.grade === '') {
    state.grade = value
  } else {
    state.grade = state.grade + ',' + value

  }
  tamanho.value = ''

}



</script>

<template>
  <div>

    <UModal v-model="isProductOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{state?.id ? 'Editar Produto' : 'Novo Produto'}}</h1>
        </template>

        <UForm v-if="!loading"  :schema="Product" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>
            <div class="flex gap-2">
            
              <UFormGroup label="Tipo de Produto" name="tipo" class='w-full' required>
                <UInput placeholder="Ex: Camisa, Calção, etc..." v-model="state.tipo" @keyup="state.descricao = state.tipo" />
              </UFormGroup>

              <UFormGroup label="Marca" name="marca" class='w-full' required>
                <UInput placeholder="Ex: Nike, Adidas, etc..." v-model="state.marca" @keyup="state.descricao = state.tipo + ' ' + state.marca" />
              </UFormGroup>
  
            </div>
            
            <div class="flex gap-2">
              <UFormGroup label="Referência" name="referencia" class='w-full' required>
                <UInput placeholder="Ex: AS334554, SX22334, etc..."  v-model="state.referencia" @keyup="state.descricao = state.tipo + ' ' + state.marca + ' ' + state.referencia" />
              </UFormGroup>
  
              <UFormGroup label="Cor" name="cor" class='w-full' required>
                <UInput placeholder="Ex: Azul, Vermelho, etc..." v-model="state.cor" @keyup="state.descricao = state.tipo + ' ' + state.marca + ' ' + state.referencia + ' ' + state.cor "  />
              </UFormGroup>
  
              <UFormGroup label="Modelo" name="modelo" class='w-full' required>
                <UInput placeholder="Ex: AS334554, SX22334, etc..." v-model="state.modelo" @keyup="state.descricao = state.tipo + ' ' +  state.marca + ' ' + state.referencia + ' ' + state.cor + ' ' + state.modelo "  />
              </UFormGroup>

            </div>

            <UFormGroup label="Descrição" name="descricao" class='w-full' required>
              <UInput v-model="state.descricao" />
            </UFormGroup>
            
            

            <div class='flex gap-2'>
              <UFormGroup label="Tamanhos" name="tamanhos" class='w-full'>
                <div class="flex gap-2">
                  <UInput placeholder="Ex: P, M, G, 34, TU" v-model="tamanho" @keyup="tamanho = tamanho.toUpperCase()" />
                  <UButton
                  icon="i-heroicons-plus-circle-20-solid"
                  @click="addTamanho(tamanho)"
                  />
                </div>
              </UFormGroup>
              <UFormGroup label="Grade tamanhos" name="grade" class='w-full'>
                <UInput v-model="state.grade" disabled />
              </UFormGroup>
            </div>

            <UFormGroup label="Complemento" name="complemento" class='w-full'>
              <UTextarea v-model="state.complemento!" />
            </UFormGroup>


           
          </div>
          
          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />
            <UButton label="Salvar" type='onSubmit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64" >
          <h1 class='text-2xl'>Salvando Produto...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>