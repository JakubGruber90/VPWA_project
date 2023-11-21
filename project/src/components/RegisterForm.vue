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
    import { ref } from 'vue';

    import { supabase } from 'app/config/supabase';


    export default {
        setup () {
            const $q = useQuasar()
            const email = ref("");
            const password = ref("");
            const name = ref("");
            const surname = ref("");
            const username = ref("");
            const passwordRepeated = ref("");

            async function registerUser(){

                const response = await fetch('http://localhost:3333/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'username': username.value,
                        'email': email.value,
                    },
                    });

                    if (response.status === 400) {
                    const user = await response.json(); 
                    this.showNotif("User already exists")
                    return;
                }

                const data = await supabase.auth.signUp({
                    email: email.value,
                    password: password.value,
                    },
                    {
                        data: {
                            nickname: username.value,

                        }
                    }
                );

                console.log(data)

                const reqBody = {
                    id: data.user.id,
                    email: email.value,
                    nickname: username.value,
                    firstname: name.value,
                    lastname: surname.value,
                }

                fetch('http://localhost:3333/users', {
                    method: 'POST',
                    body: JSON.stringify(reqBody),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    })
                    .then((response) => {
                        if (response.status === 201) {
                        return response.json(); 
                        } else if (response.status === 400) {
                        throw new Error('Bad request: Invalid data');
                        } else {
                        throw new Error('Server Error: Something went wrong');
                        }
                    })
                    .then((data) => {
                        console.log('Data:', data);
                        window.location.reload();
                    })
                    .catch((error) => {
                        console.log(error)
                    }); 
            }

            function validation() {
                const fields = [
                    { name: name.value, label: 'Name', maxLength: 20 },
                    { name: surname.value, label: 'Surname', maxLength: 20 },
                    { name: email.value, label: 'Email', pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
                    { name: username.value, label: 'Username', maxLength: 15 },
                    { name: password.value, minLength: 6, label: 'Password' },
                    { name: passwordRepeated.value, minLength: 6, label: 'Repeated Password' }
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

                if (password.value !== passwordRepeated.value) {
                    return "Passwords do not match";
                }

                if (password.value.length < 6) {
                    return "Password should be at least 6 characters";
                }

                return true;
            }
            
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
                },
                email,
                password,
                name,
                surname,
                username,
                passwordRepeated,
                registerUser,
                validation
            }
        },

        data() {
            return {
                isPwd: true, 
            };
        },
        methods: {
            async register() {
                const message = this.validation()
                 if(message !== true) {
                    this.showNotif(message)
                    return;
                }
                 
                this.registerUser()

            },

            togglePasswordVisibility() {
                this.isPwd = !this.isPwd;
            },

            goToLogin() {
                this.$router.push({ name: 'loginPage' });
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




