<script setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { MovimentoCount } from '~/core/Movimento';

const { loading, movimentosCount } = useMovimentos()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')




const columns = [
    {
        key: 'produto',
        label: 'Produto'
    },
    {
        key: 'grade-quantidade',
        // label: 'Grade'
    },





]





const selectedColumns = ref([...columns])
watchEffect(() => {
    if (!isMobile.value) {

        selectedColumns.value = columns
    } else {
        selectedColumns.value = columns.slice(0, 1)
    }
})

const q = ref('')



function select(row: MovimentoCount) {
    const findMovimento = movimentosCount.value.find((movimento) => movimento.id === row.id)


    navigateTo(`/estoque/${findMovimento?.id}`)

}
const page = ref(1)
const pageCount = 5

const filteredRows = computed(() => {

    if (!q.value) {
        return movimentosCount.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return movimentosCount.value.filter((movimento) => {
        return Object.values(movimento).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})






</script>
<template>
   

    <UCard >


        <div
            class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <div class="flex flex-col gap-1 sm:flex-row">
                <UInput v-model="q" placeholder="Produtos..." />

            </div>
        </div>
        <UTable :loading="loading" :columns="selectedColumns" :rows="filteredRows"
            :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
            :progress="{ color: 'primary', animation: 'carousel' }" @select="select">

            <template #grade-quantidade-data="{ row }">
                <div class="flex gap-2  justify-center">
                    <div v-for="grade in row.gradeQuantidade" :key="grade.id" class="flex flex-col justify-center  items-center">
                        <span class="">

                            {{ grade.tamanho }}
                        </span>
                        <span class="">{{ grade.quantidade }}</span>
                    </div>

                </div>
            </template>
        </UTable>
        <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <UPagination v-model="page" :page-count="pageCount" :total="movimentosCount.length" />
        </div>

    </UCard>
</template>
