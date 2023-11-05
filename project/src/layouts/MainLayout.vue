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
          <q-badge rounded :color="status == 'offline' ? 'red' : 'light-green-14'" style="position: absolute; top: 25%; right: 0px;"/>

          <div v-if="showProfileDropdown && !showStateDropdown" class="custom-profile-dropdown status-modal" @click="toggleProfileDropdown">
            <q-list class="">
              <q-item clickable @click="toggleStateDropdown" class="text-weight-medium profileDropdownBtn">State</q-item>
              <q-item clickable @click="logout" class="text-weight-medium profileDropdownBtn">Logout</q-item>
              <hr>
              <q-toggle v-model="notifsOff" label="Notifications" left-label class="text-weight-medium profileDropdownBtn" checked-icon="check" unchecked-icon="clear"/>
            </q-list>
          </div>
          <div v-if="showStateDropdown" class="custom-profile-dropdown  status-modal" @click="toggleStateDropdown">
            <q-list>
              <q-item clickable @click="status = 'online'"  class="text-weight-medium" >Active <q-badge rounded color="light-green-14" style="position: absolute;top: 25%; right: 0px;" /></q-item>
              <q-item clickable @click="status = 'offline'" class="text-weight-medium" >Busy<q-badge rounded color="red" style="position: absolute;top: 25%; right: 0px;" /></q-item>
            </q-list>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-secondary"
      v-model="leftDrawerOpen"
    >
      <div class="create-channel-conatiner">
        <q-btn
          color="white"
          class="create-channel-btn"
          flat
          icon="add"
          label="Add channel"
          @click="openCreateChannelModal"
        />
      </div>  
      <div class="channel-section">
        <div class="separator-line"></div>
        <div class="section-title">Public Channels</div>
        <div class="separator-line"></div>
        <div class="channel" v-for="(channel, index) in publicChannels" :key="index"  @click="() => navigateToChannel(channel.id)">
          <div class="channel-text">
            {{ channel.name }}
            <q-badge v-if="channel.name === 'Channel 2'" rounded color="red" label="3" class="badge-absolute"/>
          </div> 
          <q-icon name="exit_to_app" class="exit-icon" @click="openExitModal(channel.id)" />     
        </div>
      </div>
      <div class="channel-section">
        <div class="separator-line"></div>
        <div class="section-title">Private Channels</div>
        <div class="separator-line"></div>
        <div class="channel" v-for="(channel, index) in privateChannels" :key="index" @click="() => navigateToChannel(channel.id)">
          <div class="channel-text">
            {{ channel.name }}
            <q-badge v-if="channel.name === 'Channel 1'" rounded color="red" label="NEW" class="badge-absolute"/>
          </div> 
          <q-icon name="exit_to_app" class="exit-icon" @click="openExitModal(channel.id)" />     
        </div>
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
          <q-btn flat label="Leave" color="negative" @click="leaveRequest" />
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
import { useQuasar } from 'quasar'
import { supabase } from 'app/config/supabase';

export default defineComponent({
  name: 'MainLayout',

  components: {
    
  },

  setup () {
            const $q = useQuasar()

            return {
                showNotif (errorMessage: string) {
                    $q.notify({
                        timeout: 1500,
                        message: errorMessage, 
                        color: 'negative',
                        multiLine: true,
                        type: 'negative',
                        actions: [
                            { label: 'understand', color: 'yellow', handler: () => { /* ... */ } }
                        ]
                    })
                }
            }
        },

  data() {
    return {
      notifsOff: false,
      leftDrawerOpen: false,
      channels: [],
      exitModalOpen: false,
      createChannelModalOpen: false,
      newChannel: {
        name: '',
        isPrivate: false
      },
      showProfileDropdown: false,
      showStateDropdown: false,
      status: "online",
      channelToLeaveId: -1,
    }
  },

  computed: {
    publicChannels() {
      return this.channels.filter((channel:any) => channel.type == "public");
    },
    privateChannels() {
      return this.channels.filter((channel:any) => channel.type == "private");
    },
  },
  mounted() {
    this.fetchData(); 
  },
  methods: {
    fetchData() {
      fetch('http://localhost:3333')
        .then((response) => {
          response.json().then((data) => {
            this.channels = data;
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
    leaveRequest() {

      const requestData  = {
      id: 1
    };
  fetch('http://localhost:3333/channels/:id', {
    method: 'DELETE',
    body: JSON.stringify(requestData),
    headers: {
    'Content-Type': 'application/json',
  },
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json(); 
      } else {
        throw new Error('Failed to leave channel');
      }
    })
    .then((data) => {
      this.channels = data;
    })
    .catch((err) => {
      console.error(err);
    })
    },

    toggleLeftDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },

    openExitModal(id: number) {
      this.channelToLeaveId = id;
      this.exitModalOpen = true;
    },

    closeExitModal() {
      this.exitModalOpen = false;
    },

    leaveChannel() {
      //const index = this.channels.findIndex((channel) => channel.id=== this.id);

      //const filteredChannels = this.channels.filter((channel) => channel.id === this.channelToLeaveId);


     /*  if (index !== -1) {
        this.channels.splice(index, 1);
        this.closeExitModal();
        this.channelToLeaveName = '';
      } */
    },

    openCreateChannelModal() {
      this.createChannelModalOpen = true;
    },

    createChannel() {
      if (this.newChannel.name.length < 1) {
        this.showNotif('Channel name is required');
        return;
      } 

      if (this.newChannel.name.length > 20) {
        this.showNotif("Surname can have a maximum of 20 characters!");
        return;
      }

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
    async logout() {
      if(this.showProfileDropdown){
        console.log(await supabase.auth.session())
        const {error} = await supabase.auth.signOut();
        console.log(await supabase.auth.session())
        if(error){
          console.log(error)
        }
        else{
          this.$router.push({ name: 'loginPage' });
        }
      }
    },
    navigateToChannel(channelId: number){
      this.$router.push({ name: 'channelPage', params: { id: channelId } });
    }
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

  .create-channel-container, .section-title {
    display: flex; 
    justify-content: center;  
    align-items: center;
    font-size: large;
    padding: 11px;
    color: white;
  }

  .create-channel-btn {
    color: white; 
    background-color: #2c5a51;
    width: 100%;
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
  left: -65px;
  right: 0;
  width: 140px;
}

.section-title {
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
}

.separator-line {
  border-top: 1px solid white;
}

.profileDropdownBtn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

</style>