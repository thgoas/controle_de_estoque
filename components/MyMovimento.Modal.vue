<script async setup lang="ts">

import {  Movimento, type MovimentoCount, type MovimentoCountGrade } from '~/core/Movimento';

const isMovimentoOpen = useMovimentoOpen()
const {createMovimento, loading} = useMovimentos()


interface Props {
  type: string
  produto: MovimentoCount | null
}

const props = defineProps<Props>()



const state = reactive({
    tipoMovimento: '',
    produtoId:  0,
    gradeQuantidade:  [{ tamanho: '', quantidade: 0 }],
    descricao: '',
    notaFiscal: '',
})

const cleanStates = () => {
    state.tipoMovimento= ''
    state.produtoId=  0
    state.gradeQuantidade=  [{ tamanho: '', quantidade: 0 }]
    state.descricao= ''
    state.notaFiscal= ''
}

const verificationGradeQuantidade = ref(false)


watch(state, () => {
  const sum = state.gradeQuantidade.reduce((acc, item) => acc + item.quantidade, 0);
  if(sum === 0) {
    verificationGradeQuantidade.value = true
  } else {
    verificationGradeQuantidade.value = false
  }
})




const onSubmit = async () => {
 await createMovimento(state)

 isMovimentoOpen.value = false

}



watchEffect(async () => {
  if(isMovimentoOpen.value && props.type && props.produto?.id) {
    cleanStates()
    state.tipoMovimento = props.type
    state.produtoId = props.produto?.id || 0
    state.gradeQuantidade = props.produto?.grade.map((item) => ({ tamanho: item, quantidade: 0 })) || [{ tamanho: '', quantidade: 0 }]
  }
})

</script>

<template>
  <div>

    <UModal v-model="isMovimentoOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{props.type === 'Entrada' ? 'Entrada do Produto' : 'Saida do Produto'}}</h1>
          <h4 class="text-gray-500">{{props.produto?.produto}}</h4>
        </template>

        <UForm v-if="!loading"  :schema="Movimento" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>

            <UFormGroup required label="Tipo Movimento" name="tipoMovimento" class='w-full'>
              <UInput disabled v-model="state.tipoMovimento" />
            </UFormGroup>

            
            <UFormGroup  v-if="props.type === 'Entrada'" label="NF-e" name="notaFiscal" class='w-full'>
              <UInput  v-model="state.notaFiscal" />
              
            </UFormGroup>

            <UFormGroup required  label="Descrição" name="descricao" class='w-full'>
              <UTextarea placeholder="Descreva o motivo da movimentação" v-model="state.descricao" />
            </UFormGroup>
           
          </div>
          <UFormGroup required label="Grade" name="gradeQuantidade" class='w-full mb-4'>
          <div class="flex flex-wrap gap-1 ">

            <div  v-for="(tamanho, index) in props.produto?.grade" :key="tamanho" class="flex flex-1 gap-2 items-center " >
              <span>{{ tamanho }}:</span>
              <UInput v-model="state.gradeQuantidade[index].quantidade" min="0" type="number" class="w-[100px]" />
            </div>
          </div>
          <span v-if="verificationGradeQuantidade" class="text-red-500 text-sm" >Adicione pelo menos 1 tamanho</span>
        </UFormGroup>
        <UDivider />  
          <div class='flex gap-2  justify-between '>

            <UButton label="Fechar" color="red" @click="() => isMovimentoOpen = false" />
            <UButton label="Salvar" type='onSubmit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64" >
          <h1 class='text-2xl'>Salvando a {{ props.type }}...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>