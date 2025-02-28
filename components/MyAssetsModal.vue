<script async setup lang="ts">

import { Assets } from '~/core/Patrimony';
import { IconToast, ToastType } from '~/core/Toast';


const isOpen = useAssetsOpen()
const { updateAssets, createAssets, loading } = useAssets()
const { assetsTypes } = useAssetsType()
const { assetsClassifications } = useAssetsClassification()
const { assetsSubgroups } = useAssetsSubgroup()
const { addToast } = useMyToast()
interface Props {
  data: Assets
}

const props = defineProps<Props>()




let state = reactive<Assets>({
  id: '',
  description: '',
  assetsClassificationId: '',
  assetsTypeId: '',
  assetsSubgroupAssets: []
})

const subgroup = ref()

const cleanState = () => {
  state.id = ''
  state.description = ''
  state.assetsClassificationId = ''
  state.assetsTypeId = ''
  state.assetsSubgroupAssets = []
}

const onSubmit = async () => {

  if (state?.id !== '') {

    await updateAssets(props.data.id!, state)
  } else {
    await createAssets(state)

  }

  isOpen.value = false

}

const closed = () => {
  isOpen.value = false

}


const addAssetsSubgroup = () => {

  const exists = state.assetsSubgroupAssets!.find((item) => item.assetsSubgroupId === subgroup.value)
  if (exists) {
    addToast({
      title: 'Erro',
      type: ToastType.Error,
      description: 'Já Adicionado',
      icon: IconToast.Error
    })
    subgroup.value = ''
    return
  }
  state.assetsSubgroupAssets!.push({
    assetsSubgroupId: subgroup.value,
    assetsId: state.id !== '' ? state.id! : 'new'
  })
  subgroup.value = ''

}

const removeAssetsSubgroup = (id: string) => {
  state.assetsSubgroupAssets = state.assetsSubgroupAssets!.filter((item) => item.assetsSubgroupId !== id)
}


watchEffect(() => {


  if (isOpen.value && props.data.id === '') {
    cleanState()
  } else {
    if (props && props.data) {

      state = props.data


    }
  }
})




</script>

<template>
  <div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{ state?.id !== '' ? 'Editar Ativos' : 'Novo Ativos' }}</h1>
        </template>

        <UForm v-if="!loading" :schema="Assets" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex flex-col gap-2 '>


            <div class="flex gap-2">
              <UFormGroup label="Classificação" name="assetsClassificationId" class='w-full' required>

                <USelect v-model="state.assetsClassificationId" placeholder="Escolha uma classificação"
                  :options="assetsClassifications" option-attribute="description" value-attribute="id" />
              </UFormGroup>
              <UFormGroup label="Tipo" name="assetsTypeId" class='w-full' required>

                <USelect v-model="state.assetsTypeId" placeholder="Escolha um tipo" :options="assetsTypes"
                  option-attribute="description" value-attribute="id" />
              </UFormGroup>
            </div>
            <div class="flex gap-2">
              <UFormGroup label="Descrição" name="description" class='w-full' required>
                <UInput placeholder="Descrição" v-model="state.description" />
              </UFormGroup>
            </div>
            <div class="flex gap-2">




            </div>
            <div class="flex gap-2">

              <UFormGroup label="Subgrupos" name="subgroup" class='w-full'>
                <div class="flex gap-2">

                  <USelect v-model="subgroup" placeholder="Adicione os subgrupos" :options="assetsSubgroups"
                    option-attribute="description" value-attribute="id" class="w-full" />
                  <UButton :disabled="!subgroup" @click="addAssetsSubgroup" color="primary" variant="solid"
                    icon="i-heroicons-plus-20-solid" />
                </div>
              </UFormGroup>
            </div>
            <div class="flex gap-2 flex-col h-20 overflow-y-auto border rounded-md border-gray-300 p-2">
              <div class="flex gap-2 items-center" v-for="item in state.assetsSubgroupAssets"
                :key="item.assetsSubgroupId">
                <span class=" font-bold "> {{assetsSubgroups.find(x => x.id === item.assetsSubgroupId)?.description
                  }}</span>
                <UButton size="2xs" icon="i-heroicons-trash-20-solid" variant="solid" color="red"
                  @click="removeAssetsSubgroup(item.assetsSubgroupId)" />
              </div>
            </div>

          </div>

          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />

            <UButton label="Salvar" type='submit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
          <h1 class='text-2xl'>Salvando Ativo...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>