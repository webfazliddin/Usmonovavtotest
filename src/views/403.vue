<script setup lang="ts">
import VButton from "@/components/VButton.vue";
import AuthService from "@/services/auth.service";
import { useAuth } from "@/stores/auth";
let auth = new AuthService();
const authStore = useAuth();

const logout = () => {
  auth.logout().then(() => {
    localStorage.clear();
    authStore.LogOut();
  });
};
</script>

<template>
  <div class="container">
    <img src="@/assets/notfound.svg" alt="404 error" class="image" />
    <img src="@/assets/403.svg" alt="403 error" class="image" />
    <p class="message">{{ $t("no_permission_page") }}</p>
    <VButton bg="var(--footer-bg-color)" @click="logout" size="small" :text="$t('Logout')" class="button" />
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #ebf8ff; /* bg-blue-50 */
}

.image {
  width: 33.3333%; /* w-1/3 */
  margin-bottom: 2rem; /* mb-8 */
}

.message {
  font-size: 1.5rem; /* text-2xl */
  color: #2a4e96; /* text-[#2A4E96] */
}

.button {
  margin-top: 1rem; /* mt-4 */
}
</style>
