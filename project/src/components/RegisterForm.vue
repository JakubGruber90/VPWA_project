<template>
    <q-page>
        <div class="input-group">
            <q-input v-model="name" label="Name"  style="width: 200px; height: 50px;"/>
            <q-input v-model="surname" label="Surname"  style="width: 200px; height: 50px;"/>
            <q-input v-model="email" label="Email"  style="width: 200px; height: 50px;"/>
            <q-input v-model="username" label="Username"  style="width: 200px; height: 50px;"/>
            <q-input v-model="password" label="Password"  :type="isPwd ? 'password' : 'text'" style="width: 200px; height: 50px;">
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="togglePasswordVisibility"
                />
                </template>
            </q-input>
            <q-input v-model="passwordRepeated" label="Repeat password" :dense="dense" :type="isPwd ? 'password' : 'text'" style="width: 200px; height: 50px;">
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
            label="Register"
            @click="register"
        />
    </q-page>
</template>

<script>
    export default {
        data() {
            return {
                name: '',
                surname: '',
                email: '',
                username: '',
                password: '',
                passwordRepeated: '',
                isPwd: true, 
            };
        },
        methods: {
            register() {
                this.$router.push({ name: 'homePage' });
            },

            togglePasswordVisibility() {
                this.isPwd = !this.isPwd;
            },

            goToLogin() {
                this.$router.push({ name: 'loginPage' });
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
        margin: 0 auto; /* Center the button horizontally */
        margin-top: 30px; /* Add top margin as needed */
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>