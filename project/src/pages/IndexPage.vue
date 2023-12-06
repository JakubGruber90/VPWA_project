<template>
  <q-page>
   
      <q-infinite-scroll ref="infScroll" :scroll-target="$refs.infScroll" :key="$route.params.id" :initial-index="0" reverse class="scroll" @load="onLoad" :offset="35">

        <template v-slot:loading>  
          <div v-if="!endOfDB" class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <q-chat-message v-for="(message, index) in messageList" :key="index"
          :text="[message.text]"
          :sent=false
          class="chat-message-text"
          :bgColor="isMentioned(message.text) ? 'orange' : 'green'">
          <template v-slot:name>{{message.sender}}</template>
          <template v-slot:stamp>{{message.created_at}}</template>
          <template v-slot:avatar>
            <div style="position: relative;">
              <img class="q-message-avatar q-message-avatar" src="~src/assets/anon.jpg">
              <q-badge
                rounded
                :color="message.badgeColor"
                style="position: absolute; top: 0px; right: 0px;"
              />
            </div>
          </template>
        </q-chat-message>

      <div><UsersTyping/><q-spinner-dots color="gray" size="17px"/></div>

    </q-infinite-scroll>

    
    <q-dialog v-model="showUserListModal" persistent>
      <q-card>
        <q-card-section>
          <q-card-title>User list</q-card-title>
        </q-card-section>

        <q-card-section>
          <q-list bordered separator>
            <q-item v-for="(user, index) in userData" :key="index">
              <q-item-section>{{user}}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat color="primary" label="Close" v-on:click="closeUserListModal"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    
    <q-footer>
      <div v-if="showSuggestions" class="channel-suggestions">
        <ul>
          <li v-for="(channel, index) in channelSuggestions" :key="index" @click="selectSuggestion(channel)">
            {{ "a" }}
          </li>
        </ul>
      </div>
      <q-form v-on:submit="sendMessage" class="full-width input">
        <q-input 
        v-model="messageText" 
        class="full-width q-pa-md custom-scrollbar"
        style="max-height: 200px; overflow-y: auto;"
        bg-color="white" 
        text-color="black" 
        rounded outlined autogrow
        placeholder="Message #channel_name"
        type="text"
        @keydown.enter.prevent="sendMessage"
        @keydown.shift="addNewline"/>
        <q-btn class="q-mr-md" round flat icon="send" type="submit"/>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script lang="ts">
import { Component, defineComponent, inject, resolveDirective } from 'vue';
import { supabase } from 'app/config/supabase';
import UsersTyping from '../components/UsersTyping.vue'
import { QInfiniteScroll } from 'quasar';
import {initializeSocket, getSocket} from '../services/wsService';
import { Socket } from 'socket.io-client';
import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'
import { data } from 'autoprefixer';
import axios from 'axios';

