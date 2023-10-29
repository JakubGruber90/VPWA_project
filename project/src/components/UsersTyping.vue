<template>
  <span>
    <a class="user">
      <q-popup-proxy anchor="bottom right" self="top right">
        <q-list class="typingUserList">
          <q-item clickable v-for="(user, index) in users" :key="index" @click="openMessageDialog(user)">
            <a>
              <q-avatar :name="user.name" :avatar="user.avatar" class="q-mb-sm">
                <img :src="user.avatar" />
              </q-avatar>
              {{ user.name }}
            </a>
          </q-item>
        </q-list>
      </q-popup-proxy>Users</a> are typing  
    </span>
  
    <q-dialog seamless v-if="messageDialogeOpened" v-model="messageDialogeOpened">  
      <q-card>
        <q-btn rounded flat color="primary" icon="close" @click="closeMessageDialog" />
        <q-card-section class="user-message">
          {{ userName }}'s Message:<br> 
          {{ userMessage }}
        </q-card-section>
      </q-card>
    </q-dialog>
</template>


<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UsersTyping',

  data () {
    return {
      messageDialogeOpened: false,
      userMessage: '',
      userName: '',

      users: [
        {name: "Lisa", avatar: "https://cdn.quasar.dev/img/avatar2.jpg", message: "Typing something, I want to see what it does."},
        {name: "Andrew", avatar: "https://cdn.quasar.dev/img/avatar4.jpg", message: "You SEE what I TYPE? That's pretty creepy. I think I'll uninstall this app"},
        {name: "Brad", avatar: "https://cdn.quasar.dev/img/avatar1.jpg", message: "Boink"},
        {name: "Stacy", avatar: "https://cdn.quasar.dev/img/avatar3.jpg", message: "We should go camping sometime soon. I'm so bored you would ot believe."},

        {name: "Stacy", avatar: "https://cdn.quasar.dev/img/avatar3.jpg", message: "We should go camping sometime soon. I'm so bored you would ot believe."},
        {name: "Stacy", avatar: "https://cdn.quasar.dev/img/avatar3.jpg", message: "We should go camping sometime soon. I'm so bored you would ot believe."},
        {name: "Stacy", avatar: "https://cdn.quasar.dev/img/avatar3.jpg", message: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},
      ],
    }
  },

  methods: {
    openMessageDialog(user: {name: string, avatar: string, message: string}) {
      this.userMessage = user.message;
      this.userName = user.name;
      this.messageDialogeOpened = true;
    },

    closeMessageDialog() {
      this.messageDialogeOpened = false;
    },
  },
})
</script>
 
<style scoped>  
span {
  color: gray;
  font-style: oblique;
  font-size: 15px;
}

.user {
  color: #429a8a;
  font-weight: 600;
}

.user:hover {
  color: #35524c;
}

.typingUserList {
  max-height: 250px;
  width: 180px;
  max-width: 200px;
  overflow: auto;
  padding: 10px;
  word-wrap: break-word;
}

.user-message {
  max-height: 200px;
  max-width: 150x;
  overflow: auto;
  padding: 10px;
  word-wrap: break-word;
}
</style>