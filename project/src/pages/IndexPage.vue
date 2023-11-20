<template>
  <q-page>
    <q-infinite-scroll reverse @load="onLoad" :offset="0" class="scroll" ref="infScroll">

        <template v-slot:loading>  
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <q-chat-message v-for="(message, index) in messageList" :key="index"
        :text="message.text"
        :sent="message.sent"
        class="chat-message-text"
      >
        <template v-slot:name>{{message.name}}</template>
        <template v-slot:stamp>{{message.stamp}}</template>
        <template v-slot:avatar>
          <div style="position: relative;">
            <img
              class="q-message-avatar q-message-avatar--sent"
              :src="message.avatar"
            >
            <q-badge
              rounded
              :color="'light-green-14'"
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
import { Component, defineComponent, inject } from 'vue';
import { supabase } from 'app/config/supabase';
import UsersTyping from '../components/UsersTyping.vue'
import { QInfiniteScroll } from 'quasar';
import {initializeSocket, getSocket} from '../services/wsService';
import { Socket } from 'socket.io-client';
import { data } from 'autoprefixer';

export default defineComponent({
  name: 'IndexPage',
  components: { UsersTyping },

  props: {
    
  },

  data () {
    return {
      socket: Object,
      showUserListModal: false,
      userData: [],
      messageText: '',
      isLoading: false,
      messageList: [
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["hey, how are you?"], sent: true, stamp: "7 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},

        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Would be interested in going out for dinner?"], sent: true, stamp: "6 minutes ago"},
      ],
    }
  },

  //toto mozno opravit lebo zas inicializujem socket
  mounted() {
    const user_id = supabase.auth.session().user.id
    const user_name = supabase.auth.session().user.user_metadata.nickname

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
  },

  methods: {
    closeUserListModal() {
      this.showUserListModal = false;
    },

    sendMessage (event: any) {
      let newMessageText = this.messageText;
      console.log(newMessageText)

      /* 
      if (newMessageText.trim() === '' || event.shiftKey) {
        return;
      }

      
      this.messageList.push({name: "Lisa", avatar: "https://cdn.quasar.dev/img/avatar2.jpg", text: [newMessageText], sent: false, stamp: "now"}); */
      
      const messageData = {
      name: "Lisa",
      channel: "Helou",
      text: newMessageText,
      stamp: "now",
    };


    const channel_id = this.$route.params.id;
    
    this.socket?.emit('message', {channel_id: channel_id, message: this.messageText})

   /*  fetch('http://localhost:3333/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData), 
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); 
        } else {
          throw new Error('Request failed');
        }
      })
      .then((data) => {
        console.log('Response from server:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      }); */

    this.messageText = '';
    },

    addNewline(event: any) {
      if (event.key === 'Enter' && event.shiftKey) {
        this.messageText += '\n';
      }
    },

    onLoad (index: any, done: any) { 
      setTimeout(() => {
        this.messageList.unshift(...[{name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["The trip last year was great, we should go again!!"], sent: true, stamp: "two weeks ago"},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", text: ["Maybe next year?"], sent: true, stamp: "two weeks ago"},])

        done()
      }, 2000);
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
</style>