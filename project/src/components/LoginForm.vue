<template>
    <q-page>
        <div class="input-group">
        <q-input 
            v-model="email" 
            label="Email"  
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
    import { supabase } from 'app/config/supabase';
    import { useRouter } from 'vue-router';
    import { ref } from 'vue';

    export default {
        setup(){
        const router = useRouter()
        const email = ref("");
        const password = ref("");
        

        async function login() {
                const {user, error} = await supabase.auth.signIn({
                    email: email.value,
                    password: password.value
                })

                if(error){
                    alert(error.message)
                }
                else{
                   // console.log(await supabase.auth.session())
                   router.push({ name: 'homePage' });
                }
            }

        return {
            email,
            password,
            login
        }
    },
        data() {
            return {
                isPwd: true, 
            };
        },
        methods: {

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
 