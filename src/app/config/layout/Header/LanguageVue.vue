<script setup lang="ts">
import LazyImage from "@/components/LazyImage.vue";
import { ILanguageList, ILanguageSelectList } from "@/models";
import { useFormatter } from "@/utils/formatter";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import i18n from "../../i18n";
import { useClickOutside } from "@/composables/useClickOutSide";

interface IProps {
  list: ILanguageList[];
}
const props = defineProps<IProps>();
const { getImageUrl } = useFormatter();
const { locale } = useI18n();
const locales = ["uz", "ru", "qr"];
const isOpen = ref(false);
const inner = ref<HTMLDivElement | null>(null);

useClickOutside(inner, () => {
  isOpen.value = false;
});

const items = computed(() => {
  let langs: ILanguageSelectList[] = [];
  if (props.list) {
    langs = props.list.map((el) => {
      let obj: ILanguageSelectList = el;
      if (el.code == "uz-cyrl" || el.code == "uz-latn") {
        obj = {
          ...obj,
          img: getImageUrl("flags/uz.png"),
        };
      }

      if (locales.includes(el.code)) {
        obj = {
          ...obj,
          img: getImageUrl(`flags/${el.code}.png`),
        };
      }

      return obj;
    });
  }

  return langs;
});

const switchLanguage = (lang: string) => {
  i18n.global.locale.value = lang;
  localStorage.setItem("lang", lang);
  window.location.reload();
};
</script>

<template>
  <div class="langs" ref="inner">
    <div
      v-for="item in items"
      :class="[
        'lang',
        {
          active: locale == item.code,
        },
      ]"
      @click="switchLanguage(item.code)"
    >
      <div class="img" v-if="item.img">
        <LazyImage :src="item.img" />
      </div>

      {{ item.fullName }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.img {
  width: 1.375rem;
  height: 1.0625rem;
  border-radius: 0.125rem;
  overflow: hidden;
}
.langs {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .lang {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.4s;
    cursor: pointer;

    &.active {
      background-color: var(--oquv-kurslari-main-text-color);
      color: var(--light);
    }

    &:hover {
      box-shadow: 0px 2px 10px 0px rgba(41, 100, 194, 0.2);
    }

    @include media(mini-laptop) {
      padding: 0.375rem;
      font-size: 0.625rem;
      line-height: 0.75rem;
      &:hover {
        background: rgba(0, 0, 0, 0.2);
      }

      &.active {
        &:hover {
          background-color: var(--bar-background-color);
          color: var(--light);
        }
      }
    }
  }

  @include media(mini-laptop) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
