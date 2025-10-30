<script setup lang="ts">
import { is } from 'drizzle-orm'
import type { Image } from '~/core/Images'
import { Product } from '~/core/Product'

const isProductOpen = useProductOpen()
const isDeleteOpen = useDeleteOpen()

const { updateProduct, createProduct, loading, deleteProduct } = useProducts()
// const { uploadImage } = useImages()
const { addToast } = useMyToast()
import { IconToast, ToastType } from '~/core/Toast'
interface Props {
    product: Product
}

const props = defineProps<Props>()

const image = ref<Image | null>(null)
const fileInputRef = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

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
    image.value = null
    imagePreview.value = null
    fileInput.value = null
}

const convertToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
    })
}

const onSubmit = async () => {

    let imageObject: Image
    if (fileInputRef.value) {
        const fileBase64 = await convertToBase64(fileInputRef.value)
        imageObject = {
            data: fileBase64 as string,
            name: fileInputRef.value.name,
            type: fileInputRef.value.type,
            product_id: state.id,
        }
    } else {
        imageObject = {
            data: image.value?.data,
            name: image.value?.name,
            type: image.value?.type,
            product_id: state.id,
        }
    }

    const newState = {
        ...state,
        image: imageObject,
    }
  

    

    if (state?.id !== 0) {
        await updateProduct(props.product.id!, newState)
    } else {
        await createProduct(newState)
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
            if (props.product.image && props.product.image.id) {
                image.value = props.product.image
                imagePreview.value = props.product.image.data ?? null
            } else {
                image.value = null
                imagePreview.value = null
            }
         
            // delete props.product.image
            state = {
                id: props.product.id,
                descricao: props.product.descricao,
                referencia: props.product.referencia,
                cor: props.product.cor,
                marca: props.product.marca,
                complemento: props.product.complemento,
                grade: props.product.grade,
                tipo: props.product.tipo,
                modelo: props.product.modelo,
            }
        }
    
    }
})

const addTamanho = (value: string) => {
    if (state.grade === '') {
        state.grade = value
    } else {
        state.grade = state.grade + ',' + value
    }
    tamanho.value = ''
}

const triggerFileInput = () => {
    fileInput?.value?.click()
}

const onFileChange = (event: any) => {
    const file = event.target.files[0]

    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            addToast({
                type: ToastType.Error,
                title: 'Error',
                description: 'A imagem deve ter menos de 10MB',
                icon: IconToast.Error,
            })

            return
        }
        if (!['image/png', 'image/jpeg'].includes(file.type)) {
            addToast({
                type: ToastType.Error,
                title: 'Error',
                description: 'Apenas imagens PNG ou JPEG são permitidas',
                icon: IconToast.Error,
            })

            return
        }
        fileInputRef.value = file

        // Criar uma URL de pré-visualização
        imagePreview.value = URL.createObjectURL(file)
    }
}
const handleDeleteProduct = async () => {
    if (state.id && state.id !== 0) {
        await deleteProduct(state.id)
        isProductOpen.value = false
    }
}

const handleDeleteModal = () => {
    isDeleteOpen.value = true
}

</script>

<template>
    <MyDeleteModal title="Deletar Produto" :description="state.descricao" :fn="handleDeleteProduct" />
    <div>
        <UModal v-model="isProductOpen">
            <UCard :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }">
                <template #header>
                    <h1 class="text-2xl font-bold">
                        {{ state?.id ? 'Editar Produto' : 'Novo Produto' }}
                    </h1>
                </template>

                <UForm v-if="!loading" :schema="Product" :state="state" class="space-y-4" @submit="onSubmit">
                    <div class="flex flex-col gap-2">
                        <div class="flex justify-center items-center -mt-4">
                            <div class="w-32 h-32 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex justify-center items-center"
                                @click="triggerFileInput">
                                <p v-if="!imagePreview" class="text-gray-500 text-balance text-center">
                                    Adicione uma imagem
                                </p>
                                <img v-if="imagePreview" :src="imagePreview" alt="Product Image"
                                    class="w-full h-full object-cover rounded-lg" />
                                <input type="file" accept="image/*" ref="fileInput" @change="onFileChange"
                                    class="hidden" />
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <UFormGroup label="Tipo de Produto" name="tipo" class="w-full" required>
                                <UInput placeholder="Ex: Camisa, Calção, etc..." v-model="state.tipo"
                                    @keyup="state.descricao = state.tipo" />
                            </UFormGroup>

                            <UFormGroup label="Marca" name="marca" class="w-full" required>
                                <UInput placeholder="Ex: Nike, Adidas, etc..." v-model="state.marca" @keyup="
                                    state.descricao =
                                    state.tipo + ' ' + state.marca
                                    " />
                            </UFormGroup>
                        </div>

                        <div class="flex gap-2">
                            <UFormGroup label="Referência" name="referencia" class="w-full" required>
                                <UInput placeholder="Ex: AS334554, SX22334, etc..." v-model="state.referencia" @keyup="
                                    state.descricao =
                                    state.tipo +
                                    ' ' +
                                    state.marca +
                                    ' ' +
                                    state.referencia
                                    " />
                            </UFormGroup>

                            <UFormGroup label="Cor" name="cor" class="w-full" required>
                                <UInput placeholder="Ex: Azul, Vermelho, etc..." v-model="state.cor" @keyup="
                                    state.descricao =
                                    state.tipo +
                                    ' ' +
                                    state.marca +
                                    ' ' +
                                    state.referencia +
                                    ' ' +
                                    state.cor
                                    " />
                            </UFormGroup>

                            <UFormGroup label="Modelo" name="modelo" class="w-full" required>
                                <UInput placeholder="Ex: AS334554, SX22334, etc..." v-model="state.modelo" @keyup="
                                    state.descricao =
                                    state.tipo +
                                    ' ' +
                                    state.marca +
                                    ' ' +
                                    state.referencia +
                                    ' ' +
                                    state.cor +
                                    ' ' +
                                    state.modelo
                                    " />
                            </UFormGroup>
                        </div>

                        <UFormGroup label="Descrição" name="descricao" class="w-full" required>
                            <UInput v-model="state.descricao" />
                        </UFormGroup>

                        <div class="flex gap-2">
                            <UFormGroup label="Tamanhos" name="tamanhos" class="w-full">
                                <div class="flex gap-2">
                                    <UInput placeholder="Ex: P, M, G, 34, TU" v-model="tamanho" @keyup="
                                        tamanho = tamanho
                                            .toUpperCase()
                                            .split(',')
                                            .join('.')
                                        " />
                                    <UButton icon="i-heroicons-plus-circle-20-solid" @click="addTamanho(tamanho)" />
                                </div>
                            </UFormGroup>
                            <UFormGroup label="Grade tamanhos" name="grade" class="w-full">
                                <UInput v-model="state.grade" disabled />
                            </UFormGroup>
                        </div>

                        <UFormGroup label="Complemento" name="complemento" class="w-full">
                            <UTextarea v-model="state.complemento!" />
                        </UFormGroup>
                    </div>

                    <div class="flex gap-2 justify-between">
                        <div class="flex gap-2">   
                            <UButton label="Fechar" color="red" @click="closed"  />
                            <UButton label="Deletar" color="yellow" @click="handleDeleteModal" v-if="state.id != 0"/>

                        </div>
                        <UButton label="Salvar" type="onSubmit" />
                    </div>
                </UForm>
                <div v-else class="flex flex-col gap-3 justify-center items-center h-64">
                    <h1 class="text-2xl">Salvando Produto...</h1>
                    <UProgress />
                </div>
            </UCard>
        </UModal>
    </div>
</template>
