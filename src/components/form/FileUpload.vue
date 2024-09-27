<script setup lang="ts">
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { CheckIcon, PaperclipIcon } from "vue-tabler-icons";

interface IProps {
  files?: any;
  disabled?: boolean;
  title: string;
  required?: boolean;
  accept: string;
  formDataKey: string;
  color: string;
  size?: string;
  limitedSize?: string;
  progress?: number;
  view?: boolean;
  canDelete?: boolean;
  multiple?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<IProps>(), {
  color: "success",
  canDelete: true,
  id: "pic1"
});

const { t } = useI18n();

const fileRef = ref<HTMLInputElement | null>(null);
const emits = defineEmits(["downloadFile", "updateFile", "deleteFile"]);

const downLoadFile = (file: any) => {
  emits("downloadFile", file);
};
const checkFileSize = (event: Event) => {
  const limitedSize = (event.target as HTMLInputElement).size;
  const files = (event.target as HTMLInputElement).files;

  if (files && limitedSize) {
    if (files[0].size > limitedSize) {
      notify({
        text: t("brokenLimitedSize", {
          size: (limitedSize / 1024 / 1024).toFixed(2)
        }),
        type: "warn"
      });

      if (fileRef.value) {
        fileRef.value.value = "";
      }
      return;
    }
  }
  return false;
};

const updateFile = (event: Event) => {
  if (props.limitedSize && checkFileSize(event)) {
    return;
  }

  const formData = new FormData();
  const file = (event.target as HTMLInputElement).files;

  if (file && file.length > 0) {
    if (props.formDataKey.length > 0) {
      formData.append(props.formDataKey, file[0]);
      emits("updateFile", formData);
    } else {
      emits("updateFile", file);
    }
  }
};

const deleteFile = (event: Event, file: any, index: number) => {
  event.stopImmediatePropagation();

  if (fileRef.value) {
    fileRef.value.value = "";
    emits("deleteFile", file, index);
  }
};
</script>

<template>
  <div class="w-100">
    <v-btn :color="color" :size="size" :disabled="disabled" v-if="!view">
      <label :for="id" class="d-flex align-center">
        <slot name="icon">
          <PaperclipIcon class="mr-2" v-if="!progress" />
          <CheckIcon class="mr-2" v-if="progress == 100" />
          <v-progress-circular indeterminate size="20" class="mr-2" v-if="progress && progress < 100 && progress > 0" />
        </slot>
        <span v-if="progress && progress !== 100"> {{ Math.ceil(progress) }}% </span>
        <span v-if="!progress || progress == 100">
          {{ title }}
          <span v-if="required" style="color: red">*</span>
        </span>
        <input :size="limitedSize" :accept="accept" type="file" :id="id" ref="fileRef" @change="updateFile" />
      </label>
    </v-btn>
    <template v-if="Array.isArray(files)">
      <v-chip
        class="mt-3"
        v-for="(file, index) in files"
        @click="downLoadFile(file)"
        @click:close="deleteFile($event, file, index)"
        :closable="canDelete"
        color="info"
        :disabled="disabled"
      >
        <span class="chip-content">{{ file.fileName }}</span>
      </v-chip>
    </template>
    <template v-else-if="files && !Array.isArray(files)">
      <v-chip class="mt-3" color="info" :disabled="disabled" @click="downLoadFile" :closable="canDelete" @click:close="deleteFile($event, files, 0)">
        <span class="chip-content">{{ files }}</span>
      </v-chip>
    </template>
  </div>
</template>
<style scoped lang="scss">
input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  opacity: 0;
}
</style>
