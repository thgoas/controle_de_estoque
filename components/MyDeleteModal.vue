<script async setup lang="ts">

const isOpen = useDeleteOpen()
interface Props {
  title: string
  description: string
  fn: (value: boolean) => void
}
const props = defineProps<Props>()
function handleClick () {
    isOpen.value = false
    props.fn(true)
}
</script>
<template>
    <UModal v-model="isOpen">

        <UCard>
            <template #header>
                <h1 class="text-2xl font-bold">{{props.title}} </h1>
            </template>

            <div class='flex flex-col gap-2 mb-4'>
                <p>{{ props.description }}</p>
            </div>
            <div class='flex gap-2 justify-between'>

                <UButton label="Não" color="red" @click="isOpen = false" />

                <UButton label="Sim" @click="handleClick" />
            </div>
        </UCard>
    </UModal>
</template>
