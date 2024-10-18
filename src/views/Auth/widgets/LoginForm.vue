<script setup lang="ts">
import { useUserStore } from "@/app/config/layouts/store/user";
import FormInput from "@/components/form/FormInput.vue";
import ApiService from "@/services/api.service";
import { AuthService } from "@/services/services/Auth.service";
import { useAdapter } from "@/utils/useAdapter";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { EyeIcon, EyeOffIcon } from "vue-tabler-icons";
import { SubmitEventPromise } from "vuetify/lib/framework.mjs";

const { setAdapter } = useAdapter();
const router = useRouter();
const userStore = useUserStore()
const isPassword = ref(false);
const loading = ref<boolean>(false);
const isRemember = ref<boolean>(false);

const signModel = ref({
  userName: "",
  password: "",
});

const submit = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (valid) {
    loading.value = true;
    AuthService.SignIn(signModel.value)
      .then((res) => {
        setAdapter(
          "token",
          res.data.token,
          isRemember.value ? "local" : "session"
        );
        setAdapter(
          "isAdmin",
          res.data.isAdmin,
          isRemember.value ? "local" : "session"
        );
        userStore.setIsAdmin(res.data?.isAdmin)
        ApiService.setHeader();

        router.push({ name: "Questions" });
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <v-form @submit.prevent="submit">
    <FormInput required :label="$t('userName')" v-model="signModel.userName" />
    <FormInput
      :type="isPassword ? 'text' : 'password'"
      required
      :label="$t('password')"
      v-model="signModel.password"
    >
      <template #append-inner>
        <div @click="isPassword = !isPassword" class="cursor-pointer">
          <EyeOffIcon v-if="isPassword" />
          <EyeIcon v-else />
        </div>
      </template>
    </FormInput>
    <v-checkbox v-model="isRemember" required hide-details color="primary">
      <template v-slot:label class=""> {{ $t('isRemember') }} </template>
    </v-checkbox>

    <v-btn type="submit" variant="flat" color="success" block :loading="loading" >
      {{ $t("signIn") }}
    </v-btn>
  </v-form>
</template>
