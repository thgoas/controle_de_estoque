<script setup lang="ts">

const props = defineProps({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },})
</script>
<template>
    <div class="flex gap-1 items-center">
        <UAvatar :alt="props?.name" size="sm" />
        <span class="text-gray-600">{{ props?.email }}</span>
    </div>
</template>
