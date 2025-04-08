<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ArrowLeftIcon } from "vue-tabler-icons";

defineProps<{
  title?: string;
  breadcrumbs?: unknown;
  icon?: string;
}>();

const route = useRoute()
const router = useRouter()
</script>

<template>
  <div class="mt-3 mb-6 w-100">
    <div class="d-flex justify-space-between w-100">
      <div class="d-flex py-0 align-center w-100">
        <div class="w-100">
          <h3 class="text-h3 mb-2">{{ title }}</h3>
          <v-breadcrumbs v-if="Array.isArray(breadcrumbs)" :items="breadcrumbs">
            <template v-slot:divider v-if="breadcrumbs">
              <v-icon>mdi-chevron-right</v-icon>
            </template>

            <template v-slot:title="{ item }">
              <h6 v-if="item.title" class="text-medium-emphasis text-subtitle-1">
                {{ $t(item.title) }}
              </h6>
            </template>
            <transition name="fade" mode="out-in">
              <v-btn v-if="route.params.id" class="ml-auto" @click="router.back()" color="error" :text="$t('Back')" :prepend-icon="ArrowLeftIcon" />
            </transition>
          </v-breadcrumbs>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-breadcrumb {
  .v-toolbar {
    background: transparent;
  }
}
</style>
