<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          #Channel name
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
    class="bg-primary"
      v-model="leftDrawerOpen"
    >
    <div class="channel">Channel 1</div>
    <div class="channel">Channel 2</div>
    <div class="channel">Channel 3</div>
    <div class="channel">Channel 4</div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    
  },

  data() {
    return {
      leftDrawerOpen: false,
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
});
</script>

<style scoped>
.channel {
  font-size: large;
  padding: 11px;
}

.channel:hover {
  background-color: #3d9181;
}
</style>