<script setup lang="ts">
import LazyImage from "@/components/LazyImage.vue";
import VButton from "@/components/VButton.vue";
import VMenu from "@/components/VMenu.vue";
import { LogoutIcon } from "vue-tabler-icons";
import AuthService from "@/services/auth.service";
import { useAuth } from "@/stores/auth";
import AnonymusPng from "@/assets/others/anonymus.png";

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
  <div class="profile">
    <VMenu outside hasOverlay>
      <template #activator>
        <div class="avatar">
          <LazyImage :src="AnonymusPng" class="img" />
        </div>
      </template>
      <div class="avatar-modal" ref="avatarRef">
        <div class="avatar-modal__profile">
          <div class="avatar">
            <LazyImage :src="AnonymusPng" class="img" />
          </div>
          <span v-if="authStore.user_info && authStore.user_info?.lastName">
            {{ authStore.user_info.lastName }}.
            {{ authStore.user_info.firstName.charAt(0) }}
          </span>
        </div>
        <div class="actions">
          <VButton
            :text="$t('logOut')"
            class="cabinet"
            bg="var(--error)"
            :prependIcon="LogoutIcon"
            @click="logout"
            prependIconColor="var(--secondary-light)"
          >
          </VButton>
        </div>
      </div>
    </VMenu>
  </div>
</template>
<style lang="scss" scoped>
.profile {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 0;

  .avatar-modal {
    padding: 0.625rem;
    border-radius: 0.375rem;
    background: var(--oquv-kurslari-image-bg);
    width: 18.75rem;
    color: var(--only-dark);

    @include media(phone) {
      font-size: 0.5rem;
      line-height: 0.5625rem;
    }
    &__profile {
      display: flex;
      gap: 0.625rem;
    }

    @include media(phone) {
      width: 8.5625rem;
    }
    .position {
      margin-top: 0.375rem;
      margin-bottom: 0.5rem;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin-top: 1.5rem;
    }
    .cabinet {
      width: 100%;
      :deep() svg,
      img {
        width: 1.25rem;
        height: 1.25rem;
      }
      @include media(phone) {
        padding: 0.375rem !important;
        :deep() svg,
        img {
          width: 0.75rem;
          height: 0.75rem;
        }
      }
    }
  }

  .img {
    width: 100%;
    height: 100%;
  }

  h4 {
    font-weight: 500;
    color: var(--bar-card-bg-color);
  }

  .avatar {
    width: calc(2.5rem + 0.0625rem);
    flex: 0 0 calc(2.5rem + 0.0625rem);
    height: calc(2.5rem + 0.0625rem);
    border-radius: 50%;
    overflow: hidden;
    border: 0.0625rem solid var(--bar-card-bg-color);
    cursor: pointer;
    @include media(mini-laptop) {
      width: 2rem;
      height: 2rem;
    }
  }

  @include media(phone) {
    h4 {
      display: none;
    }
  }
}
</style>
