<template>
  <span v-if="filteredUserTyping.length > 0">
    <a class="user">
      <q-popup-proxy anchor="bottom right" self="top right">
        <q-list class="typingUserList">
          <q-item clickable v-for="(user, index) in filteredUserTyping" :key="index" @click="openMessageDialog(user)">
            <a>
              <q-avatar :name="user.user" class="q-mb-sm">
              <!--  <img :src="user.avatar" /> -->
              </q-avatar>
              {{ user.user }}
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
import { defineComponent, PropType } from 'vue';
import { supabase } from 'app/config/supabase';

interface UserTypingData {
  user: string;
  channel: string;
  message: string;
}

export default defineComponent({
  name: 'UsersTyping',

  props: {
    userTyping: {
      type: Array as PropType<UserTypingData[]>,
      default: () => [],
    },
  },

  watch: {
    userTyping: {
      handler(newVal, oldVal) {
        if (newVal && newVal.length > 0) {
          const changedIndex = newVal.findIndex(
            (newUser:any, index:any) =>
              oldVal &&
              oldVal.length > index &&
              (newUser.user !== oldVal[index].user ||
                newUser.message !== oldVal[index].message)
          );

          if (changedIndex !== -1) {
            const changedUser = newVal[changedIndex];
            this.userMessage = changedUser.message;
            this.userName = changedUser.user;
          }
        }
      },
      deep: true,
    },
  },

  computed: {
    filteredUserTyping(): UserTypingData[] {
      let user;
      const authSession = supabase.auth.session();
      if (authSession?.user) {
        user = authSession.user.user_metadata.nickname;
      }
      const currentUser = user;
      return this.userTyping.filter(user => user.user !== currentUser);
    },
  },

  data () {
    return {
      messageDialogeOpened: false,
      userMessage: '',
      userName: '',
    }
  },

  methods: {
    openMessageDialog(user: UserTypingData) {
      this.userMessage = user.message;
      this.userName = user.user;
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