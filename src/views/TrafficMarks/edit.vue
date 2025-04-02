<script setup lang="ts">
import FileUpload from "@/components/form/FileUpload.vue";
import { FilesService } from "@/services/services/Files.service";
import { MarkCategoriesService } from "@/services/services/MarkCategories.service";
import { TrafficMarksService } from "@/services/services/TrafficMarks.service";
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

const markCategoryList = ref<
  Array<{
    name: string;
    id: number;
  }>
>([]);

const data = ref<{
  id: number;
  shortName: string;
  fullName: string;
  fileId: string;
  markCategoryId: number | null;
}>({
  id: 0,
  fileId: "",
  fullName: "",
  markCategoryId: null,
  shortName: "",
});

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    const textUpd = +String(id) ? "Edited" : "Created";
    TrafficMarksService.PostTrafficMarks(data.value).then((res) => {
      notify({
        text: t(`successUser${textUpd}`),
        type: "success",
      });
      back();
    });
  }
};

const fetchData = (val: string | number) => {
  fetchMarkSelectList();
  if (!val || +val == 0) return;

  TrafficMarksService.GetById(val)
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
  router.push({ name: "TrafficMarks" });
};

const fetchMarkSelectList = () => {
  MarkCategoriesService.MarkCategoriesSelectlist().then((res) => {
    markCategoryList.value = res.data.data;
  });
};

const fetchFile = (valeu: FormData) => {
  FilesService.PostFiles(valeu).then((res) => {
    data.value.fileId = res.data.fileName;
  });
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
            $t(`${route.params.id !== "0" ? "Edite" : "Create"}TrafficMarks`)
          }}
        </h2>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <form-input v-model="data.shortName" :label="$t('shortName')" />
          </v-col>
          <v-col cols="12">
            <form-input v-model="data.fullName" :label="$t('fullName')" />
          </v-col>
          <v-col cols="12">
            <form-select
              v-model="data.markCategoryId"
              :list="markCategoryList"
              :label="$t('markCategory')"
              item-value="id"
              item-title="name"
            />
          </v-col>
          <v-col cols="12">
            <FileUpload
              :title="$t('file')"
              accept="image/*"
              form-data-key="file"
              color="info"
              :files="data.fileId"
              @update-file="fetchFile"
              @delete-file="data.fileId = ''"
            >
            </FileUpload>
          </v-col>
          <v-col cols="12">
            <img
              :src="`https://api.uatest.uz/api/TrafficMarks/downloadfile?fileName=${data.fileId}`"
              alt=""
            />
          </v-col>
        </v-row>
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
