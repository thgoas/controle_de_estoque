<script setup lang="ts">
// const toast = useToast()

// onMounted(() => {
//   toast.add({
//     id: 'update_downloaded',
//     title: 'Update downloaded.',
//     description: 'It will be installed on restart. Restart now?',
//     icon: 'i-octicon-desktop-download-24',
//     timeout: 0,
//     actions: [{
//       label: 'Restart',
//       click: () => {

//       }
//     }]
//   })
// })
</script>

<template>
    <UNotification
      icon="i-heroicons-check-circle"
      description="This is a notification."
      :id="3"
      :timeout="0"
      title="Notification"
    />
  </template>
