<script async setup lang="ts">
import { PatrimonyConnection, type Patrimony } from '~/core/Patrimony';



const isOpen = usePatrimonyConnectOpen()

const { status } = useStatus()
const { patrimonies } = usePatrimony()
const { addConnections } = usePatrimony()

interface Props {
  data: Patrimony
}

const props = defineProps<Props>()



const patrimonyId = ref()
const state = ref<PatrimonyConnection[]>([])



const cleanState = () => {
 
  patrimonyId.value = ''
  state.value = []
}
const closed = () => {
  isOpen.value = false

}


const onSubmit = async () => {
 
    await addConnections(state.value)
    isOpen.value = false

  
}

watchEffect(() => {

  if (isOpen.value && props.data.id === '') {
    cleanState()
  } else {
    if (props.data.patrimoniesConnections && props.data.patrimoniesConnections?.length > 0) {
      state.value = props.data.patrimoniesConnections
    } else {
      state.value = []
    }
  }


})

const addPatrimonyConnection = () => {
  const exist = state.value.find((item) => item.patrimonyIdTwo === patrimonyId.value)
  if (exist) {
    patrimonyId.value = ''
    return
  }
  state.value.push({
    patrimonyIdOne: props.data.id,
    patrimonyIdTwo: patrimonyId.value,
    delete: false
  })

  patrimonyId.value = ''
}

const removePatrimonyConnection = (id: string) => {
  const find = state.value.find((item) => item.patrimonyIdTwo === id)
  state.value = state.value.filter((item) => item.patrimonyIdTwo !== id)
  if(!find) return
  state.value.push({
    patrimonyIdOne: find?.patrimonyIdOne,
    patrimonyIdTwo: find?.patrimonyIdTwo,
    delete: find.delete === true ? false : true  
  })
}

const filteredRows = computed(() => {
  return patrimonies.value.filter((item) => item.id !== props.data.id)
    .filter((item) => item.store_id === props.data.store_id)
    .filter((item) => item.id !== state.value.find((f) => f.patrimonyIdTwo === item.id)?.patrimonyIdTwo)
})


</script>

<template>
  <div>

    <UModal v-model="isOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-bold">Conexões do patrimônio</h1>
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
        <div v-if="true" class="space-y-4">

          <div class="flex flex-col gap-2">

            <div class="flex flex-col md:flex-row gap-2">

              <UFormGroup label="Patrimônio" name="patrimonyId" class='w-full'>
                <div class="flex gap-2">

                  <USelectMenu class='w-full' clear-search-on-close placeholder="Escolha um status"
                    :options="filteredRows" option-attribute="id" searchable searchable-placeholder="Buscar Status"
                    value-attribute="id" v-model="patrimonyId" />
                  <UButton :disabled="!patrimonyId" @click="addPatrimonyConnection" color="primary" variant="solid"
                    icon="i-heroicons-plus-20-solid" />
                </div>

              </UFormGroup>


            </div>
            <UFormGroup label="Conexões" name="patrimonyIdTwo" class='w-full'>
              <div class="flex gap-2 flex-col h-20 overflow-y-auto border rounded-md border-gray-300 p-2">
                <div class="flex gap-2 items-center" v-for="item in state" :key="item.patrimonyIdOne">
                  <span class=" font-bold "> {{patrimonies.find(x => x.id === item.patrimonyIdTwo)?.description
                    }}</span>
                  <UButton size="2xs" :icon="item.delete ? 'i-heroicons-link-slash-20-solid' :  'i-heroicons-link-20-solid'" variant="solid" :color="item.delete ? 'red' : 'green'"
                    @click="removePatrimonyConnection(item.patrimonyIdTwo)" />
                </div>
              </div>
            </UFormGroup>
          
          </div>
          <div  class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closed" />

            <UButton :disabled="state.length === 0" label="Salvar" @click="onSubmit" />
          </div>
        </div>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
          <h1 class='text-2xl'>Alterando o status do Patrimônio...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>