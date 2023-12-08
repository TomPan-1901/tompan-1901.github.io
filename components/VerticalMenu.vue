<template>
  <ul class="flex flex-col first-letter:uppercase first-letter:text-xl first-letter:font-bold">
    <li v-for="item in items" :key="item.name" class="mb-4">
      <RouterLink
        :to="item.path"
        class="flex items-center text-gray-500 hover:text-gray-900"
      >
        <!-- <item.icon class="w-6 h-6 mr-2" /> -->
        <span>{{ item.name }}</span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
// import { HomeIcon, GraphicIcon } from '@heroicons/vue/outline'
import { RouterLink } from 'vue-router'
const items = [
  { name: 'Home', path: '/'},
  { name: 'Graphic', path: '/graphic' }
]


</script>