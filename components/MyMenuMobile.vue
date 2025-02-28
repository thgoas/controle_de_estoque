<script setup lang="ts">
const {routesList: lists  } = useMyRoutes()
const isDrawerOpen = useDrawerOpen()
</script>
<template>
    <UVerticalNavigation :links="lists" @click="isDrawerOpen = false" />
</template>
