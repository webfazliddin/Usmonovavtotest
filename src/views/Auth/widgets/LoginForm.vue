<script setup lang="ts">
import { useUserStore } from "@/app/config/layouts/store/user";
import ApiService from "@/services/api.service";
import { AuthService } from "@/services/services/Auth.service";
import { useAdapter } from "@/utils/useAdapter";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type { SubmitEventPromise } from "vuetify";

const { setAdapter } = useAdapter();
const router = useRouter();
const userStore = useUserStore();
const isPasswordVisible = ref(false);
const loading = ref(false);
const isRemember = ref(false);
const signModel = ref({ userName: "", password: "" });

const submit = async (submitEvent: SubmitEventPromise) => {
  const { valid } = await submitEvent;
  if (!valid) return;

  loading.value = true;
  try {
    const { data } = await AuthService.SignIn(signModel.value);
    const storage = isRemember.value ? "local" : "session";

    await Promise.all([
      setAdapter("token", data.token, storage),
      setAdapter("isAdmin", data.isAdmin, storage),
    ]);

    userStore.setIsAdmin(data.isAdmin);
    ApiService.setHeader();
    await router.push({ name: "MyCategories" });
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-form @submit.prevent="submit" class="login-form">
    <div class="form-group">
      <label class="form-label">{{ $t('userName') || 'Foydalanuvchi nomi' }}</label>
      <v-text-field
        v-model="signModel.userName"
        type="text"
        placeholder="Foydalanuvchi nomingizni kiriting"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        required
        class="custom-input"
      >
        <template #prepend-inner>
          <v-icon color="#757575" size="20">mdi-account-outline</v-icon>
        </template>
      </v-text-field>
    </div>

    <div class="form-group">
      <label class="form-label">{{ $t('password') || 'Parol' }}</label>
      <v-text-field
        v-model="signModel.password"
        :type="isPasswordVisible ? 'text' : 'password'"
        placeholder="Parolingizni kiriting"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        required
        class="custom-input"
      >
        <template #prepend-inner>
          <v-icon color="#757575" size="20">mdi-lock-outline</v-icon>
        </template>
        <template #append-inner>
          <v-icon
            @click="isPasswordVisible = !isPasswordVisible"
            class="cursor-pointer"
            color="#757575"
            size="20"
          >
            {{ isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}
          </v-icon>
        </template>
      </v-text-field>
    </div>

    <div class="form-options">
      <v-checkbox v-model="isRemember" hide-details density="compact" class="remember-checkbox">
        <template #label>
          <span class="checkbox-label">{{ $t('isRemember') || 'Eslab qolish' }}</span>
        </template>
      </v-checkbox>
    </div>

    <v-btn type="submit" variant="flat" size="large" block :loading="loading" class="submit-btn">
      {{ $t("signIn") || "Kirish" }}
    </v-btn>
  </v-form>
</template>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 20px;
  }
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #424242;
  margin-bottom: 8px;
}

.custom-input :deep(.v-field) {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
    border-color: #bdbdbd;
  }

  &.v-field--focused {
    background: #fff;
    border-color: #673ab7;
    box-shadow: 0 0 0 3px rgba(103, 58, 183, 0.1);
  }

  .v-field__input {
    padding: 12px 16px;
    min-height: 48px;

    &::placeholder {
      color: #9e9e9e;
    }
  }

  .v-field__prepend-inner {
    padding-left: 12px;
  }

  .v-field__append-inner {
    padding-right: 12px;
  }
}

.form-options {
  margin-bottom: 28px;
}

.remember-checkbox {
  :deep(.v-selection-control) {
    min-height: auto;
  }

  :deep(.v-selection-control--dirty .v-icon) {
    color: #673ab7;
  }

  .checkbox-label {
    font-size: 14px;
    color: #616161;
    margin-left: 8px;
  }
}

