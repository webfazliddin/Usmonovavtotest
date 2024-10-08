<script setup lang="ts">
import FormCheckbox from "@/components/FormCheckbox.vue";
import VButton from "@/components/VButton.vue";
import VFormInput from "@/components/VFormInput.vue";
import ApiService from "@/services/api.service";
import { AuthService } from "@/services/services/Auth.service";
import { useAdapter } from "@/utils/useAdapter";
import { SubmitEventPromise } from "@/VFormControls/composables/useForm";
import VForm from "@/VFormControls/vForm/VForm.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { EyeIcon, EyeOffIcon } from "vue-tabler-icons";

const { setAdapter } = useAdapter();

const router = useRouter();

const signModel = ref({
  userName: "",
  password: "",
});

const isPassword = ref(false);
const loading = ref<boolean>(false);
const isRemember = ref<boolean>(false);
const submit = async (submit: SubmitEventPromise) => {
  const { valid } = await submit;
  if (loading.value) return;

  if (valid) {
    loading.value = true;
    AuthService.SignIn(signModel.value)
      .then((res) => {
        setAdapter(
          "token",
          res.data.token,
          isRemember.value ? "local" : "session"
        );

        ApiService.setHeader();

        router.push("/main");
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-inner">
      <div class="image">
        <!-- <img src="@/assets/logo.png" alt="" /> -->
      </div>
      <div class="content">
        <div class="content-inner">
          <h2>{{ $t("auth") }}</h2>

          <VForm @submit.prevent="submit">
            <div class="mt-4">
              <FormInput
                :label="$t('userName')"
                v-model="signModel.userName"
                required
              >
              </FormInput>
            </div>
            <div class="mt-4">
              <VFormInput
                :type="isPassword ? 'text' : 'password'"
                :label="$t('password')"
                v-model="signModel.password"
              >
                <template #append>
                  <div @click="isPassword = !isPassword" class="cursor-pointer">
                    <EyeOffIcon v-if="isPassword" />
                    <EyeIcon v-else />
                  </div>
                </template>
              </VFormInput>
            </div>

            <div class="mt-4">
              <FormCheckbox v-model="isRemember" :label="$t('checkbox')">
              </FormCheckbox>
            </div>

            <VButton
              type="submit"
              :loading="loading"
              block
              class="text-white mt-4 bg-primary"
            >
              {{ $t("SignIn") }}
            </VButton>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-wrapper {
  display: flex;
  min-height: 100vh;
  min-height: calc(var(--vh, 1vh) * 100);
  width: 100%;

  .auth-inner {
    display: flex;
    align-items: center;
    width: 100%;
    overflow-y: auto; // For v2 scroll for long auth form
    height: calc(var(--vh, 1vh) * 100);
  }

  .brand-logo {
    position: absolute;
    top: 2rem;
    left: 2rem;
    margin: 0;
    z-index: 1;
  }

  .image {
    flex: 3;
  }

  .content {
    flex: 1;
    background-color: #fff;
    height: 100vh;
    &-inner {
      width: 90%;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      flex-direction: column;
      height: 100%;
    }
  }
}
</style>
