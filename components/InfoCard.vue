<template>
  <div
    class="shadow-xl transition-all hover:shadow-3xl hover:scale-105 m-2 rounded-lg max-w-sm bg-slate-50"
  >
    <div>
      <slot name="header">
        {{ props.title }}
      </slot>
    </div>
    <div class="border-gray-400 border-t-2 border-opacity-40">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: false
  }
})
</script>
