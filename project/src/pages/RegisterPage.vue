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

</script>

<style>

</style>