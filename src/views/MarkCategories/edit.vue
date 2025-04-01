<script setup lang="ts">
import { MarkCategoriesService } from "@/services/services/MarkCategories.service";
import { notify } from "@kyvg/vue3-notification";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

defineProps<{
  modelValue: boolean;
}>();

const emits = defineEmits(["update:modelValue"]);

const route = useRoute();
const router = useRouter();

const { t } = useI18n();
const id = computed(() => route.params.id);

const data = ref<{
  id: number;
  name: string;
}>({
  id: 0,
  name: "",
});

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    const formData = new FormData();
    formData.append("name", data.value.name);
    const textUpd = +String(id) ? "Edited" : "Created";
    MarkCategoriesService.PostMarkCategories(formData).then((res) => {
      notify({
        text: t(`successUser${textUpd}`),
        type: "success",
      });
      back();
    });
  }
};

const fetchData = (val: string | number) => {
  if (!val || +val == 0) return;

  MarkCategoriesService.GetById(val)
    .then((res) => {
      data.value = res.data;
    })
    .catch((e) => {
      notify({
        text: e?.message,
        type: "error",
      });
    });
};

const back = () => {
  emits("update:modelValue", false);
  router.push({ name: "MarkCategories" });
};

watch(
  () => route.params.id,
  (val) => {
    if (val) {
      fetchData(val as string);
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-card>
    <v-form @submit.prevent="saveData">
      <v-card-title>
        <h2>
          {{
            $t(`${route.params.id !== "0" ? "Edite" : "Create"}MarkCategories`)
          }}
        </h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <form-input v-model="data.name" :label="$t('name')"></form-input>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="back">
          {{ $t("cancel") }}
        </v-btn>
        <v-spacer />

        <v-btn color="success" type="submit"> {{ $t("save") }} </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
