<script setup lang="ts">
import LoginForm from "./widgets/LoginForm.vue";

/* Login form */
</script>
<template>
  <div class="authentication">
    <v-container fluid class="pa-3">
      <v-row class="h-100vh d-flex justify-center align-center">
        <v-col cols="12" class="d-flex align-center">
          <v-card
            rounded="md"
            elevation="10"
            class="px-sm-1 px-0 mx-auto"
            max-width="450"
          >
            <v-card-item class="pa-sm-8">
              <div class="d-flex justify-center mb-5 align-center">
                <img src="@/assets/images/logo.svg" alt="" />
                <h2>Usmonov avto test</h2>
              </div>
              <LoginForm />
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
