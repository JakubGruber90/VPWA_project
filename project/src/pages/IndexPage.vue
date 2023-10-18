<template>
  <q-page>
    <div>
      <q-infinite-scroll reverse class="scroll">
        <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['hey, how are you?']"
        sent
        stamp="7 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['doing fine, how r you?']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['Wanna go to a cinema on sunday?']"
        sent
        stamp="7 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Sure that would be great']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['Nice see well talk over the details tomorrow']"
        sent
        stamp="7 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Ok']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Sure that would be great']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['Nice see well talk over the details tomorrow']"
        sent
        stamp="7 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Ok']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Sure that would be great']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['Nice see well talk over the details tomorrow']"
        sent
        stamp="7 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Ok']"
        stamp="4 minutes ago"
      /><q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Sure that would be great']"
        stamp="4 minutes ago"
      />
      <q-chat-message
        name="me"
        avatar="https://cdn.quasar.dev/img/avatar4.jpg"
        :text="['Nice see well talk over the details tomorrow']"
        sent
        stamp="7 minutes ago"
      />
      <q-chat-message
        name="Jane"
        avatar="https://cdn.quasar.dev/img/avatar3.jpg"
        :text="['Ok']"
        stamp="4 minutes ago"
      />
      </q-infinite-scroll>
    </div>
    

    <q-footer class="full-width input">
      <q-input 
      class="full-width q-pa-md custom-scrollbar"
      style="max-height: 200px; overflow-y: auto;"
      bg-color="white" 
      text-color="black" 
      rounded outlined autogrow
      v-model="message" 
      placeholder="Message #channel_name"
      type="text"
      @keyup.enter="sendMessage"/>
      <q-btn class="q-mr-md" round flat icon="send" @click="sendMessage"/>  
    </q-footer>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  components: {  },
  data () {
    return {
      message: '',
    }
  },

  methods: {
    sendMessage (event: any) {
      if (!event.shiftKey || event.click) {
        this.message = ''
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
  height: 75vh;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 10px;
  padding-right: 20px;
}

::-webkit-scrollbar-track {
  border-radius: 10px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px; 
  background: #b2aaaa;
}
</style>