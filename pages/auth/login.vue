<script setup lang="ts">
definePageMeta({
    layout: 'auth',
})
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const {login, loading} = useLogin()

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Must be at least 8 characters'),
})

type Schema = z.output<typeof schema>

const state = reactive({
    email: undefined,
    password: undefined,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    await login(event.data)

}
</script>

<template>
    <div class="flex justify-center items-center h-screen">

    
    <UCard class='max-w-md w-full mx-auto '>
        <template #header>
            <div class="flex gap-2 justify-between ">
                <img src="~/public/Estoque_minimalista.gif" alt="Estoque Minimalista" class="w-32 h-32">
                <div class="flex flex-col flex-1 gap-1 justify-center">
                    <h1 class="text-3xl font-bold text-center p-2">Login</h1>
                   

                </div>

            </div>
        </template>

        <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
        >
            <UFormGroup label="Email" name="email">
                <UInput v-model="state.email" />
            </UFormGroup>

            <UFormGroup label="Password" name="password">
                <UInput v-model="state.password" type="password" />
            </UFormGroup>
            <div class="flex w-full justify-center">
                <UButton
                    :loading="loading"
                    block
                    label="Entrar"
                    type="submit"
                    class="w-20 text-center"
                />
            </div>
        </UForm>
    </UCard>
</div>
</template>
