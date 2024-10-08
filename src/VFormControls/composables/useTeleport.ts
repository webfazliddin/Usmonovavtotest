// Utilities
import { computed, warn } from "vue";

// Types
import type { Ref } from "vue";

export function useTeleport(target: Ref<boolean | string | Element>) {
  const teleportTarget = computed(() => {
    const _target = target.value;

    if (_target === true) return undefined;

    const targetElement = _target === false ? document.body : typeof _target === "string" ? document.querySelector(_target) : _target;

    if (targetElement == null) {
      warn(`Unable to locate target ${_target}`);
      return undefined;
    }

    let container = targetElement.querySelector(":scope > .v-overlay-container");

    if (!container) {
      container = document.createElement("div");
      container.className = "v-overlay-container";
      targetElement.appendChild(container);
    }

    return container;
  });

  return { teleportTarget };
}
