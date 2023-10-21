<template>
    <q-page>
        <div class="input-group">
        <q-input 
            v-model="username" 
            label="Username"  
            style="width: 200px; 
            height: 50px;"/>
        <q-input 
            v-model="password" 
            label="Password" 
            :type="isPwd ? 'password' : 'text'" 
            style="width: 200px; 
            height: 50px;">
            <template v-slot:append>
            <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="togglePasswordVisibility"
            />
            </template>
        </q-input>
        </div>
        <q-btn
            class="login-btn"
            label="Login"
            @click="login"
        />
    </q-page>
</template>
  
<script>
    export default {
        data() {
            return {
                username: '',
                password: '',
                isPwd: true, 
            };
        },
        methods: {
            login() {
                this.$router.push({ name: 'homePage' });
            },

            togglePasswordVisibility() {
                this.isPwd = !this.isPwd;
            },

            goToRegistration() {
                this.$router.push({ name: 'registerPage' });
            }
        }
    }
</script>
  
<style>    
    .input-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .login-btn {
        margin: 0 auto; 
        margin-top: 100px; 
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
 