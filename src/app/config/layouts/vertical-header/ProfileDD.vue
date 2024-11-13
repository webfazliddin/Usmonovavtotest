<script setup lang="ts">
import { useAdapter } from "@/utils/useAdapter";
import { useRouter } from "vue-router";
import { DoorExitIcon } from "vue-tabler-icons";
import { useUserStore } from "../store/user";

const router = useRouter();
const { killAdapter } = useAdapter();
const store = useUserStore();
function Logout() {
  killAdapter("token");
  killAdapter("isAdmin");
  store.$reset();
  router.push({ name: "SignIn" });
}
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-row class="align-center">
        <v-col>
          <v-btn
            class="custom-hover-primary"
            variant="text"
            v-bind="props"
            icon
          >
            <v-avatar size="35">
              <img src="@/assets/images/profile.jpg" width="35" alt="Julia" />
            </v-avatar>

            <v-tooltip activator="parent" location="top">
              {{ $t("changeProfile") }}
            </v-tooltip>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <v-card style="margin-top: 0.625rem">
      <v-card-text class="pa-0">
        <v-btn color="primary" variant="flat" block @click="Logout">
          <DoorExitIcon size="20" />
          {{ $t("Logout") }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>
<style lang="scss" scoped></style>
