<template>
  <div class="h-screen relative">
    <Title>WebGL</Title>

    <NuxtLink to="/" class="absolute top-4 left-4 z-10 px-3 py-1 bg-cyan-400 rounded-full hover:bg-cyan-600 text-white">
      Home</NuxtLink>
    <div class="flex h-full">
      <div class="relative m-auto" v-show="loaded">
        <canvas tabindex="0" class="outline-none relative z-0 top-0 left-0" ref="c" width="1024" height="768"
          @keydown.capture="app!.handleKeydown" @mousemove.capture="app!.handleMousemove"
          @mousedown="app!.handleMousedown" @mouseup="app!.handleMouseup" @keyup.capture="app!.handleKeyup"></canvas>
        <canvas class="absolute z-10 top-0 left-0" width="400" height="100" ref="hud"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { App } from '../utils/draw'
import type { RenderingContext } from '../utils/util'
// import vshader from 'public/vshader.vert?raw'
// import fshader from 'public/fshader.frag?raw'
const c = ref<HTMLCanvasElement | null>(null)
const hud = ref<HTMLCanvasElement | null>(null)
let time = 0.0
let animationHandle: number | null = null
let gl: RenderingContext | null = null
let app: App | null = null
let ctx: CanvasRenderingContext2D | null = null
const loaded = ref(false)
function main() {
  const cur = performance.now() / 1000
  const dt = cur - time
  time = cur
  ctx!.fillStyle = 'white'
  ctx!.clearRect(0, 0, 400, 100)
  ctx!.font = '50px serif'
  ctx!.fillText(`FPS: ${Math.round(1 / dt)}`, 50, 90)
  app!.draw(dt)
  animationHandle = requestAnimationFrame(main)
}
onMounted(async () => {
  gl = c.value!.getContext('webgl')!
  ctx = hud.value!.getContext('2d')!
  const { default: v } = await import('../assets/vshader.vert?raw')
  const { default: f } = await import('../assets/fshader.frag?raw')
  app = new App(gl, v, f)
  // initShaders(gl, v, f)
  time = performance.now() / 1000
  loaded.value = true
  main()
})

onUnmounted(() => {
  if (animationHandle) {
    cancelAnimationFrame(animationHandle)
  }
})
</script>
