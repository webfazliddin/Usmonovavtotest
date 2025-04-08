<script setup lang="ts">
import CardResultModal from "@/features/Result/CardResultModal.vue";
import CardTest from "@/features/Test/CardTest.vue";
import { CardTestResult } from "@/features/Test/types";
import { CardService } from "@/services/services/Cards.service";
import { setError } from "@/utils/helpers";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loading = ref(false);
const isResult = ref(false);
const result = ref<CardTestResult | null>(null);
const attemptId = ref<number | null>(null);

const showResult = (val: number) => {
  loading.value = true;
  attemptId.value = val;
  CardService.DefaultResult(val)
    .then((res) => {
      isResult.value = true;
      result.value = res.data;
    })
    .catch((e) => {
      setError(e);
    })
    .finally(() => {
      loading.value = false;
    });
};

const loolResult = () => {
  router.push({
    name: "CardResultPage",
    params: { attemptId: attemptId.value },
  });
};
const returnToLessons = () => {
  isResult.value = false;
  router.push({
    name: "Card",
  });
};
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>{{ $t("CardTest") }}</h1>
      </v-card-title>
      <v-card-text>
        <CardTest @show-result="showResult" />

        <v-dialog width="600" v-model:model-value="isResult">
          <CardResultModal
            :data="result"
            @lool-result="loolResult"
            @return-to-lessons="returnToLessons"
          />
        </v-dialog>
      </v-card-text>
    </v-card>
  </div>
</template>

<style lang="scss" scoped></style>
