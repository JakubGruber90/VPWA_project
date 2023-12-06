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

        <q-toolbar-title >
          {{ currentChannel ? `${currentChannel.name}` : '' }}
        </q-toolbar-title>
        <div class="" style="position: relative;">
          <span>{{ userNick }}</span>
          <q-btn
          size="20px"
            flat
            round
            color="white"
            icon="account_circle"   
            @click="toggleProfileDropdown"
          />
          <q-badge rounded :color="status === 'dnd' ? 'red' : (status === 'online' ? 'light-green-14' : 'grey')" style="position: absolute; top: 25%; right: 0px;"/>

          <div v-if="showProfileDropdown && !showStateDropdown" class="custom-profile-dropdown status-modal" @click="toggleProfileDropdown">
            <q-list class="">
              <q-item clickable @click="toggleStateDropdown" class="text-weight-medium profileDropdownBtn">State</q-item>
              <q-item clickable @click="logout" class="text-weight-medium profileDropdownBtn">Logout</q-item>
              <hr>
              <q-toggle  @click="toggleNotifChange" v-model="notifsOff" label="Notifications" left-label class="text-weight-medium profileDropdownBtn" checked-icon="check" unchecked-icon="clear"/>
            </q-list>
          </div>
          <div v-if="showStateDropdown" class="custom-profile-dropdown  status-modal" @click="toggleStateDropdown">
            <q-list>
              <q-item clickable @click="statusChange('online')"  class="text-weight-medium" >Online<q-badge rounded color="light-green-14" style="position: absolute;top: 25%; right: 0px;" /></q-item>
              <q-item clickable @click="statusChange('dnd')" class="text-weight-medium" >Do not disturb<q-badge rounded color="red" style="position: absolute;top: 25%; right: 0px;" /></q-item>
              <q-item clickable @click="statusChange('offline')" class="text-weight-medium" >Offline<q-badge rounded color="grey" style="position: absolute;top: 25%; right: 0px;" /></q-item>
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
      <router-view :socket="socket" />
    </q-page-container>

    <q-dialog v-model="exitModalOpen" persistent ref="leaveChannelModal">
      <q-card>
        <q-card-section class="row items-center">
         <span class="q-ml-sm">Are you sure you want to leave the channel?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Leave" color="negative" />
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
import { defineComponent, provide } from 'vue';
import { useQuasar } from 'quasar'
import { supabase } from 'app/config/supabase';
import axios from "axios";
import {initializeSocket, getSocket} from '../services/wsService';
import { data } from 'autoprefixer';
import { watch } from 'vue'


export default defineComponent({
  name: 'MainLayout',
  components: {
  
  },

  beforeRouteUpdate(to, from, next) {
    const newChannelId = to.params.id;
    this.channels = []

    next();
  },

  mounted() {


    const user_id = supabase.auth.session().user.id
    const user_name = supabase.auth.session().user.user_metadata.nickname
    this.userNick = user_name;
    const auth_token = supabase.auth.session()?.access_token


    axios.get('http://localhost:3333/users/personalNotification', { 
        headers: { Authorization: `Bearer ${auth_token}`,}})
      .then((response) => {
        if(response.data.personal_notification == 0){
          this.notifsOff = false
        }
        else{
          this.notifsOff = true

        }
      })
      .catch((error) => {
        console.error(error);
      });
    
      
    initializeSocket(user_id, user_name);

    this.socket = getSocket();
    
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });
    
    this.socket.on('create-channel', (channel) => {
      this.channels = [channel, ...this.channels];
    });

    this.socket.on('join-channel', (channel) => {
      this.channels = [channel, ...this.channels];
    });

    this.socket.on('leave-channel', (data) => {
      if (typeof data === 'string') {
        alert(data);
      } else {
        this.channels = this.channels.filter((channel:any) => data != channel.id);
        this.closeExitModal();
        this.$router.push({ path: '/channels' });
      }
    });

    this.socket.on('revoke', (data) => {
      if (typeof data === 'string') {
        alert(data);
      } else {
        this.channels = this.channels.filter((channel:any) => data != channel.id);
        this.closeExitModal();
        this.$router.push({ path: '/channels' });
      }
    })

    this.socket.on('message', (data) => {
      console.log('Received a message:', data);
    });

    this.socket.on("notification-send", (notification,username) => {
      if(this.notifsOff && !notification.text.includes(supabase.auth.session().user.user_metadata.nickname && this.status !== 'dnd')) {
        return
      }
      if (Notification.permission === 'granted') {
      new Notification(username, { body: notification.text.length > 20 ?  notification.text.slice(0,20) + "..." : notification.text });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(username, { body: notification.text.length > 20 ?  notification.text.slice(0,20) + "..." : notification.text });
        }
      });
    }

    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('invite', (data) => {
      if (typeof data === 'string') {
        alert(data);
      } else {
        this.channels = [data, ...this.channels];
      }
    });

    
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
      currentChannel: '',
      userNick: '',
      socket: Object
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
  
  created() {
    this.fetchData(); 
  },
  updated() {
    this.fetchData();
  },
  methods: {

    statusChange(status: string) {
      const user_id = supabase.auth.session().user.id;
      this.status = status;
      this.socket.emit('change-status', { id: user_id, status: status });
    },

    fetchData() {
      const auth_token = supabase.auth.session()?.access_token
      
      axios.get('http://localhost:3333/channels', { 
        headers: { Authorization: `Bearer ${auth_token}`,}})
      .then((response) => {
        this.channels = response.data.channels;
        this.currentChannel = this.channels.find((channel) => channel.id === Number(this.$route.params.id));
      })
      .catch((error) => {
        console.error(error);
      });
    },

    toggleNotifChange(){
      const auth_token = supabase.auth.session()?.access_token  
      const customHeaders = {'Authorization': 'Bearer ' + auth_token}
      axios.patch('http://localhost:3333/users/personalNotification',{state: this.notifsOff},{headers: customHeaders}).then(response => {
        console.log("ok")
      })
      .catch(error => (
        this.notifsOff = !this.notifsOff
      )); 
      
    },

    leaveRequest() {

      const channel_id = this.$route.params.id
      this.socket.emit('leave', {channel_id: channel_id});

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
      const index = this.channels.findIndex((channel) => channel.id=== this.id);

      const filteredChannels = this.channels.filter((channel) => channel.id === this.channelToLeaveId);


       if (index !== -1) {
        this.channels.splice(index, 1);
        this.closeExitModal();
        this.channelToLeaveName = '';
      } 
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

      this.socket.emit('create', {name: this.newChannel.name, isPrivate: this.newChannel.isPrivate})


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
        const user_id = supabase.auth.session().user.id;
        this.socket.emit('change-status', { id: user_id, status: 'offline' });

        const {error} = await supabase.auth.signOut();
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