.submit-btn {
  height: 54px !important;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #673ab7, #5c6bc0) !important;
  box-shadow: 0 8px 24px rgba(103, 58, 183, 0.3);
  transition: all 0.3s;
  color: #fff;

  &:hover {
    box-shadow: 0 12px 32px rgba(103, 58, 183, 0.4);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Responsive Design
// Desktop (1024px+)
@media (min-width: 1024px) {
  .custom-input {
    :deep(.v-field__input) {
      font-size: 15px;
    }
  }
}

// Tablet (768px - 1023px)
@media (min-width: 768px) and (max-width: 1023px) {
  .form-group {
    margin-bottom: 22px;

    &:last-of-type {
      margin-bottom: 18px;
    }
  }

  .form-label {
    font-size: 13.5px;
  }

  .custom-input {
    :deep(.v-field__input) {
      min-height: 46px;
      font-size: 14px;
    }
  }

  .submit-btn {
    height: 52px !important;
    font-size: 15px;
  }
}

// Mobile Landscape (600px - 767px)
@media (min-width: 600px) and (max-width: 767px) {
  .form-group {
    margin-bottom: 20px;

    &:last-of-type {
      margin-bottom: 18px;
    }
  }

  .form-label {
    font-size: 13px;
  }

  .custom-input {
    :deep(.v-field__input) {
      min-height: 46px;
      padding: 11px 14px;
      font-size: 14px;
    }

    :deep(.v-field__prepend-inner),
    :deep(.v-field__append-inner) {
      padding: 0 10px;
    }
  }

  .form-options {
    margin-bottom: 24px;
  }

  .submit-btn {
    height: 50px !important;
    font-size: 15px;
  }
}

// Mobile Portrait (480px - 599px)
@media (min-width: 480px) and (max-width: 599px) {
  .form-group {
    margin-bottom: 18px;

    &:last-of-type {
      margin-bottom: 16px;
    }
  }

  .form-label {
    font-size: 13px;
    margin-bottom: 7px;
  }

  .custom-input {
    :deep(.v-field) {
      border-radius: 10px;
    }

    :deep(.v-field__input) {
      min-height: 45px;
      padding: 10px 14px;
      font-size: 14px;
    }

    :deep(.v-field__prepend-inner) {
      padding-left: 10px;

      .v-icon {
        font-size: 19px;
      }
    }

    :deep(.v-field__append-inner) {
      padding-right: 10px;

      .v-icon {
        font-size: 19px;
      }
    }
  }

  .form-options {
    margin-bottom: 22px;
  }

  .remember-checkbox {
    .checkbox-label {
      font-size: 13px;
      margin-left: 6px;
    }
  }

  .submit-btn {
    height: 48px !important;
    font-size: 15px;
    border-radius: 10px;
  }
}

// Mobile Portrait (< 480px)
@media (max-width: 479px) {
  .form-group {
    margin-bottom: 18px;

    &:last-of-type {
      margin-bottom: 16px;
    }
  }

  .form-label {
    font-size: 13px;
    margin-bottom: 6px;
  }

  .custom-input {
    :deep(.v-field) {
      border-radius: 10px;
    }

    :deep(.v-field__input) {
      min-height: 44px;
      padding: 10px 12px;
      font-size: 14px;

      &::placeholder {
        font-size: 13px;
      }
    }

    :deep(.v-field__prepend-inner) {
      padding-left: 10px;

      .v-icon {
        font-size: 18px;
      }
    }

    :deep(.v-field__append-inner) {
      padding-right: 10px;

      .v-icon {
        font-size: 18px;
      }
    }
  }

  .form-options {
    margin-bottom: 22px;
  }

  .remember-checkbox {
    .checkbox-label {
      font-size: 13px;
      margin-left: 4px;
    }

    :deep(.v-checkbox .v-selection-control__input) {
      .v-icon {
        font-size: 20px;
      }
    }
  }

  .submit-btn {
    height: 48px !important;
    font-size: 14px;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(103, 58, 183, 0.3);

    &:hover {
      box-shadow: 0 8px 24px rgba(103, 58, 183, 0.4);
      transform: translateY(-1px);
    }
  }
}

// Extra Small Mobile (< 360px)
@media (max-width: 359px) {
  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    font-size: 12px;
  }

  .custom-input {
    :deep(.v-field__input) {
      min-height: 42px;
      padding: 9px 10px;
      font-size: 13px;

      &::placeholder {
        font-size: 12px;
      }
    }
  }

  .remember-checkbox .checkbox-label {
    font-size: 12px;
  }

  .submit-btn {
    height: 46px !important;
    font-size: 14px;
  }
}
</style>