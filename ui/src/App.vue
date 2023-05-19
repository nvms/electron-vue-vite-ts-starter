<script setup lang="ts">
import { ipcRenderer } from "electron";
import UiButton from "package/components/button";
import { useCounterStore } from "./store/counter";

const counterStore = useCounterStore();

window.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  ipcRenderer.send("show-context-menu", { x: e.x, y: e.y });
});
</script>

<template>
  <div id="app" class="flex justify-center items-center h-screen text-white">
    <div>
      <div class="flex flex-col justify-center items-center">
        <p class="text-4xl font-bold mb-6">{{ counterStore.count }}</p>
        <div class="flex justify-center items-center">
          <UiButton v-tooltip="{ content: 'Increment' }" @click="counterStore.increment()" class="text-2xl mx-2">+</UiButton>
          <UiButton v-tooltip="{ content: 'Decrement' }" @click="counterStore.decrement()" class="text-2xl mx-2">-</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body {
  @apply bg-gray-800 text-white;
}
</style>
