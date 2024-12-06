<script setup lang="ts">
import useMyRoutes from '~/composables/useMyRoutes';

const {routesList: links} = useMyRoutes()

</script>
<template>
  <div class="hidden lg:block">

    <UHorizontalNavigation :links="links">
      <template #default="{ link }">
        <span class="group-hover:text-primary relative">{{ link.label }}</span>
      </template>
    </UHorizontalNavigation>
  </div>
  </template>