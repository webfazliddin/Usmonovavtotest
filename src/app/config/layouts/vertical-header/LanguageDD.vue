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
      <v-btn icon variant="text" color="primary" v-bind="props">
        <v-avatar size="36" color="primary">
          <template v-for="(item, _) in LANGUAGE_SELECT_LIST">
            <span class="text-h5" v-if="item.code === locale">{{
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
