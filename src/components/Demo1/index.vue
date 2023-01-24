<template>
  <div class="buttons">
    <button @click="startFireworks">随机发射</button>
    <button @click="lauchFireworks">点击发射</button>
    <button @click="stopFireworks">停止发射</button>

  </div>
  <Fireworks ref="fw" :autostart="false" :options="options" :style="{
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'fixed',
    background: '#000'
  }" />
</template>

<script lang="ts" setup>
import { Fireworks } from '@fireworks-js/vue'
import type { FireworksOptions } from '@fireworks-js/vue'
import { reactive, ref } from 'vue'

const fw = ref<InstanceType<typeof Fireworks>>()
const options = reactive<FireworksOptions>({
  opacity: 0.5
})

async function startFireworks() {
  if (!fw.value) return
  fw.value.start()
}

async function lauchFireworks() {
  if (!fw.value) return
  fw.value.launch(1)
}

async function stopFireworks() {
  if (!fw.value) return
  fw.value.waitStop()
}



</script>

<style scoped>
body {
  background-color: #000;
}

.buttons {
  z-index: 1;
  position: absolute;
  display: flex;
  gap: 4px;
}
</style>
