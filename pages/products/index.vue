<script setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import MyProductModal from '~/components/MyProductModal.vue'
import { Image } from '~/core/Images'
import { Product } from '~/core/Product'
import { images, produtos } from '~/server/database/schema'


// definePageMeta({
//     middleware: "config"
// })

const { loading, products } = useProducts()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isProductOpen = useProductOpen()



const columns = [
     {
        key: 'descricao',
        label: 'Descrição'
    },
    {
        key: 'referencia',
        label: 'Referência'
    },
    {
        key: 'marca',
        label: 'Marca'
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
const image = ref<Image | null>(null)   
const selectedProduct = ref<Product>({
    id: 0,
    descricao: '',
    referencia: '',
    cor: '',
    marca: '',
    complemento: '',
    grade: '',
    tipo: '',
    modelo: '',
    image: {
        
        name: '',
        type: '',
        data: '',
    },
})

const cleanState = () => {
    selectedProduct.value = {
        id: 0,
        descricao: '',
        referencia: '',
        cor: '',
        marca: '',
        complemento: '',
        grade: '',
        tipo: '',
        modelo: '',
        image: {
            name: '',
            type: '',
            data: '',
        },
    }
}
function select(row: Product) {
    const findProduct = products.value.find((product) => product.id === row.id)

    selectedProduct.value = findProduct!
    isProductOpen.value = true

}
const filteredRows = computed(() => {

    if (!q.value) {
        return products.value.slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return products.value.filter((department) => {
        return Object.values(department).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const filteredRowsLength = computed(() => {

    if (!q.value) {
        return products.value.length
    }
    return products.value.filter((department) => {
        return Object.values(department).some((value) => {
            return String(value).toLowerCase().includes(q.value.toLowerCase())
        })
    }).length
})


const page = ref(1)
const pageCount = 5

function newProduct() {
    cleanState()
    isProductOpen.value = true
}



</script>
<template>
    <MyProductModal :product="selectedProduct" />

    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Produtos</h3>
            <div
                class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col gap-1 sm:flex-row">
                    <UInput v-model="q" placeholder="Produtos..." />

                </div>
                <div class="flex gap-1">
                    <UButton @click="newProduct">Novo</UButton>
                </div>
            </div>
            <UTable :loading="loading" :columns="selectedColumns" :rows="filteredRows"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }" @select="select" > 
                <template #descricao-data="{ row }">
                    <div class="flex items-center gap-2">
                        <img :src="row.image.data" alt="Product Image" class="w-7 h-7 object-cover rounded" v-if="row.image && row.image.data"/>
                        <div v-else class="w-7 h-7 bg-gray-200"></div>
                        <div>
                            <p class="">{{ row.descricao }}</p>
                        </div>
                    </div>
                    
                </template>
            </UTable>
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRowsLength" />
            </div>
        </UCard>
    </div>
</template>
