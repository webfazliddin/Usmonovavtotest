<script setup lang="ts">
import { useAdapter } from "@/utils/useAdapter";
import { useRouter } from "vue-router";
import { DoorExitIcon } from "vue-tabler-icons";
import { useUserStore } from "../store/user";

const router = useRouter();
const { killAdapter } = useAdapter();
const store = useUserStore();

async function Logout() {
  try {
    // Clear all authentication data
    killAdapter("token");
    killAdapter("isAdmin");
    store.$reset();

    // Force navigation to login page
    await router.replace({ name: "SignIn" });

    // Fallback: If router navigation fails, use window.location
    setTimeout(() => {
      if (router.currentRoute.value.name !== "SignIn") {
        window.location.href = "/sign-in";
      }
    }, 100);
  } catch (error) {
    // If all else fails, force reload to login page
    window.location.href = "/sign-in";
  }
}
</script>

<template>
  <v-menu :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-row class="align-center">
        <v-col>
          <v-btn
            class="custom-hover-primary profile-btn"
            variant="text"
            v-bind="props"
            icon
          >
            <v-avatar size="35" class="profile-avatar">
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
<style lang="scss" scoped>
.profile-btn {
  width: clamp(38px, 5vw, 44px) !important;
  height: clamp(38px, 5vw, 44px) !important;
  min-width: clamp(38px, 5vw, 44px) !important;
  background: #F8F9FC !important;
  border: 1px solid #E8ECF4 !important;
  border-radius: 10px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  user-select: none;

  @media (max-width: 768px) {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
  }

  @media (max-width: 600px) {
    width: 38px !important;
    height: 38px !important;
    min-width: 38px !important;
  }

  @media (max-width: 375px) {
    width: 34px !important;
    height: 34px !important;
    min-width: 34px !important;
  }

  &:hover {
    background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%) !important;
    border-color: #4A90E2 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3) !important;

    .profile-avatar {
      transform: scale(1.05) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }
  }

  &:active {
    transform: translateY(0) scale(0.95) !important;
  }
}

.profile-avatar {
  width: clamp(36px, 4.5vw, 40px) !important;
  height: clamp(36px, 4.5vw, 40px) !important;
  border-radius: 8px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 36px !important;
    height: 36px !important;
  }

  @media (max-width: 600px) {
    width: 34px !important;
    height: 34px !important;

    img {
      width: 34px !important;
    }
  }

  @media (max-width: 375px) {
    width: 30px !important;
    height: 30px !important;

    img {
      width: 30px !important;
    }
  }

  img {
    transition: all 0.25s ease;
  }
}
</style>
