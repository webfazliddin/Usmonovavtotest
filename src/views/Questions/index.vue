<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useQuestions } from "./store/useQuestions";
import Banner from "@/components/Banner.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { DotsVerticalIcon, PencilIcon } from "vue-tabler-icons";
import FormTable from "@/components/form/FormTable.vue";
import { IFields } from "@/models/basic";
import DeleteAction from "@/components/Actions/DeleteAction.vue";
import { QuestionsService } from "@/services/services/Questions";

const store = useQuestions();
const { questions, questionsLoading, filter } = storeToRefs(store);

const router = useRouter();

const fields: IFields[] = [
  { key: "id", label: "ID" },
  { key: "questionText", label: "questionText" },
  { key: "description", label: "description" },
];

const fetchQuestionPage = (item: any) => {
  router.push({
    name: "EditQuestion",
    params: {
      id: item?.id ? item?.id : 0,
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
        <h1>{{ $t("testPage") }}</h1>
      </v-col>
      <v-col md="6" cols="12" class="text-sm-right">
        <v-btn color="info" @click="fetchQuestionPage(0)">
          {{ $t("createTest") }}
        </v-btn>
      </v-col>
    </v-row>
    <UiParentCard>
      <FormTable
        :fields="fields"
        :items="questions"
        :loading="questionsLoading"
        :filter="filter"
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
                  @click="fetchQuestionPage(item)"
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
                  :service="QuestionsService"
                  @refresh="store.fetchQuestions()"
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
