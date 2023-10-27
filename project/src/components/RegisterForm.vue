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
                const fields = [
                    { name: this.name, label: 'Name', maxLength: 20 },
                    { name: this.surname, label: 'Surname', maxLength: 20 },
                    { name: this.email, label: 'Email', pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
                    { name: this.username, label: 'Username', maxLength: 15 },
                    { name: this.password, label: 'Password' },
                    { name: this.passwordRepeated, label: 'Repeated Password' }
                ];

                for (const field of fields) {
                    if (!field.name || field.name.trim() === '') {
                        return `${field.label} is required`;
                    }
                    if (field.maxLength && field.name.length > field.maxLength) {
                        return `${field.label} can have a maximum of ${field.maxLength} characters`;
                    }
                    if (field.pattern && !field.pattern.test(field.name)) {
                        return `The ${field.label} does not have the correct format`;
                    }
                }

                if (this.password !== this.passwordRepeated) {
                    return "Passwords do not match";
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