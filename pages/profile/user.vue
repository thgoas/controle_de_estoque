<script setup lang="ts">
const { user, loading } = useLogin()
const isProfileNameOpen = useProfileNameOpen()
const isProfilePasswordOpen = useProfilePasswordOpen()
const {departments} = useDepartments()

function getDepartment () {
    if (user?.value?.department) {
        return departments.value.find((d) => d.id === user?.value?.department)
    }
}
</script>
<template>

    <MyProfileModalName :name="user?.name!"/>
    <MyProfileModalPassword/>
    <UCard>
        <div v-if="loading" class="flex flex-col gap-2">
            <USkeleton class="h-4 w-[250px]" />
            <USkeleton class="h-4 w-[200px]" />
            <USkeleton class="h-4 w-[230px]" />
            <USkeleton class="h-10 w-20" />
        </div>

        <div v-else class="flex flex-col gap-2">
            <div class="flex gap-2">
                <span> Nome: {{ user?.name }} </span>
                <UButton 
                    icon="i-heroicons-pencil-square-20-solid"
                    size="2xs"
                    square
                    variant="solid"
                    @click='isProfileNameOpen = true'
                />

            </div>
            <span> Email: {{ user?.email }} </span>
            <span> Departamento: {{getDepartment()?.name }} </span>
            <div class="flex gap-2">
                <UButton label="Nova senha" @click='isProfilePasswordOpen = true' />
            </div>
        </div>
    </UCard>
</template>
