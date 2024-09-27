<script setup lang="ts">
import { useRouter } from "vue-router";
import { DoorExitIcon } from "vue-tabler-icons";

const router = useRouter();

function Logout() {
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
    <v-sheet
      rounded="md"
      class="sheet"
      max-width="450"
      elevation="10"
      style="margin-top: 10px"
    >
      <v-col md="5" sm="12" class="pt-4 pb-3 px-4 text-center ml-auto">
        <v-btn color="primary" variant="flat" block @click="Logout">
          <DoorExitIcon size="20" style="margin-right: 20px" />
          {{ $t("Logout") }}
        </v-btn>
      </v-col>
    </v-sheet>
  </v-menu>
</template>
<style lang="scss" scoped>
.sheet {
  width: 28.125rem !important;
  @media screen and (max-width: 600px) {
    width: 100% !important;
  }
}
</style>
