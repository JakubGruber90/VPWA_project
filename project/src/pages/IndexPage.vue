<template>
  <q-page>
   
      <q-infinite-scroll reverse class="scroll" ref="infScroll">

        <template v-slot:loading>  
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <q-chat-message v-for="(message, index) in messageList" :key="index"
          :text="[message.text]"
          :sent=false
          class="chat-message-text">
          <template v-slot:name>{{getNicknameByUserId(message.sender)}}</template>
          <template v-slot:stamp>{{message.created_at}}</template>
          <template v-slot:avatar>
            <div style="position: relative;">
              <img class="q-message-avatar q-message-avatar" src="~src/assets/anon.jpg">
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
import {format} from 'date-fns';
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
      userChannel: [],
      messageList: [],
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

    this.socket.on('invite', (data: any) => {
      console.log(data)
    })
  },

  methods: {
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

      console.log('DEBUGGGGGG\n');
      console.log(this.messageList); //DEBUG
    },

    addNewline(event: any) {
      if (event.key === 'Enter' && event.shiftKey) {
        this.messageText += '\n';
      }
    },

    getNicknameByUserId(userId: number): string | undefined {
      const user = this.userData.find((user) => user.id === userId);

      return user ? user.nickname: `User ${userId}`;
    },

    /*onLoad (index: any, done: any) { //@load="onLoad" :offset="0" -> odobrane z infinity scroll
      
    },*/
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