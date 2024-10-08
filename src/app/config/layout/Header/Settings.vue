<script setup lang="ts">
import VMenu from "@/components/VMenu.vue";
import VIcon from "@/components/VIcon.vue";
import { SettingsIcon } from "vue-tabler-icons";
import LanguageVue from "./LanguageVue.vue";
import { ILanguageSelectList } from "@/models";
import ThemeVue from "./ThemeVue.vue";
interface IProps {
  languageList: ILanguageSelectList[];
}
defineProps<IProps>();
</script>

<template>
  <VMenu class="settings" has-overlay>
    <template #activator>
      <VIcon
        class="settings-activator"
        :icon="SettingsIcon"
        bg="var(--oquv-kurslari-main-text-color)"
        color="var(--light)"
        size="small"
      >
      </VIcon>
    </template>
    <div class="settings-content">
      <LanguageVue class="langs" :list="languageList" />
      <ThemeVue />
    </div>
  </VMenu>
</template>

<style lang="scss" scoped>
.settings {
  &-content {
    background: var(--oquv-kurslari-image-bg);
    border-radius: 0.5rem;
    padding: 0.625rem;
  }
  .settings-activator {
    @include media(mini-laptop) {
      width: 2rem;
      height: 2rem;
      flex: 0 0 2rem;
    }
  }
  .langs {
    display: none;
    @include media(mini-laptop) {
      display: flex;
    }
  }
  @include media(mini-laptop) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