export default defineComponent({
  name: 'IndexPage',
  components: { UsersTyping },

  setup(){
  const $q = useQuasar()
            let isAppVis = ref(true);

            watch(() => $q.appVisible, val => {
              isAppVis.value = val;
            })
        return{
          isAppVis
        }
      },
  data () {
    return {
      showSuggestions: false,
      channelSuggestions: [],
      notifications: [],
      showUserListModal: false,
      userData: [],
      messageText: '',
      isLoading: false,
      userChannel: [],
      messageList: [],
      userTyping: new Map(),
      endOfDB: false,
      Socket: Object,
    }
  },

  watch: {
    messageText() {
      const channel_id = this.$route.params.id;
      if (this.messageText === '/join') {
        this.socket.emit('suggestChannels');
        this.updateSuggestions();
      }

      this.socket?.emit('chatTyping', { message: this.messageText, channel_id: channel_id });
    },
  },

  beforeRouteUpdate(to, from, next) {
    const newChannelId = to.params.id;
    const auth_token = supabase.auth.session()?.access_token;
    this.endOfDB = false;

    axios.get(`http://localhost:3333/channels/initial_messages/${newChannelId}`,
      {headers: { Authorization: `Bearer ${auth_token}`}}).then((response) => {
        const initialMessages = response.data;
        this.messageList = [...initialMessages];
    }).catch((error) => {
      console.error(error);
    });

    next();
  },

  //toto mozno opravit lebo zas inicializujem socket

  mounted() {

    const user_id = supabase.auth.session().user.id;
    const user_name = supabase.auth.session().user.user_metadata.nickname;
    const channel_id = this.$route.params.id;
    const auth_token = supabase.auth.session()?.access_token;

    initializeSocket(user_id, user_name);

    this.socket = getSocket();
   
    this.socket.on('join-channel', (data: any) => {
      if (typeof data === 'string') {
        alert(data);
      } else {
        this.$router.push({ name: 'channelPage', params: { id: data.id } });
      }
    });

    this.socket.on('user-list', (data: any) => {
      console.log(data)

      if(data.length > 0) {
        this.userData = data.flatMap(innerArray => innerArray.map(obj => obj.nickname));
        this.showUserListModal = true;
      }
    });

    this.socket.on('invite', (data: any) => {
      console.log(data)
    })

    this.socket.on('add-new-message', (data) => {
        if(!this.isAppVis){
          const channel_id = this.$route.params.id;
          this.socket?.emit('notification', {channel_id: channel_id, sender: data.message.sender, message: data.message.text});
        }
        
        var color; 
        if(data.status === 'online') {
          color = 'light-green-14';
        } else if(data.status === 'dnd') {
          color = 'red';
        } else {
          color = 'grey';
        }

        data.message.badgeColor = color;
        this.messageList = [...this.messageList, data.message]
    });

    this.socket.on('suggestChannels', (data: any) => {
      this.channelSuggestions = data;
      this.showSuggestions = true;
    });

    this.socket.on('chatTyping', (message:any, user:any) => {
      this.userTyping.set(user, message);
      console.log(this.userTyping);
      const keysArray = Array.from(this.userTyping.keys());

      console.log(keysArray);
    });

    this.socket.on('update-status', (data)=> { 
      this.messageList.forEach(message =>{
        if(message.sender === data.user) {
          var color;
          if(data.status === 'online') {
            color = 'light-green-14';
          } else if(data.status === 'dnd') {
            color = 'red';
          } else {
            color = 'grey';
          }

          message.badgeColor = color;
        }
      })

      if(data.status === 'online' && data.oldStatus === 'offline') {
        axios.get(`http://localhost:3333/channels/initial_messages/${channel_id}`,
        {headers: { Authorization: `Bearer ${auth_token}`}}).then((response) => {
        const initialMessages = response.data;
        this.messageList = [...initialMessages];
        }).catch((error) => {
          console.error(error);
        });
      }
    });

    axios.get(`http://localhost:3333/channels/initial_messages/${channel_id}`,
      {headers: { Authorization: `Bearer ${auth_token}`}}).then((response) => {
        const initialMessages = response.data;
        this.messageList = [...initialMessages];
    }).catch((error) => {
      console.error(error);
    });

    this.socket?.emit('change-status', { id: user_id, status: 'online' });
  },

  methods: {
    isMentioned(message_text) {
      const current_user_name = supabase.auth.session().user.user_metadata.nickname;
      const mentionPattern = new RegExp(`@${current_user_name}\\b`, 'i');
      return mentionPattern.test(message_text);
    },


    selectSuggestion(suggestion: string) {
        this.messageText = `/join ${suggestion}`;
        this.showSuggestions = false; // Hide suggestions after selection
    },
  
    updateSuggestions() {
      if (this.messageText.startsWith('/join')) {
        const query = this.messageText.substring(6).trim().toLowerCase();
        this.channelSuggestions = this.channelSuggestions
          .filter((channel: any) => channel.toLowerCase().includes(query));
        this.showSuggestions = true;
      } else {
        this.showSuggestions = false;
      }
    },

    closeUserListModal() {
      this.showUserListModal = false;
    },

    sendMessage (event: any) {
      let newMessageText = this.messageText;

      if (newMessageText.trim() === '' || event.shiftKey) {
        return;
      }

      const channel_id = this.$route.params.id;
      this.socket?.emit('message', {channel_id: channel_id, message: this.messageText});
  
      this.messageText = '';
    },

    addNewline(event: any) {
      if (event.key === 'Enter' && event.shiftKey) {
        this.messageText += '\n';
      }
    },

    async onLoad(index: number, done: () => void) {
      try {
        const auth_token = supabase.auth.session()?.access_token
        const limit = 20;
        const start = index * limit;
        const channel_id = this.$route.params.id;

        await new Promise(resolve => setTimeout(resolve, 500)); //delay, aby bolo vidno loading

        axios.get(`http://localhost:3333/channels/older_messages?channel_id=${channel_id}&start=${start}&limit=${limit}`,
        {headers: { Authorization: `Bearer ${auth_token}`}}).then((response) => {
        
          const olderMessages = response.data;
          
          if(!this.endOfDB) {
            console.log('Loading older messages\n');
            console.log(this.endOfDB);
            this.messageList = [...olderMessages, ...this.messageList];
            if(olderMessages.length < limit) {
              this.endOfDB = true;
              console.log('No more messages in database');
              console.log(this.endOfDB);
              return;
            }
          }

        });

        done();
      } catch (error) {
        console.error('Error in onLoad: ', error);
        done();
      }
    },
  }
}); 
</script>

<style scoped>
.input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.scroll {
  padding: 10px;
  height: 79.1vh;
  overflow-y: auto;
}

.chat-message-text {
  white-space: pre-wrap;
}

.channel-suggestions {
  max-height: 100px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  background-color: #fff;
}
.channel-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.channel-suggestions li {
  cursor: pointer;
  padding: 5px;
  border-bottom: 1px solid #eee;
}
</style>