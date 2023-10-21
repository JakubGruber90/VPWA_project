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
  display: none;
}

::-webkit-scrollbar {
  width: 10px;
  padding-right: 20px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px; 
  background: #b2aaaa;
}
</style>