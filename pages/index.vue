<script setup lang="ts">
import HeaderMenu from '../components/HeaderMenu.vue'
onMounted(() => {
  document.title = 'Home'
})
</script>

<template>
  <div>
    <header>
      <HeaderMenu />
    </header>
    <div class="container mx-auto p-2">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Lorem.</h1>
      <p class="max-w-xl">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Excepturi quod cum sed nemo totam
        magnam sequi minima, ipsum, inventore reiciendis sapiente esse est quaerat, autem atque
        dolore. Dolores, earum consectetur.
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
