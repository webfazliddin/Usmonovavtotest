import { isRef, watch, type Ref, onMounted, onBeforeUnmount, unref } from "vue";

/* how use  useEventListener(window, 'keydown', onEscapePressed);*/

export function useEventListener(
  // the target could be reactive ref which adds flexibility
  target: Ref<EventTarget | null> | EventTarget,
  event: string,
  handler: (e: any) => any
) {
  // if its a reactive ref, use a watcher
  if (isRef(target)) {
    watch(target, (value, oldValue) => {
      oldValue?.removeEventListener(event, handler);
      value?.addEventListener(event, handler);
    });
  } else {
    // otherwise use the mounted hook
    onMounted(() => {
      target.addEventListener(event, handler);
    });
  }
  // clean it up
  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(event, handler);
  });
}
