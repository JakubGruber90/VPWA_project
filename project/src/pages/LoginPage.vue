<template>
    <q-page>
        <h1>Slack lite</h1>
        <div class="button-box">
        <div id="btn"></div>
        <q-btn 
            class="toggle-btn"
            label="Prihlasenie"
        />
        <q-btn
            class="toggle-btn"
            label="Registracia"
            @click="goToRegistration()"
        />
        </div>
        <div class="input-group">
        <q-input v-model="username" label="Pouzivatelske meno" :dense="dense" style="width: 200px; height: 50px;"/>
        <q-input v-model="password" label="Heslo" :dense="dense" :type="isPwd ? 'password' : 'text'" style="width: 200px; height: 50px;">
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
            label="Prihlasit sa"
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
                //prihlasenie
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
    .button-box {
        width: 220px;
        margin: 35px auto;
        position: relative;
        box-shadow: 0 0 20px 9px #21BA45;
        border-radius: 30px;
        display: flex;
        justify-content: space-between;
    }
    
    .toggle-btn {
        width: 50%;
        max-width: 100%;
        padding: 10px 30px;
        cursor: pointer;
        background: transparent;
        border: 0;
        outline: none;
        position: relative;
        border-radius: 30px;
    }
    
    #btn {
        top: 0;
        left: 0;
        position: absolute;
        width: 110px;
        height: 100%;
        background: linear-gradient(to bottom, #21BA45, #71c98b);
        border-radius: 30px;
        transition: .5s;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .login-btn {
        margin: 0 auto; /* Center the button horizontally */
        margin-top: 100px; /* Add top margin as needed */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    h1 { color:  #21BA45; font-family: 'Raleway',sans-serif; font-size: 30px; font-weight: 800; line-height: 72px; margin: 24px 0 24px; text-align: center; text-transform: uppercase; }
</style>
0  