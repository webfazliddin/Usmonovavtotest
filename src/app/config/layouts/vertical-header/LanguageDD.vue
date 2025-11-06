<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ILanguageList } from "@/models/basic";
import { LANGUAGE_SELECT_LIST } from "@/utils/constants";

const { locale } = useI18n({
  locale: "ru",
});

const ChangeLanguage = (item: ILanguageList) => {
  locale.value = item.code;
  localStorage.setItem("lang", item.code);
  window.location.reload();
};
</script>
<template>
  <v-menu :close-on-content-click="false" location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn icon variant="text" color="primary" v-bind="props" class="lang-btn">
        <v-avatar size="36" color="primary" class="lang-avatar">
          <template v-for="(item, _) in LANGUAGE_SELECT_LIST">
            <span class="text-h5 lang-text" v-if="item.code === locale">{{
              item.shortName
            }}</span>
          </template>
        </v-avatar>
        <v-tooltip activator="parent" location="top">
          {{ $t("changeLang") }}
        </v-tooltip>
      </v-btn>
    </template>
    <v-sheet rounded="md" width="200" elevation="10">
      <v-list class="theme-list">
        <v-list-item
          v-for="(item, index) in LANGUAGE_SELECT_LIST"
          :key="index"
          color="primary"
          :active="locale == item.code"
          class="d-flex align-center"
          @click="ChangeLanguage(item)"
        >
          <v-list-item-title class="text-subtitle-1 font-weight-regular">
            {{ item.text }}
            <!-- <span class="text-disabled text-subtitle-1 pl-2">({{ item.sh }})</span> -->
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-sheet>
  </v-menu>
</template>
<style lang="scss" scoped>
.lang-btn {
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

    .lang-avatar {
      transform: scale(1.05) rotate(-2deg) !important;
    }

    .lang-text {
      color: #fff !important;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  &:active {
    transform: translateY(0) scale(0.95) !important;
  }
}

.lang-avatar {
  width: clamp(36px, 4.5vw, 40px) !important;
  height: clamp(36px, 4.5vw, 40px) !important;
  border-radius: 8px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;

  @media (max-width: 768px) {
    width: 36px !important;
    height: 36px !important;
  }

  @media (max-width: 600px) {
    width: 34px !important;
    height: 34px !important;
  }

  @media (max-width: 375px) {
    width: 30px !important;
    height: 30px !important;
  }
}

.lang-text {
  font-family: 'Poppins', sans-serif !important;
  font-weight: 600 !important;
  font-size: clamp(13px, 1.6vw, 16px) !important;
  transition: all 0.25s ease !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @media (max-width: 768px) {
    font-size: 15px !important;
  }

  @media (max-width: 600px) {
    font-size: 14px !important;
  }

  @media (max-width: 375px) {
    font-size: 13px !important;
  }
}
</style>
