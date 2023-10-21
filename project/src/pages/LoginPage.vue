<template>
    <q-page>
        <h1>Slack lite</h1>
        <div class="button-box">
            <q-btn
                class="toggle-btn"
                label="Log in"
                @click="showLogin"
                :class="{ 'active': activeComponent === 'LoginForm' }"
            />
            <q-btn
                class="toggle-btn"
                label="Register"
                @click="showRegister"
                :class="{ 'active': activeComponent === 'RegisterForm' }"
            />
        </div>
        <component :is="activeComponent" />
    </q-page>
</template>
  
<script>
    import LoginForm from  '../components/LoginForm.vue';
    import RegisterForm from '../components/RegisterForm.vue';

    export default {
        data() {
            return {
                activeComponent: 'LoginForm',
            };
        },
        components: {
            LoginForm,
            RegisterForm,
        },
        methods: {
            showLogin() {
                this.activeComponent = 'LoginForm';
            },
            showRegister() {
                this.activeComponent = 'RegisterForm';
            },
        },
    };
</script>

<style>
    .button-box {
        width: 220px;
        margin: 35px auto;
        position: relative;
        box-shadow: 0 0 20px 9px #429a8a;
        border-radius: 30px;
        display: flex;
        justify-content: space-between;
    }

    h1 { 
        color:  #429a8a; 
        font-family: 'Raleway',sans-serif; 
        font-size: 30px; 
        font-weight: 800; 
        line-height: 72px; 
        margin: 24px 0 24px; 
        text-align: center; 
        text-transform: uppercase; 
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

    .toggle-btn.active {
        background: #429a8a;
        transition: .5s;
    }
</style>