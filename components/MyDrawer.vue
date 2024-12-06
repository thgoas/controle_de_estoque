<script setup >
const isDrawerOpen = useDrawerOpen()
const {user} = useLogin()
</script>

<template>
  <div>


    <USlideover v-model="isDrawerOpen" side="left">
      <UCard
        class="flex flex-col flex-1"
        :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <UButton
            color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
            class="flex sm:hidden absolute end-5 top-5 z-10" square padded @click="isDrawerOpen = false" />

          <MyAvatar :name="user.name" :email="user.email" />
        </template>

        <MyMenuMobile />

        <template #footer>
          <UVerticalNavigation :links="[ 
            {
                to: '/profile/user',
                label: 'Perfil',
                icon: 'i-heroicons-user-circle-20-solid',
            },
            {
            to: '/auth/logout',
            label: 'Sair',
            icon: 'i-heroicons-arrow-right-on-rectangle-20-solid',
        },
        ]" @click="isDrawerOpen = false" />
        </template>
      </UCard>
    </USlideover>
  </div>
</template>