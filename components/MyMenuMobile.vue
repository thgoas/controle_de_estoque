<script setup lang="ts">
const lists = routesList()
const isDrawerOpen = useDrawerOpen()
</script>
<template>
    <UVerticalNavigation :links="lists" @click="isDrawerOpen = false" />
</template>
