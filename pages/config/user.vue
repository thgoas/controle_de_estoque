<script setup lang='ts'>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { User,  UserRole, type UserResponse } from '~/core/Users';
definePageMeta({
    middleware: "config"
})
const { users, loading } = useUsers()
const { departments } = useDepartments()
const { smallerOrEqual } = useBreakpoints(breakpointsTailwind)
const isMobile = smallerOrEqual('md')
const isUserOpen = useUserOpen()



const columns = [
    {
        key: 'name',
        label: 'Nome'
    },
    {
        key: 'email',
        label: 'Email'
    },
    {
        key: 'role',
        label: 'Perfil'
    },
    {
        key: 'department',
        label: 'Departamento'
    },
    {
        key: 'status',
        label: 'Status'
    },
    {
        key: 'createdAt',
        label: 'Criado'
    },
    {
        key: 'updatedAt',
        label: 'Atualizado'
    }
    

]


const mapUser = (user: UserResponse) => {
    return {
        ...user,
        status: user.status ? 'Ativo' : 'Inativo',
        department: departments.value.find((dep) => dep.id === user.department)?.name,
        createdAt: dateConvert(user.createdAt),
        updatedAt: dateConvert(user.updatedAt)
    }
}

const selectedColumns = ref([...columns])
watchEffect(() => {
    if (!isMobile.value) {

        selectedColumns.value = columns
    } else {
        selectedColumns.value = columns.slice(0, 1)
    }
})

const q = ref('')

const selectedUser = ref<User>({
    id: '',
    name: '',
    email: '',
    password: '',
    role: UserRole.USER,
    department: '',
    status: true,
    patrimony: false
})

const cleanSelectedUser = () => {
    selectedUser.value = {
        id: '',
        name: '',
        email: '',
        password: '',
        role: UserRole.USER,
        department: '',
        status: true,
        patrimony: false
    }
}
function select(row: User) {
    const findUser = users.value.find((user) => user.id === row.id)

    selectedUser.value = findUser!
    isUserOpen.value = true

}
const filteredRows = computed(() => {

    if (!q.value) {
        return users.value.map((person: UserResponse) => mapUser(person)).slice((page.value - 1) * pageCount, (page.value) * pageCount)
    }
    return users.value.map((person: UserResponse) => (mapUser(person)))
        .filter((person) => {
            return Object.values(person).some((value) => {
                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const filteredRowsLength = computed(() => {

    if (!q.value) {
        return users.value.map((person: UserResponse) => mapUser(person)).length
    }
    return users.value.map((person: UserResponse) => (mapUser(person)))
        .filter((person) => {
            return Object.values(person).some((value) => {
                return String(value).toLowerCase().includes(q.value.toLowerCase())
            })
        }).length
})


const page = ref(1)
const pageCount = 5

function newUser() {
    cleanSelectedUser() 
    isUserOpen.value = true
}



</script>
<template>
    <MyUserModal :user="selectedUser" />

    <div>
        <UCard>
            <h3 class='px-3 text-2xl font-bold'>Usuários</h3>
            <div
                class="flex flex-col sm:flex-row justify-between gap-2 px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
                <div class="flex flex-col gap-1 sm:flex-row">
                    <UInput v-model="q" placeholder="Usuário..." />

                </div>
                <div class="flex gap-1">
                    <UButton @click="newUser">Novo</UButton>
                </div>
            </div>
            <UTable :loading="loading" :columns="selectedColumns" :rows="filteredRows"
                :loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Loading...' }"
                :progress="{ color: 'primary', animation: 'carousel' }" @select="select" />
            <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
                <UPagination v-model="page" :page-count="pageCount" :total="filteredRowsLength" />
            </div>
        </UCard>
    </div>
</template>
