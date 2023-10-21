<template>
    <q-layout view="hHh Lpr lFf">
        <q-page-container>
            <div class="auth-container">
                <div class="form">
                    <router-view />
                </div>
            </div>
        </q-page-container>
  </q-layout>
</template>

<script>

</script>

<style>
    html, body {
        height: 100%;
        overflow: hidden; /* Prevent the scrollbar from appearing */
    }

    .auth-container {
        height: 100%;
        width: 100%;
        background: #429a8a;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .form {
        width: 400px;
        height: 600px;
        border-radius: 20px;
        box-shadow: 0 0 20px 9px #429a8a;
        background-color: white;
        position: relative;
    }
</style>
