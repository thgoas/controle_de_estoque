<script setup lang="ts">

import {Department } from '~/core/Department';

const isDepartmentOpen = useDepartmentOpen()

const {  updateDepartment, createDepartment, loadingDepartments} = useDepartments()
interface Props {
  department: Department 
}

const props = defineProps<Props>()



const state = reactive<Department>({
  name: '',
  id: '',
})

const onSubmit = async () => {
  if(state?.id !== '') {
    await updateDepartment(props.department.id! ,state)
  } else {
    await createDepartment(state)

  }

  isDepartmentOpen.value = false
  cleanStates()
}

const cleanStates = () => {
  state.id = ''
  state.name = ''
}

watchEffect(() => {


  if (isDepartmentOpen.value && props.department.id === '') {
    cleanStates()
    if (props && props.department) {
      state.id = props.department.id
      state.name = props.department.name

    }
  }
})

</script>

<template>
  <div>

    <UModal v-model="isDepartmentOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{state.id ? 'Editar Departamento' : 'Novo Departamento'}}</h1>
        </template>

        <UForm v-if="!loadingDepartments && !loadingDepartments "  :schema="Department" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex gap-2 '>

            <UFormGroup label="Nome" name="name" class='w-full' required>
              <UInput v-model="state.name" />
            </UFormGroup>

           
          </div>
          
          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="() => isDepartmentOpen = false" />
            <UButton label="Salvar" type='onSubmit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64" >
          <h1 class='text-2xl'>Salvando Departamento...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>