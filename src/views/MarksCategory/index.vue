<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { useMarkCategory } from "./store/useMarkCategory";
import { IFields } from "@/models/basic";
import FormTable from "@/components/form/FormTable.vue";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { MarkCategoryService } from "@/services/services/MarkCategory";

const store = useMarkCategory();
const { MarkCategories, MarkCategoriesLoading, filter } = storeToRefs(store);

const router = useRouter();

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "categoryName" },
];

const fetchMarkCategories = (item: any) => {
  router.push({
    name: "EditMarkCategory",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
};

store.fetchMarkCategories();
</script>

<template>
  <div>
    <Banner :text="$t('signInBannerDescription')">
      <template #icon>
        <img class="banner-icon" src="@/assets/images/learn.png" alt="" />
      </template>
    </Banner>
    <v-row class="mb-4">
      <v-col md="6" cols="12">
        <h2>{{ $t("MarkCategory") }}</h2>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchMarkCategories({ id: 0 })">
          {{ $t("createMarkCategory") }}
        </v-btn>
      </v-col>
    </v-row>

    <UiParentCard>
      <FormTable :fields="fields" :items="MarkCategories" :loading="MarkCategoriesLoading" :filter="filter"
        @refresh="store.fetchMarkCategories" append-action>
        <template #actions="{ item }">
          <v-btn size="30" icon variant="flat" class="grey100">
            <v-avatar size="22">
              <DotsVerticalIcon size="20" color="grey100" />
            </v-avatar>
            <v-menu activator="parent">
              <v-list>
                <v-list-item @click="fetchMarkCategories(item)" value="edit" hide-details min-height="38">
                  <v-list-item-title>
                    <v-avatar size="20" class="mr-2">
                      <component :is="PencilIcon" stroke-width="2" size="20" />
                    </v-avatar>
                    {{ $t("edit") }}
                  </v-list-item-title>
                </v-list-item>

                <DeleteAction :item="item" :service="MarkCategoryService" @refresh="store.fetchMarkCategories()">
                </DeleteAction>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </FormTable>
    </UiParentCard>
  </div>
</template>

<style lang="scss" scoped>
.banner-icon {
  width: 2.75rem;
  height: 2.75rem;
}
</style>
