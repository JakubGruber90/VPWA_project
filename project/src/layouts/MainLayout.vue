<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <div class="channel-text">
          <q-btn
          flat
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-badge rounded color="red" label="3" class="badge-absolute-main"/>
      </div>

        <q-toolbar-title>
          #Channel Name
        </q-toolbar-title>
        <div class="" style="position: relative;">
          <q-btn
          size="20px"
            flat
            round
            color="white"
            icon="account_circle"   
            @click="toggleProfileDropdown"          
          />
          <q-badge rounded color="light-green-14" style="position: absolute;top: 10%; left: 0px;" />

          <div v-if="showProfileDropdown && !showStateDropdown" class="custom-profile-dropdown status-modal" @click="toggleProfileDropdown">
            <q-list class="">
              <q-item clickable @click="toggleStateDropdown" class="text-weight-medium">State</q-item>
              <q-item clickable @click="logout" class="text-weight-medium">Logout</q-item>
            </q-list>
          </div>
          <div v-if="showStateDropdown" class="custom-profile-dropdown  status-modal" @click="toggleStateDropdown">
            <q-list>
              <q-item clickable @click="navigateToProfile"  class="text-weight-medium" >Active <q-badge rounded color="light-green-14" style="position: absolute;top: 25%; right: 0px;" /></q-item>
              <q-item clickable @click="logout" class="text-weight-medium" >Busy<q-badge rounded color="red" style="position: absolute;top: 25%; right: 0px;" /></q-item>
            </q-list>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-secondary"
      v-model="leftDrawerOpen"
    >
      <div class="create-channel-btn">
        <q-btn
          flat
          icon="add"
          label="Add channel"
          @click="openCreateChannelModal"
        />
      </div>
      <div class="channel " v-for="(channel, index) in channels" :key="index">
        <div class="channel-text">
          {{ channel.name }}
          <q-badge v-if="channel.name === 'Channel 1'" rounded color="red" label="NEW" class="badge-absolute"/>
          <q-badge v-if="channel.name === 'Channel 2'" rounded color="red" label="3" class="badge-absolute"/>
        </div> 
        <q-icon name="exit_to_app" class="exit-icon" @click="openExitModal(index)" />     
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="exitModalOpen" persistent ref="leaveChannelModal">
      <q-card>
        <q-card-section class="row items-center">
         <span class="q-ml-sm">Are you sure you want to leave the channel?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Leave" color="negative" @click="leaveChannel" />
          <q-btn flat label="Cancel" @click="closeExitModal" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="createChannelModalOpen" persistent>
      <q-card>
        <q-card-section>
          <q-input
            v-model="newChannel.name"
            label="Channel Name"
            @keyup.enter="createChannel"
            @keyup.escape="closeCreateChannelModal"
          />
          <q-toggle
            v-model="newChannel.isPrivate"
            label="Is Private"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Create" color="positive" @click="createChannel" />
          <q-btn flat label="Cancel" @click="closeCreateChannelModal" />
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
      createChannelModalOpen: false,
      newChannel: {
        name: '',
        isPrivate: false
      },
      showProfileDropdown: false,
      showStateDropdown: false,
      channelToLeaveIndex: -1
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },

    openExitModal(index: number) {
      this.channelToLeaveIndex = index;
      this.exitModalOpen = true;
    },

    closeExitModal() {
      this.exitModalOpen = false;
    },

    leaveChannel() {
      if (this.channelToLeaveIndex !== -1) {
        this.channels.splice(this.channelToLeaveIndex, 1);
        this.closeExitModal();
        this.channelToLeaveIndex = -1;
      }
    },

    openCreateChannelModal() {
      this.createChannelModalOpen = true;
    },

    createChannel() {
      const newChannelInstance = { ...this.newChannel };

      this.channels.push(newChannelInstance);

      this.newChannel.name = '';
      this.newChannel.isPrivate = false;

      this.closeCreateChannelModal();
    },

    closeCreateChannelModal() {
      this.createChannelModalOpen = false;
    },
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },

    toggleStateDropdown() {
      this.showStateDropdown = !this.showStateDropdown;
    },
    navigateToProfile() {
      //
    },
    logout() {
      if(this.showProfileDropdown){
        this.$router.push({ name: 'loginPage' });
      }
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

  .create-channel-btn {
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

.badge-absolute {
  position: absolute;
  top: -10px;
  right: 30;
}

.badge-absolute-main {
  position: absolute;
  top: 0;
  right: 0;
}

.channel-text {
  position: relative;
  display: inline-block;
}

.status-modal{
  position: absolute;
  background-color: #2c5a51;
  left: -10px;
  right: 0;
  width: 82px;
}

</style>