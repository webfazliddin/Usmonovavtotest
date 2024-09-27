<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isModal = ref<boolean>(false);
</script>

<template>
  <v-dialog v-bind="$attrs" v-model="isModal" width="500" location="top">
    <template #activator="{ props }">
      <v-btn color="error" variant="flat" v-bind="props">
        {{ $t("Back") }}
      </v-btn>
    </template>

    <v-card class="px-5 py-5">
      <v-card-title>
        <h3 class="text-center" style="white-space: pre-wrap">
          {{ $t("backConfirmation") }}
        </h3>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-btn
              :text="$t('no')"
              class="w-100"
              color="error"
              variant="flat"
              @click="isModal = false"
            />
          </v-col>
          <v-col cols="6">
            <v-btn
              @click="router.back()"
              class="w-100"
              :text="$t('yes')"
              variant="flat"
              color="success"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
