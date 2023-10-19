<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
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
      class="bg-secondary"
      v-model="leftDrawerOpen"
    >
      <div class="channel" v-for="(channel, index) in channels" :key="index">
          {{ channel.name }}
          <q-icon name="keyboard_arrow_right" class="exit-icon" @click="openExitModal(channel)" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="exitModalOpen" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
          <span class="q-ml-sm">You are currently not connected to any network.</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Yes" color="negative" @click="leaveChannel" />
          <q-btn flat label="No" @click="closeExitModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      channels: [
        { name: 'Channel 1' },
        { name: 'Channel 2' },
        { name: 'Channel 3' },
        { name: 'Channel 4' },
      ],
      exitModalOpen: false,
      currentChannel: null as { name: string } | null,
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    openExitModal(channel: { name: string }) {
      this.currentChannel = channel;
      this.exitModalOpen = true;
    },
    closeExitModal() {
      this.exitModalOpen = false;
      this.currentChannel = null;
    },
    leaveChannel() {
      //tu bude volanie na be vymazanie z db
      this.closeExitModal();
    },
  }
});
</script>

<style scoped>
.channel {
  display: flex; 
  justify-content: space-between;  
  align-items: center;
  font-size: large;
  padding: 11px;
  color: white;
}

.channel:hover {
  background-color: #2c5a51;
}
</style>