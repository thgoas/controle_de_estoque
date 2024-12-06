<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import  { Profile, ProfilePassword } from '~/core/Profile';

const {updateProfile} = useProfile()
const isProfileOpen = useProfilePasswordOpen()
const state = reactive({
    password: undefined,
    confirmePassword: undefined
})

async function onSubmit(event: FormSubmitEvent<Profile>) {
    await updateProfile('password', event.data)
}   

</script>
<template>
    <div>
        <UModal v-model="isProfileOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <h1 class="text-2xl font-bold">Editar Perfil</h1>
                    <h3 class="text-gray-500">Você fará logoff após alterar o seu nome</h3>
                </template>
                <UForm :schema="ProfilePassword" :state="state" class="space-y-4" @submit="onSubmit">
                   <UFormGroup label="Senha" name="password">
                        <UInput v-model="state.password" type="password" />
                    </UFormGroup>

                    <UFormGroup label="Confirmar senha" name="confirmePassword">
                        <UInput v-model="state.confirmePassword" type="password" />
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