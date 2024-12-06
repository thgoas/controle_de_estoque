<script async setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')

const isMovimentoOpen = useMovimentoOpen()

const { id } = useRoute().params

const {
    movimentosCount,
    getMovimentosByProductId,
    movimentosResponse,
    loading,
} = useMovimentos()

const columns = [
    {
        key: 'tipoMovimento',
        label: 'Movimento',
    },
    {
        key: 'descricao',
        label: 'Descrição',
    },
    {
        key: 'tamanho',
        label: 'Tamanho',
    },
    {
        key: 'quantidade',
        label: 'Quantidade',
    },
    {
        key: 'createdAt',
        label: 'Data',
    },
]
const state = computed(() => {
    if (movimentosCount.value) {
        return movimentosCount.value.find(
            (movimento) => movimento.id === Number(id)
        )
    }
})

const typeMovement = ref('')

const movimentoClick = (type: string) => {
    typeMovement.value = type
    isMovimentoOpen.value = true
}

const page = ref(1)
const pageCount = 3

const rows = computed(() => {
  return movimentosResponse.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

onMounted(async () => {
    await getMovimentosByProductId(id as string)
})
</script>
<template>
    <MyMovimentoModal :type="typeMovement" :produto="state ?? null" />
    <UCard>
        <div class="flex flex-col sm:flex-row justify-between">
            <h3 class="font-bold text-xl">Produto</h3>
            <div class="flex flex-col sm:flex-row gap-2">
                <UButton
                    :size="isMobile ? 'xs' : 'sm'"
                    icon="i-heroicons-arrow-left-20-solid"
                    label="Voltar"
                    color="gray"
                    @click="() => navigateTo('/')"
                />
                <UButton
                    :size="isMobile ? 'xs' : 'sm'"
                    icon="i-heroicons-arrow-down-20-solid"
                    label="Dar Entrada"
                    color="blue"
                    @click="movimentoClick('Entrada')"
                />
                <UButton
                    :size="isMobile ? 'xs' : 'sm'"
                    icon="i-heroicons-arrow-up-20-solid"
                    label="Dar Saída"
                    color="red"
                    @click="movimentoClick('Saida')"
                />
            </div>
        </div>

        <div class="flex gap-2 my-2">
            <span class="font-bold">Código:</span>
            <span>{{ state?.id }}</span>
        </div>
        <div class="flex gap-2 my-2">
            <span class="font-bold">Descrição:</span>
            <span class=" ">{{ state?.produto }}</span>
        </div>
        <div class="border border-gray-300 p-1 rounded-md">
            <h3 class="font-bold text-xl mt-2 ml-1">Grade</h3>

            <div class="flex gap-2 ml-1">
                <div
                    v-for="grade in state?.gradeQuantidade"
                    :key="grade.tamanho"
                    class="flex flex-col items-center"
                >
                    <span class="">
                        {{ grade.tamanho }}
                    </span>
                    <UDivider />
                    <span class="">{{ grade.quantidade }}</span>
                </div>
            </div>
        </div>

        <div class="p-1 border border-gray-300 my-1 rounded-md">
            <h3 class="font-bold text-xl mt-2 ml-4">Movimentos</h3>
            <UTable
                :loading="loading"
                :columns="columns"
                :rows="rows"
            >
                <template #createdAt-data="{ row }">
                    {{ new Date(row.createdAt).toLocaleDateString() }}
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageCount" :total="movimentosResponse.length" />
    </div>
        </div>
    </UCard>
</template>
