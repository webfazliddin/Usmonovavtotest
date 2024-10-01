<script setup lang="ts">
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import FormInput from "@/components/form/FormInput.vue";
import FormSelect from "@/components/form/FormSelect.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { ISelectList } from "@/models/basic";
import { CategoriesService } from "@/services/services/Categories";
import { QuestionsService } from "@/services/services/Questions";
import { notify } from "@kyvg/vue3-notification";
import { onMounted } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { TrashIcon } from "vue-tabler-icons";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

interface IQuestions {
  questionText: string;
  description: string;
  choices: IQuestionsChoices[];
  formFile: File | null;
  categoryId: number | null;
}

interface IQuestionsChoices {
  id: number;
  questionId: number;
  choiceText: string;
  isCorrect: boolean;
}

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const id = route.params.id as string;
const loading = ref(false);

const choiceModel = ref<IQuestionsChoices>({
  choiceText: "",
  id: 0,
  isCorrect: false,
  questionId: 0,
});

const formModel = ref<IQuestions>({
  questionText: "",
  choices: [],
  description: "",
  categoryId: null,
  formFile: null,
});

const categories = ref<ISelectList[]>([]);

const addChoice = () => {
  formModel.value.choices.push(JSON.parse(JSON.stringify(choiceModel.value)));
};

const deleteChoice = (index: number) => {
  formModel.value.choices.splice(index, 1);
};

const saveData = async (submit: SubmitEventPromise) => {
  const { valid, errors } = await submit;
  if (errors.length) {
    notify({
      text: "checkQuestion",
      type: "warn",
    });
  }
  if (valid) {
    const formData = new FormData();

    for (const item in formModel.value) {
      // @ts-ignore
      formData.append(item, (formModel.value[item]));
    }

    if (formModel.value.formFile) {
      const blob = URL.createObjectURL(formModel.value?.formFile);
      formData.append("formFile", blob);
    }

    const api = +String(id) ? "PutQuestions" : "PostQuestions";
    const text = +String(id) ? "Edited" : "Created";

    QuestionsService[api](formData, id).then((res) => {
      notify({
        text: t(`questionSuccess${text}`),
        type: "success",
      });

      router.push({ name: "Questions" });
    });
  }
};

const fetchData = () => {
  if (+String(id)) {
    loading.value = true;
    QuestionsService.GetById(+String(id))
      .then((res) => {
        formModel.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

const fetchQuestionsSelectList = () => {
  CategoriesService.SelectList().then((res) => {
    categories.value = res.data;
  });
};

onMounted(() => {
  fetchData();
  fetchQuestionsSelectList();
});
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <v-form @submit.prevent="saveData" v-if="!loading">
      <UiParentCard>
        <v-row>
          <v-col cols="12">
            <FormInput
              required
              type="textarea"
              :label="$t('questionText')"
              v-model:model-value="formModel.questionText"
            >
            </FormInput>
          </v-col>
          <v-col cols="12">
            <FormInput
              required
              type="textarea"
              :label="$t('description')"
              v-model:model-value="formModel.description"
            >
            </FormInput>
          </v-col>
          <v-col lg="3" md="6" cols="12">
            <v-label class="mb-2 font-weight-medium">
              {{ $t("file") }}
            </v-label>
            <v-file-input
              variant="outlined"
              color="primary"
              hide-details
              label=""
              accept="image/*"
              v-model:model-value="formModel.formFile"
            ></v-file-input>
          </v-col>

          <v-col lg="3" md="6" cols="12">
            <FormSelect
              :label="$t('category')"
              v-model:model-value="formModel.categoryId"
              :list="categories"
              itemValue="id"
              itemTitle="name"
            >
            </FormSelect>
          </v-col>
        </v-row>
      </UiParentCard>

      <UiParentCard class="mt-4">
        <h2 class="mb-4 ml-4">
          {{ $t("answers", { count: formModel.choices?.length }) }}
        </h2>
        <v-list
          class="pa-3"
          elevation="0 "
          v-for="(choice, index) in formModel.choices"
        >
          <v-card elevation="2">
            <v-list-group>
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <template #title>
                    <h4>
                      <v-label :class="['mx-2']"> {{ index + 1 }}. </v-label>

                      {{ choice.choiceText }}
                    </h4>
                  </template>
                  <template #append="{ isActive }">
                    <v-icon
                      :color="!isActive ? 'teal' : ''"
                      :icon="isActive ? 'mdi-pencil' : 'mdi-check'"
                    ></v-icon>
                    <v-icon
                      color="error"
                      @click="deleteChoice(index)"
                      :icon="TrashIcon"
                    ></v-icon>
                  </template>
                </v-list-item>
              </template>
              <v-row class="align-center pa-4">
                <v-col cols="12" lg="9">
                  <FormInput
                    required
                    v-model="choice.choiceText"
                    :label="$t('choiceText')"
                  />
                </v-col>
                <v-col cols="12" lg="3">
                  <FormCheckbox
                    v-model="choice.isCorrect"
                    :label="$t('isCorrect')"
                  />
                </v-col>
              </v-row>
            </v-list-group>
          </v-card>
        </v-list>

        <v-row class="mt-4">
          <v-col class="text-right">
            <v-btn color="info" @click="addChoice">
              {{ $t("addChoice") }}
            </v-btn>
          </v-col>
        </v-row>
      </UiParentCard>

      <v-row class="mt-4">
        <v-col cols="6">
          <v-btn color="error" @click="router.back()"> {{ $t("back") }} </v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn type="submit" color="success"> {{ $t("save") }} </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<style lang="scss" scoped></style>
