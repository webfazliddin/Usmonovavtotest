<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon, XIcon } from "vue-tabler-icons";
import { useUsers } from "./store/useUsers";
import { IFields } from "@/models/basic";
import FormTable from "@/components/form/FormTable.vue";
import { useCategories } from "../Categories/store/useCategories";
import { ref } from "vue";
import { UserModel } from "./types";
import TestProcess from "@/features/Test/TestProcess.vue";

interface ISelected {
  category: any;
  user: UserModel | null;
}

const store = useUsers();
const categoriesStore = useCategories();

const { users, usersLoading, filter } = storeToRefs(store);
const { categories } = storeToRefs(categoriesStore);

const router = useRouter();
const selectedCategory = ref<ISelected | null>();
const isResult = ref(false);

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "firstName" },
  { key: "lastName", label: "lastName" },
  { key: "userName", label: "userName" },
  { key: "phoneNumber", label: "phoneNumber" },
];

const fetchUserPage = (item: any) => {
  router.push({
    name: "EditUsers",
    params: {
      id: item?.id ? item?.id : 0,
    },
  });
};

store.fetchUsers();
categoriesStore.fetchCategories();
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
        <h2>{{ $t("users") }}</h2>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchUserPage(0)">
          {{ $t("createUser") }}
        </v-btn>
      </v-col>
    </v-row>

    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="users"
        :loading="usersLoading"
        :filter="filter"
        @refresh="store.fetchUsers"
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
                  @click="fetchUserPage(item)"
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
                <v-dialog width="300">
                  <template #activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      value="edit"
                      hide-details
                      min-height="38"
                    >
                      <v-list-item-title>
                        <v-avatar size="20" class="mr-2">
                          <component
                            :is="PencilIcon"
                            stroke-width="2"
                            size="20"
                          />
                        </v-avatar>
                        {{ $t("showResult") }}
                      </v-list-item-title>
                    </v-list-item>
                  </template>

                  <UiParentCard>
                    <v-list>
                      <v-list-item
                        v-for="cat in categories"
                        :value="item.id"
                        @click="
                          () => {
                            selectedCategory = {
                              category: cat,
                              user: item,
                            };
                            isResult = true;
                          }
                        "
                      >
                        {{ cat.name }}
                      </v-list-item>
                    </v-list>
                  </UiParentCard>
                </v-dialog>

                <v-dialog v-model:model-value="isResult" scrollable fullscreen>
                  <v-card elevation="0">
                    <v-card-title>
                      <v-row>
                        <v-col cols="12">
                          <v-row class="align-center">
                            <v-col cols="auto">
                              <h3>
                                {{
                                  $t("selectedUserResult", {
                                    users: selectedCategory?.user?.firstName,
                                    category: selectedCategory?.category?.name,
                                  })
                                }}
                              </h3>
                            </v-col>
                            <v-spacer />
                            <v-col cols="auto">
                              <v-btn
                                @click="isResult = false"
                                :icon="XIcon"
                                color="info"
                              >
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-title>

                    <v-card-text v-if="selectedCategory?.category">
                      <TestProcess
                        :category="selectedCategory?.category"
                        view
                        v-model:model-value="isResult"
                      />
                    </v-card-text>
                  </v-card>
                </v-dialog>
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
