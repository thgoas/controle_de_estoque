<script setup lang="ts">

</script>
<template>
  <div class="min-h-screen flex flex-col">
    <MyHeader />

    <MyDrawer />

    <main class=" mt-14 mb-10 flex-1 p-4">
      <slot />
    </main>

    <MyFooter />
  </div>
</template>