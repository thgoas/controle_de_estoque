<script async setup lang="ts">
definePageMeta({
    middleware: "patrimony"
})

    const patrimoniosList = [
        {
            label: 'Patrimônios',
            to: '/patrimonios/patrimonios',
            icon: 'i-heroicons-home'
        },
    {
        label: 'Lojas',
        to: '/patrimonios/lojas',
        icon: 'i-heroicons-building-storefront'
    },
    {
        label: 'Setores',
        to: '/patrimonios/setores',
        icon: 'i-heroicons-paper-clip'
    },
    {
        label: 'Fornecedores',
        to: '/patrimonios/fornecedores',
        icon: 'i-heroicons-building-office'
    },
    {
        label: 'Ativos',
        to: '/patrimonios/ativos',
        icon: 'i-heroicons-home' 
    },
    {
        label: 'Classificações',
        to: '/patrimonios/classificacao-ativos',    
        icon: 'i-heroicons-home' 
    },
    {
        label: 'Ativos Subgrupos',
        to: '/patrimonios/subgrupo-ativos',
        icon: 'i-heroicons-home' 
    },
    {
        label: 'Ativos tipo',
        to: '/patrimonios/tipo-ativos',
        icon: 'i-heroicons-home' 
    },
    {
        label: 'Status',
        to: '/patrimonios/Status',
        icon: 'i-heroicons-check-circle' 
    }




]
</script>
<template>
        <div>
        <h1 class="mb-4">Configurações</h1>

        
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">

                <UCard v-for="patrimonio in patrimoniosList" :key="patrimonio.label" class=" cursor-pointer" @click="navigateTo(patrimonio.to)" >
                    <div class="flex gap-2 justify-center content-center">
                        
                        <UIcon :name="patrimonio.icon" class="w-5 h-5" />
                        {{ patrimonio.label }}
                    </div>
                </UCard>
            </div>

        
    </div>
</template>

