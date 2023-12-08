<template>
  <nav class="flex md:flex-row flex-col justify-end container mx-auto">
    <div class="md:hidden flex flex-col group relative">
      <button class="flex justify-end md:p-4 p-2" @click="menuOpen = !menuOpen" ref="menuRef">
        <XMarkIcon class="h-8 w-8" v-if="menuOpen" />
        <Bars3Icon class="h-8 w-8" v-else />
      </button>
      <div
        :class="
          menuOpen
            ? 'flex flex-col [transform-origin:50%_0%] [transform:rotateX(0deg)] transition-all'
            : ' flex flex-col [transform-origin:50%_0%] [transform:rotateX(90deg)] h-0 transition-all'
        "
      >
        <NuxtLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="p-2 text-center"
          active-class="bg-gray-200"
        >
          {{ item.name }}
        </NuxtLink>
      </div>
    </div>
    <RouterLink
      v-for="item in menuItems"
      :key="item.name"
      :to="item.path"
      class="hidden md:block p-4 text-center"
      active-class="bg-gray-200"
    >
      {{ item.name }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { XMarkIcon, Bars3Icon, HomeIcon, CameraIcon } from '@heroicons/vue/24/solid'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const menuItems = [
  { name: 'Home', path: '/', },
  { name: 'Graphic', path: '/graphic' }
]

let menuOpen = ref(false)
let menuRef = ref<HTMLButtonElement>()
let menuStyle = ref('[transform-origin:50%_0%] [transform:rotateX(90deg)] transition-all')
</script>

<style scoped></style>
