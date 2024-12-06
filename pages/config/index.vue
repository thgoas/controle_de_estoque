<script setup lang="ts">
definePageMeta({
    middleware: "config"
})

const configList = [
    {
        label: 'Usuários',
        to: '/config/user',
        icon: 'i-heroicons-users'
    },
    {
        label: 'Departamentos',
        to: '/config/departments',
        icon: 'i-heroicons-clipboard-document-list'
    }
]
 
</script>
<template>
    <div>
        <h1>Configurações</h1>

        
            <div class=" flex flex-col lg:flex-row gap-2 w-full content-center justify-center">

                <UCard v-for="config in configList" :key="config.label" class="flex-1 cursor-pointer" @click="navigateTo(config.to)" >
                    <div class="flex gap-2 justify-center content-center">
                        
                        <UIcon :name="config.icon" class="w-5 h-5" />
                        {{ config.label }}
                    </div>
                </UCard>
            </div>

        
    </div>
</template>
