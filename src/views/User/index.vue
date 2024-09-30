<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import { useUsers } from "./store/useUsers";

const store = useUsers();
const { users, usersLoading } = storeToRefs(store);

const router = useRouter();

const fetchUserPage = (id: string | number) => {
  router.push({
    name: "EditUsers",
    params: {
      id,
    },
  });
};

store.fetchQuestions();
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
        <h1>{{ $t("users") }}</h1>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchUserPage(0)">
          {{ $t("createUser") }}
        </v-btn>
      </v-col>
    </v-row>
    <UiParentCard class="mt-4" v-if="!usersLoading && !users.length">
      <p class="font-weight-bold text-subtitle-1 text-center">
        {{ $t("notFound") }}
      </p>
    </UiParentCard>
    <UiParentCard class="text-center" v-if="usersLoading">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <UiParentCard v-if="users?.length && !usersLoading">
      <v-table>
        <thead>
          <tr>
            <th>{{ $t("id") }}</th>
            <th>{{ $t("firstName") }}</th>
            <th>{{ $t("lastName") }}</th>
            <th>{{ $t("userName") }}</th>
            <th>{{ $t("phoneNumber") }}</th>
            <th>{{ $t("actions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in users">
            <td>{{ item?.id }}</td>
            <td>{{ item.firstName }}</td>
            <td>{{ item.lastName }}</td>
            <td>{{ item.userName }}</td>
            <td>{{ item.phoneNumber }}</td>
            <td>
              <v-menu v-if="item?.id">
                <template #activator="{ props }">
                  <DotsVerticalIcon
                    class="cursor-pointer"
                    v-bind="props"
                  ></DotsVerticalIcon>
                </template>

                <v-card>
                  <v-card-text class="pa-0">
                    <v-list>
                      <v-list-item
                        value="edit"
                        @click="fetchUserPage(item.id)"
                      >
                        <div class="d-flex align-center justify-center ga-2">
                          <PencilIcon size="20" />
                          <span class="text-13"> {{ $t("edit") }}</span>
                        </div>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
    </UiParentCard>
  </div>
</template>

<style lang="scss" scoped>
.banner-icon {
  width: 2.75rem;
  height: 2.75rem;
}
</style>
