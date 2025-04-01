<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { IFields } from "@/models/basic";
import FormTable from "@/components/form/FormTable.vue";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { UsersService } from "@/services/services/Users.service";
import Edit from "./edit.vue";
import { ref, watch } from "vue";
import { useTrafficMarks } from "./store/useTrafficMarks";

const store = useTrafficMarks();
const router = useRouter();

const { data, dataLoading, filter } = storeToRefs(store);

const route = useRoute();
const isDialog = ref(false);

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "fullName", label: "fullName" },
  { key: "shortName", label: "shortName" },
];

const fetchDetail = (item: any) => {
  router.push({
    name: "EditTrafficMarks",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
  isDialog.value = true;
};

store.fetchData();

watch(
  () => route.params.id,
  (val) => {
    if (val) {
      isDialog.value = true;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col md="6" cols="12">
        <h2>{{ $t("users") }}</h2>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchDetail(0)">
          {{ $t("createUser") }}
        </v-btn>
      </v-col>
    </v-row>

    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="data"
        :loading="dataLoading"
        :filter="filter"
        @refresh="store.fetchData"
        append-action
      >
        <template #actions="{ item }">
          <v-btn size="30" icon variant="flat" class="grey100">
            <v-avatar size="22">
              <DotsVerticalIcon size="20" color="grey100" />
            </v-avatar>
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  value="edit"
                  hide-details
                  min-height="38"
                  @click="fetchDetail(item)"
                >
                  <v-list-item-title>
                    <v-avatar size="20" class="mr-2">
                      <component :is="PencilIcon" stroke-width="2" size="20" />
                    </v-avatar>
                    {{ $t("edit") }}
                  </v-list-item-title>
                </v-list-item>
                <DeleteAction
                  :item="item"
                  :service="UsersService"
                  @refresh="store.fetchData()"
                >
                </DeleteAction>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </FormTable>
    </UiParentCard>

    <v-dialog v-model="isDialog" :width="450" persistent>
      <Edit v-model="isDialog" />
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.banner-icon {
  width: 2.75rem;
  height: 2.75rem;
}
</style>
