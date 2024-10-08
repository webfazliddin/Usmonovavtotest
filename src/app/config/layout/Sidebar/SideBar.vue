<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "vue-tabler-icons";
import NavItem from "./NavItem.vue";
import HomeSvg from "@/assets/menu/HomeSvg.svg";
import PersonalInformation from "@/assets/menu/PersonalInformation.svg";
import Education from "@/assets/menu/Education.svg";
import Results from "@/assets/menu/Results.svg";
import Docs from "@/assets/menu/Docs.svg";
import Certificate from "@/assets/menu/Certificate.svg";
import { useCustomizing } from "../customizer";
import { onMounted, ref, watch } from "vue";
import { useEventListener } from "@/composables/useEventListener";
import { useRoute } from "vue-router";

const MENU = [
  {
    label: "homePage",
    img: HomeSvg,
    to: {
      name: "HomePage",
    },
  },
  {
    label: "personalInformation",
    img: PersonalInformation,
    to: {
      name: "PersonalInformationPage",
    },
  },
  {
    label: "myCourses",
    img: Education,
    to: {
      name: "EducationPage",
    },
  },
  {
    label: "myResult",
    img: Results,
    to: {
      name: "ResultPage",
    },
  },
  {
    label: "certificates",
    img: Certificate,
    to: {
      name: "CertificatesPage",
    },
  },
  {
    label: "documents",
    img: Docs,
    to: {
      name: "DocsPage",
    },
  },
];

const route = useRoute();

const customizer = useCustomizing();
const sidebar = ref<HTMLElement | null>(null);
const width = ref(window.innerWidth);
let resize_timer: ReturnType<typeof setTimeout>;

const mouseEnter = () => {
  if (width.value <= 1024) return;
  customizer.mini_sidebar = false;
};
const mouseLeave = () => {
  if (width.value <= 1024) return;
  if (customizer.sidebar_drawer) {
    customizer.mini_sidebar = true;
  }
};

const updateMainStyle = (width: number) => {
  document
    .querySelector("#main")
    ?.setAttribute("style", `padding-left: ${width}px`);
};

const onResize = async () => {
  width.value = window.innerWidth;

  if (window.innerWidth <= 1024) {
    updateMainStyle(0);
    customizer.mini_sidebar = false;
  } else {
    if (resize_timer) clearTimeout(resize_timer);
    resize_timer = setTimeout(() => {
      if (sidebar.value?.offsetWidth) {
        if (customizer.sidebar_drawer) {
          updateMainStyle(100);
        } else {
          updateMainStyle(sidebar.value?.offsetWidth);
        }
      }
    }, 300);
  }
};

useEventListener(window, "resize", onResize);

watch(
  () => customizer.sidebar_drawer,
  () => {
    onResize();
  },
  { immediate: true }
);

const getClickableLink = (link: string) => {
  return link.startsWith("http://") || link.startsWith("https://")
    ? link
    : `http://${link}`;
};

onMounted(() => {
  onResize();
});
const date = ref()
let t = new Date()
date.value = t.getFullYear()
</script>

<template>
  <div>
    <Transition name="fade">
      <div class="bg" v-if="customizer.sidebar_drawer && width <= 1024">
        <div class="bg-inner" @click="customizer.SET_SIDE_BAR()"></div>
      </div>
    </Transition>
    <div class="sidebar" @mouseenter="mouseEnter" @mouseleave="mouseLeave" ref="sidebar" :class="{
      ['show-menu']: customizer.sidebar_drawer,
      ['hidden-menu']: customizer.mini_sidebar,
    }">
      <div id="sidebar-content" class="sidebar-content">
        <div class="sidebar-logo">
          <div class="logo">
            <img src="@/assets/logo.svg" alt="" />
            <p>{{ $t("logo") }}</p>
          </div>
          <div class="arrow-icon" @click="customizer.SET_SIDE_BAR()">
            <div v-if="width > 1024">
              <ChevronLeftIcon v-if="!customizer.sidebar_drawer" />
              <ChevronRightIcon v-else />
            </div>
            <XIcon v-else />
          </div>
        </div>

        <nav class="sidebar-menu">
          <div class="menu-items">
            <NavItem tag="router-link" :to="item.to ? item.to : '/main'" class="nav-item" :class="{
              'router-link-exact-active':
                route.meta.parent == item.to.name ||
                route.query?.parent == item.to.name,
            }" v-for="item in MENU" :label="$t(item.label)" :img="item.img" />
          </div>
        </nav>
      </div>

      <div class="sidebar-footer" :class="{
        ['hidden-menu']: customizer.mini_sidebar,
      }">
        <a :href="getClickableLink('www.istc.uz')" target="_blank">www.istc.uz</a>
        <div class="sidebar-footer-divider"></div>
        <p>{{ date }}</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-item {
  margin-top: 0.75rem;
}
p {
  text-transform: uppercase;
  white-space: inherit;
}
</style>
