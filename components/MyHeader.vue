<script setup lang="ts">

const title = ref('Estoque Minimalista')
const isDrawerOpen = useDrawerOpen()


function titleHome () {
  navigateTo('/')
}


</script>

<template>
  <header class="bg-white bg-opacity-5 backdrop-blur-lg  p-2 fixed top-0 w-full shadow-md z-10">
    <nav class="container mx-auto flex justify-between items-center">
      <div class="flex gap-2 items-center cursor-pointer" @click="titleHome">
        <img src="~/public/Estoque_minimalista.jpg" alt="Estoque Minimalista" class="w-10 h-10">
        <span class="text-2xl font-bold text-primary " >{{ title }}</span>

      </div>
      <div class="flex gap-4 items-center">
        <button class="lg:hidden text-black" @click="isDrawerOpen = true">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>

        </button>
        <MyMenuList />
        <MyDropdown />
          

      </div>
    </nav>
  </header>
</template>