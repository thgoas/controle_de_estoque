<script setup lang="ts">
const { user, logout } = useLogin()

const items = [
  [{
    label: 'Perfil',
    icon: 'i-heroicons-user-circle-20-solid',
    click: () => {
        navigateTo('/profile/user')
    }
  }], [{
    label: 'Sair',
    icon: 'i-heroicons-arrow-right-on-rectangle-20-solid',
    // shortcuts: ['S'],
    click: () => {
        logout()
    }
  }]
]
</script>

<template>
    <div class="hidden lg:block">

        <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">

            <MyAvatar :name="user?.name ??''" :email="user?.email ?? ''" />
        </UDropdown>
    </div>
</template>

