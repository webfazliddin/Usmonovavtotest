// src/i18n.d.ts
import { DefineComponent } from "vue";
import { VueI18n } from "vue-i18n";

import { RouteLocationNormalizedLoaded } from "vue-router";
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// Declare the module augmentation for Vue
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: typeof VueI18n.prototype.t;
    $tc: typeof VueI18n.prototype.tc;
    $te: typeof VueI18n.prototype.te;
    $d: typeof VueI18n.prototype.d;
    $n: typeof VueI18n.prototype.n;
    $route: RouteLocationNormalizedLoaded;
    $router: Router;
  }
}

