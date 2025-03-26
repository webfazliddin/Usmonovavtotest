<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { useCategories } from "./store/useCategories";
import { IFields } from "@/models/basic";
import FormTable from "@/components/form/FormTable.vue";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { CategoriesService } from "@/services/services/Categories";

const store = useCategories();
const { categories, categoriesLoading, filter } = storeToRefs(store);

const router = useRouter();

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "categoryName" },
];

const fetchCategoriesPage = (item: any) => {
  router.push({
    name: "EditCategories",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
};

store.fetchCategories();
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col md="6" cols="12">
        <h2>{{ $t("categories") }}</h2>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchCategoriesPage({ id: 0 })">
          {{ $t("createCategory") }}
        </v-btn>
      </v-col>
    </v-row>

    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="categories"
        :loading="categoriesLoading"
        :filter="filter"
        @refresh="store.fetchCategories"
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
                  @click="fetchCategoriesPage(item)"
                  value="edit"
                  hide-details
                  min-height="38"
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
                  :service="CategoriesService"
                  @refresh="store.fetchCategories()"
                >
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
