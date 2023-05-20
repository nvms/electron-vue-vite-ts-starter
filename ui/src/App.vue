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
  <div id="app" class="h-screen w-screen bg-gray-800 text-white">
    <div class="titlebar w-screen absolute top-0 bg-gray-900 flex flex-nowrap whitespace-nowrap overflow-hidden">
      <div class="ml-24 flex items-center">
        electron vue ts starter
      </div>
    </div>
    <div class="flex justify-center items-center h-screen text-white">
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
  </div>
</template>

<style lang="scss">
.titlebar {
  height: 38px;
  user-select: none;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.titlebar-button {
  -webkit-app-region: no-drag;
}
</style>
