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
import BackBtn from "@/components/form/BackBtn.vue";

const store = useQuestions();
const { questions, questionsLoading, filter, categories } = storeToRefs(store);

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

store.fetchCategories();
store.fetchQuestions();
</script>

<template>
  <div>
    <v-row class="mb-4">
      <v-col md="1" cols="12">
        <h2 style="">{{ $t("testPage") }}</h2>
      </v-col>
      <v-col md="8" cols="12" class="text-sm-right">
        <FormInput
          :placeholder="$t('search')"
          v-model:model-value="filter.Search"
          @appendInner="store.fetchQuestions"
          :clearIcon="false"
        >
        </FormInput>
      </v-col>
      <v-col md="2" cols="12">
        <FormSelect
          v-model:model-value="filter.CategoryId"
          :list="categories"
          itemValue="id"
          itemTitle="name"
          @update:model-value="store.fetchQuestions"
        >
        </FormSelect>
      </v-col>
      <v-col md="1" cols="12" class="text-sm-right">
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
        @refresh="store.fetchQuestions"
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
