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
            <q-input v-model="passwordRepeated" label="Repeat password" :type="isPwd ? 'password' : 'text'" style="width: 200px; height: 50px;">
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
    import { useQuasar } from 'quasar'

    export default {
        setup () {
            const $q = useQuasar()

            return {
                showNotif (errorMessage) {
                    $q.notify({
                        timeout: 1500,
                        message: errorMessage, 
                        color: 'negative',
                        multiLine: true,
                        type: 'negative',
                        actions: [
                            { label: 'understand', color: 'yellow', handler: () => { /* ... */ } }
                        ]
                    })
                }
            }
        },

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
                const message = this.validation()
                if(message !== true) {
                    this.showNotif(message)
                    return;
                }

                this.$router.push({ name: 'homePage' });
            },

            togglePasswordVisibility() {
                this.isPwd = !this.isPwd;
            },

            goToLogin() {
                this.$router.push({ name: 'loginPage' });
            },

            validation() {
                if (this.name.trim() === '') {
                    return 'Name is required';
                }

                if (this.surname.trim() === '') {
                    return 'Surname is required';
                }

                if (this.email.trim() === '') {
                    return 'Email is required';
                }

                if (this.username.trim() === '') {
                    return 'Username is required';
                }

                if (this.password.trim() === '') {
                    return 'Password is required';
                }

                if(this.name.length > 20) {
                    return 'Name can have a maximum of 20 characters!';
                }

                if(this.surname.length > 20) {
                    return 'Surname can have a maximum of 20 characters!';
                }

                if(this.username.length > 15) {
                    return 'Username can have a maximum of 15 characters!'; 
                }

                if(this.password !== this.passwordRepeated) {
                    return "Passwords do not match!";
                }

                const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
                if(!emailPattern.test(this.email)) {
                    return "The email does not have the correct format";
                }

                return true;
            },
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
        margin-top: 30px; 
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>