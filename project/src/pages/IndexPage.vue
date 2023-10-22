<template>
  <q-page>
    <q-infinite-scroll reverse @load="onLoad" :offset="0" class="scroll" ref="infScroll">

        <template v-slot:loading>  
        <div class="row justify-center q-my-md">
          <q-spinner-dots color="primary" size="40px" />
        </div>
      </template>

      <q-chat-message v-for="(message, index) in messageList" :key="index"
        :name="message.name"
        :avatar="message.avatar"
        :text="message.text"
        :sent="message.sent"
        :stamp="message.stamp"
        class="chat-message-text"/>
      <div><UsersTyping popup-text="I am typing all sorts of stuff hopefully you dont see it because I'm calling you ugly words" user-name="Lisa"/><UsersTyping popup-text="HihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiHihiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii" user-name="Johny"/><q-spinner-dots color="gray" size="17px"/></div>
    </q-infinite-scroll>
    
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
import { Component, defineComponent } from 'vue';
import UsersTyping from '../components/UsersTyping.vue'
import { QInfiniteScroll } from 'quasar';

export default defineComponent({
  name: 'IndexPage',
  components: { UsersTyping }, //UsersTyping
  data () {
    return {
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

  methods: {
    sendMessage (event: any) {
      var newMessageText = this.messageText;

      if (newMessageText === '' || event.shiftKey) {
        return;
      }

      this.messageList.push({name: "Lisa", avatar: "https://cdn.quasar.dev/img/avatar2.jpg", text: [newMessageText], sent: false, stamp: "now"});
      this.messageText = '';

      this.$nextTick(() => {
        (this.$refs.infScroll as QInfiniteScroll).setIndex(0);
      });
    },

    addNewline(event: KeyboardEvent) {
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