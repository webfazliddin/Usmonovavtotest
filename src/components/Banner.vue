<script setup lang="ts">
interface IProps {
  src?: string;
  imgSize?: "small" | "large";
  text?: string;
  isTitle?: boolean;
}

withDefaults(defineProps<IProps>(), {
  imgSize: "small",
});
</script>

<template>
  <div :class="['banner', `banner_${imgSize}`, { outlined: isTitle }]">
    <slot>
      <slot name="icon"> </slot>
      <p class="medium">{{ text }}</p>
      <slot name="append"></slot>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.banner {
  width: 100%;
  padding: 1.25rem 1.875rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 2rem;
  // background: var(--kurs-nomi-bg-gradient);
  background: #0e449b;

  color: #fff;
  border-radius: 1rem;
  margin: 1rem 0;
  p {
    font-size: 18px;
    font-weight: 600;
    line-height: 28px;
  }
  .img {
    display: flex;
    align-items: center;
  }

  &_large {
    .img {
      flex: 0 0 7.5rem;
      width: 7.5rem;

      @media screen and (max-width: 600px) {
        flex: 0 0 5.5rem;
        width: 5.5rem;
      }
    }
  }
  &_small {
    .img {
      width: 3.1875rem;
      flex: 0 0 3.1875rem;
    }
  }

  @media screen and (max-width: 1024px) {
    padding: 1.25rem;
    gap: 1rem;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    font-size: 0.875rem;
  }
}
</style>
