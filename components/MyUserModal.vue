<script setup lang="ts">

import {  User, UserRole } from '~/core/Users';

const isUserOpen = useUserOpen()

const {updateUser, createUser, loading} = useUsers()
const { departments, loadingDepartments} = useDepartments()
interface Props {
  user: User 
}

const props = defineProps<Props>()



const state = reactive<User>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: UserRole.USER,
    department: '',
    status: true,
    patrimony: false
})

const onSubmit = async () => {
  if(state?.id !== '') {
    await updateUser(props.user.id! ,state)
  } else {
    await createUser(state)

  }

 
  isUserOpen.value = false
}

const cleanStates = () => {
    state.id = ''
    state.name = ''
    state.email = ''
    state.password = ''
    state.role = UserRole.USER
    state.department = ''
    state.status = true
    state.patrimony = false
}


const closedModal = () => {

  
  isUserOpen.value = false
}

watchEffect(() => {


  if (isUserOpen.value && props.user.id === '') {
    cleanStates()
   } else {
    if (props && props.user) {
      state.id = props.user.id
      state.name = props.user.name
      state.email = props.user.email
      state.role = props.user.role
      state.department = props.user.department
      state.status = props.user.status
      state.patrimony = props.user.patrimony

    }
  }



})


</script>

<template>
  <div>

    <UModal v-model="isUserOpen">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <h1 class="text-2xl font-bold">{{state.id ? 'Editar Usuário' : 'Novo Usuário'}}</h1>
        </template>

        <UForm v-if="!loading && !loadingDepartments "  :schema="User" :state="state" class="space-y-4" @submit="onSubmit">

          <div class='flex gap-2 '>

            <UFormGroup label="Nome" name="name" class='w-full' required>
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Status" name="active" required>
              <UCheckbox v-model="state.status" class='top-1 left-3' />
            </UFormGroup>
          </div>

          <div class='flex gap-1 flex-1'>
            <UFormGroup label="Email" name="email" class='w-full'>
              <UInput v-model="state.email" />
            </UFormGroup>

            <UFormGroup label="Senha" name="password"  class='w-full'>
              <UInput type='password' v-model="state.password" />
            </UFormGroup>

          </div>
          <div class='flex gap-1'>
            <UFormGroup label="Perfil" name="role" class='w-full'>
                <USelect :options="['admin','user']" v-model="state.role"/>
            </UFormGroup>

            <UFormGroup label="Departamento" name="department" class='w-full'>
                <USelect :options="departments" v-model="state.department" value-attribute="id" option-attribute="name" />
            </UFormGroup>
          </div>

          <div class='flex gap-1'>
            <UFormGroup label="Patrimônio" name="patrimony" class='w-full'>
              <UCheckbox v-model="state.patrimony" class='top-1 left-3' />
            </UFormGroup>

          </div>




          <div class='flex gap-2 justify-between'>

            <UButton label="Fechar" color="red" @click="closedModal" />
            <UButton label="Salvar" type='onSubmit' />
          </div>

        </UForm>
        <div v-else class="flex flex-col gap-3 justify-center items-center h-64" >
          <h1 class='text-2xl'>Salvando Usuário...</h1>
          <UProgress />
        </div>
      </UCard>
    </UModal>
  </div>
</template>