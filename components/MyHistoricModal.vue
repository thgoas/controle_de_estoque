<script async setup lang="ts">
import type { Patrimony } from '~/core/Patrimony';



const isOpen = useHistoricOpen()

const { historical, loading, error, getHistoricByPatrimonyId } = useHistorical()

interface Props {
  data: Patrimony
}

const props = defineProps<Props>()

const columns = [
  {
    key: 'user',
    label: 'Usuário'
  },
  {
    key: 'description',
    label: 'Descrição'
  },
  {
    key: 'type_historic',
    label: 'Tipo'
  },
  {
    key: 'it_went_out_store',
    label: 'Saiu'
  },
  {
    key: 'entered_store',
    label: 'Entrou'
  },

  {
    key: 'it_went_out_sector',
    label: 'Saiu'
  },
  {
    key: 'entered_sector',
    label: 'Entrou'
  },

  {
    key: 'it_went_out_date',
    label: 'Saiu'
  },
  {
    key: 'entered_date',
    label: 'Entrou'
  },

  {
    key: 'createdAt',
    label: 'Criado',

  },


]

const page = ref(1)
const pageCount = ref(5)

const rows = computed(() => {
  return historical.value.slice((page.value - 1) * pageCount.value, (page.value) * pageCount.value)
})

const closed = () => {
  isOpen.value = false

}

watchEffect(async () => {

  if (isOpen.value) {
    await getHistoricByPatrimonyId(props.data.id!)
  }
})


</script>

<template>
  <div>

    <UModal v-model="isOpen" fullscreen>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Histórico</h1>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" square padded
              @click="closed" />
          </div>
        </template>

        <UTable :rows="rows" :columns="columns">
          <template #createdAt-data="{ row }">
            {{ new Date(row.createdAt).toLocaleDateString() }} {{ new Date(row.createdAt).toLocaleTimeString() }}
          </template>
          <template #it_went_out_date-data="{ row }">
            {{ row.it_went_out_date && new Date(row.it_went_out_date).toLocaleDateString() }}

          </template>
          <template #entered_date-data="{ row }">
            {{ new Date(row.entered_date).toLocaleDateString() }}
          </template>
        </UTable>
        <div class="flex flex-col md:flex-row justify-end gap-2 px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
         <div class="flex items-center gap-2">

           <span>Itens por Paginas:</span>
           <USelect v-model="pageCount" :options="[5, 10, 20, 30, 50]" />
         </div>
          <UPagination v-model="page" :page-count="pageCount" :total="historical.length" />
        </div>

      </UCard>
    </UModal>
  </div>
</template>