<script setup lang="ts">
import { onMounted, ref } from "vue";
import { UserModel } from "./types";
import { useRoute, useRouter } from "vue-router";
import UiParentCard from "@/components/UiParentCard.vue";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";
import { UsersService } from "@/services/services/Users.service";
import { notify } from "@kyvg/vue3-notification";
import { useI18n } from "vue-i18n";
import { setError } from "@/utils/helpers";
import FormInput from "@/components/form/FormInput.vue";
import FormPhoneNumber from "@/components/form/FormPhoneNumber.vue";
import FormCheckbox from "@/components/form/FormCheckbox.vue";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const id = route.params.id as string;

const formModel = ref<UserModel>({
  firstName: "",
  isActive: false,
  isAdmin: false,
  lastName: "",
  phoneNumber: "",
  userName: "",
});

const loading = ref(false);
const saveLoading = ref(false);

const saveData = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;

  if (valid) {
    saveLoading.value = true;
    const api = +String(id) ? "PutUsers" : "PostUsers";
    const text = +String(id) ? "Edited" : "Created";
    UsersService[api](formModel.value, id)
      .then(() => {
        notify({
          text: t(`successUser${text}`),
          type: "success",
        });

        router.push({ name: "Users" });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }
};

const fetchUser = () => {
  if (+String(id)) {
    loading.value = true;

    UsersService.GetById(id)
      .then((res) => {
        formModel.value = res.data;
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div>
    <UiParentCard v-if="loading" class="text-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </UiParentCard>
    <v-form @submit.prevent="saveData" v-if="!loading" >
      <UiParentCard>
        <v-row>
          <v-col lg="3" md="6" cols="12">
            <FormInput
              v-model:model-value="formModel.firstName"
              :label="$t('firstName')"
              required
            />
          </v-col>
          <v-col lg="3" md="6" cols="12">
            <FormInput
              v-model:model-value="formModel.lastName"
              :label="$t('lastName')"
              required
            />
          </v-col>
          <v-col lg="3" md="6" cols="12">
            <FormInput
              v-model:model-value="formModel.userName"
              :label="$t('userName')"
              required
            />
          </v-col>
          <v-col lg="3" md="6" cols="12">
            <FormPhoneNumber
              v-model:model-value="formModel.phoneNumber"
              :label="$t('phoneNumber')"
              required
            />
          </v-col>
          <v-col lg="3" md="6" cols="12">
            <FormCheckbox
              v-model:model-value="formModel.isAdmin"
              :label="$t('isAdmin')"
            />
          </v-col>
          <v-col lg="3" md="6" cols="12">
            <FormCheckbox
              v-model:model-value="formModel.isActive"
              :label="$t('isActive')"
            />
          </v-col>
        </v-row>
      </UiParentCard>
      <v-row class="mt-4">
        <v-col cols="6">
          <v-btn color="error" @click="router.back()">
            {{ $t("back") }}
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn type="submit" color="success"> {{ $t("save") }} </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<style lang="scss" scoped></style>
