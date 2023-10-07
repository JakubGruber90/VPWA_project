<template>
  <q-page>
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

    <q-footer elevated>
      <div class="q-gutter-xs row items-center">
        <q-input 
          class="col q-pa-md custom-scrollbar"
          style="max-height: 300px; overflow-y: auto;"
          bg-color="white" 
          text-color="black" 
          rounded outlined autogrow
          v-model="message" 
          placeholder="Message #channel_name"
          type="text"/>
        <q-btn class="q-mr-md" round flat icon="send" />
      </div>
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
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  border-radius: 10px;
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px; 
  background: #807e7e;
}
</style>