<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>

<style>
body::-webkit-scrollbar {
  width: 10px; 
}

body::-webkit-scrollbar-track {
  border-radius: 10px;
  background: transparent;
}

body::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #807e7e; 
}
</style>