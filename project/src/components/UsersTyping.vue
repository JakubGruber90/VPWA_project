<template>
  <span>
    <a class="user">
      <q-popup-proxy anchor="bottom right" self="top right">
        <q-card class="popupMessage">{{ userName }}'s message:<br> {{ popupText }}</q-card>
      </q-popup-proxy>

      {{ userName }}</a> 
      is typing  
  </span>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'UsersTyping',

  props: {
    popupText: String,
    userName: String,
  },
})
</script>
 
<style scoped>  
span {
  color: gray;
  font-style: oblique;
  font-size: 14px;
}

.user:hover {
  color: #429a8a;
  font-weight: 300;
}

.popupMessage {
  max-height: 150px;
  max-width: 150px;
  overflow: auto;
  word-wrap: break-word;
  padding: 10px;
}
</style>