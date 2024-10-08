<script setup lang="ts">
import LanguageVue from "./LanguageVue.vue";
import ProfileVue from "./ProfileVue.vue";
import { Menu2Icon, XIcon } from "vue-tabler-icons";
import { useCustomizing } from "../customizer";
import Settings from "./Settings.vue";
import { LANGUAGE_SELECT_LIST } from "@/utils/constants";

const customizer = useCustomizing();

</script>

<template>
  <header>
    <div class="left-collar">
      <Menu2Icon
        @click="customizer.SET_SIDE_BAR()"
        v-if="!customizer.sidebar_drawer"
      />
      <XIcon @click="customizer.SET_SIDE_BAR()" v-else />
    </div>
    <div class="logo">
      <img src="@/assets/others/mobile_logo.svg" alt="" />
      <p class="color-dark-primary">{{ $t("logo") }}</p>
    </div>
    <div class="right-collar">
      <LanguageVue :list="LANGUAGE_SELECT_LIST" class="pc-lang" />
      <div class="d-flex align-center gap-10">
        <Settings :languageList="LANGUAGE_SELECT_LIST" />
        <ProfileVue />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  z-index: 9998;
  position: relative;
  background: var(--light);
  position: relative;
  width: 100%;
  width: 100%;
  padding: 1.375rem;
  border-radius: 1rem;
  box-shadow: var(--website-top-language-bar-bg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  z-index: 6000;
  margin-bottom: 2rem;
  .gap-10 {
    gap: 0.625rem;
  }

  .pc-lang {
    display: flex;
    @include media(mini-laptop) {
      display: none;
    }
  }
  .right-collar {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    @include media(mini-laptop) {
      width: auto;
    }
  }

  .left-collar {
    justify-content: center;
    align-items: center;
    display: none;

    @include media(mini-laptop) {
      display: flex;
    }
  }

  .logo {
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    display: none;

    @include media(mini-laptop) {
      display: flex;
    }
    p {
      font-size: 0.625rem;
      line-height: 0.75rem;
      max-width: 50%;

      @include media(phone) {
        max-width: 70%;
      }
      @include media(small-phone) {
        max-width: 100%;
      }
    }
    img {
      width: 1.875rem;
    }

    @include media(small-phone) {
      display: none;
    }
  }
}
</style>
