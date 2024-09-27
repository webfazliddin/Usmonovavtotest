<script setup lang="ts">
import FormCheckbox from "@/components/form/FormCheckbox.vue";
import FormInput from "@/components/form/FormInput.vue";
import UiParentCard from "@/components/UiParentCard.vue";
import { QuestionsService } from "@/services/services/Questions";
import { notify } from "@kyvg/vue3-notification";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { TrashIcon } from "vue-tabler-icons";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

interface IQuestions {
  questionText: string;
  description: string;
  choices: IQuestionsChoices[];
}

interface IQuestionsChoices {
  id: number;
  questionId: number;
  choiceText: string;
  isCorrect: boolean;
}

const { t } = useI18n();
const router = useRouter();

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
});

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

    formData.append("questionText", formModel.value.questionText);
    formData.append("description", formModel.value.description);
    formData.append("choices", JSON.stringify(formModel.value.choices));

    QuestionsService.PostQuestions(formData).then((res) => {
      notify({
        text: t("questionSuccessCreate"),
        type: "success",
      });

      router.push({ name: "Questions" });
    });
  }
};
</script>

<template>
  <div>
    <v-form @submit.prevent="saveData">
      <UiParentCard>
        <v-row>
          <v-col cols="12">
            <FormInput
              required
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
        </v-row>
      </UiParentCard>

      <UiParentCard class="mt-4">
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
        <v-col cols="12" md="6">
          <v-btn color="error"> {{ $t("back") }} </v-btn>
        </v-col>
        <v-col cols="12" md="6" class="text-right">
          <v-btn type="submit" color="success"> {{ $t("save") }} </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<style lang="scss" scoped></style>
