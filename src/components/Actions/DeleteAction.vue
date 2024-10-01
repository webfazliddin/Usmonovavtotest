<script setup lang="ts">
import { setError } from "@/utils/helpers";
import { notify } from "@kyvg/vue3-notification";
import { AxiosError } from "axios";
import { ref, toRefs } from "vue";
import { TrashIcon } from "vue-tabler-icons";
import { useI18n } from "vue-i18n";

interface IProps {
  item: any;
  service: any;
}
const props = defineProps<IProps>();
const emits = defineEmits(["refresh"]);
const { t } = useI18n();

const { item, service } = toRefs(props);

const isDelete = ref(false);
const loading = ref(false);

const deleteItem = () => {
  loading.value = true;
  if ("Delete" in service.value) {
    service.value["Delete"](item?.value?.id)
      .then(() => {
        notify({
          text: t(`successDeleted`),
          type: "success",
        });

        isDelete.value = false;
        emits("refresh");
      })
      .catch((e: AxiosError) => {
        setError(e);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
    throw new Error(`no Delete action in service`);
  }
};
</script>

<template>
  <div>
    <v-dialog v-model="isDelete" width="300">
      <template #activator="{ props }">
        <v-list-item value="delete" v-bind="props" hide-details min-height="38">
          <v-list-item-title>
            <v-avatar size="20" class="mr-2">
              <component :is="TrashIcon" stroke-width="2" size="20" />
            </v-avatar>
            {{ $t("deleteItem") }}
          </v-list-item-title>
        </v-list-item>
      </template>
      <v-card>
        <v-card-text>
          {{ $t("WantDelete") }}
        </v-card-text>
        <v-card-actions>
          <v-row>
            <v-col>
              <v-btn
                color="error"
                variant="flat"
                block
                @click="isDelete = false"
              >
                {{ $t("no") }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn
                :loading="loading"
                color="success"
                variant="flat"
                block
                @click="deleteItem"
              >
                {{ $t("yes") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
