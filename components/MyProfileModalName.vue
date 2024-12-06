<script setup lang="ts">

import type { FormSubmitEvent } from '#ui/types'
import  { ProfileName } from '~/core/Profile';

interface Props {
    name: string
}
const {updateProfile} = useProfile()
const props = defineProps<Props>()

const isProfileOpen = useProfileNameOpen()
const state = ref({
    name: '',
})

async function onSubmit(event: FormSubmitEvent<ProfileName>) {
    await updateProfile('name', event.data)

}   

watchEffect(() => {


if (isProfileOpen.value && props.name ) {
   
    state.value.name = props.name

  
}



})
</script>
<template>
    <div>
        <UModal v-model="isProfileOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h1 class="text-2xl font-bold">Editar Nome</h1>
                    <h3 class="text-gray-500">Você fará logoff após alterar o seu nome</h3>
                </template>
                <UForm :schema="ProfileName" :state="state" class="space-y-4" @submit="onSubmit">
                    <UFormGroup label="Nome" name="name">
                        <UInput v-model="state.name" />
                    </UFormGroup>

                    <div class='flex gap-2 justify-between'>

                        <UButton label="Fechar" color="red" @click="() => isProfileOpen = false" />
                        <UButton label="Salvar" type='onSubmit' />
                    </div>
                </UForm>
            </UCard>
            </ UModal>
    </div>
</template>