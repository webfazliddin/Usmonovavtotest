<script setup lang="ts">
import { computed, toRefs } from "vue";
import { CardTestResult } from "../Test/types";

interface IProps {
  data: CardTestResult | null;
}

const props = defineProps<IProps>();

const { data } = toRefs(props);

const result = computed(() => {
  return (
    data.value &&
    (data.value?.correctAnswerCount / data.value?.questionsCount) * 100
  );
});

const emits = defineEmits(["returnToLessons", "loolResult"]);
</script>

<template>
  <v-card>
    <v-card-title class="text-center">
      <v-avatar size="85">
        <img
          class="card-page"
          src="@/assets/images/testCount.png"
          width="85"
          alt="card"
        />
      </v-avatar>
    </v-card-title>

    <v-card-text>
      <div>
        <div style="width: 100%; display: flex">
          <table cellspacing="0" style="width: 100%">
            <tr class="header">
              <th>{{ $t("allQuestionCount") }}</th>
              <th>{{ $t("correctAnswerCount") }}</th>
              <th>{{ $t("result") }}</th>
            </tr>
            <tr>
              <td>{{ data?.questionsCount }}</td>
              <td class="correct">{{ data?.correctAnswerCount }}</td>
              <td>{{ result }}%</td>
            </tr>
          </table>
        </div>
        <div class="d-flex align-center">
          <v-btn
            class="mt-4 text-center mx-auto"
            :text="$t('returnToLessons')"
            color="success"
            @click="emits('returnToLessons')"
          />
          <v-btn
            class="mt-4 text-center mx-auto"
            :text="$t('lookResult')"
            color="info"
            @click="emits('loolResult', data?.attemptId)"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
table {
  tr {
    background: #c8ffdb;
  }
  .header {
    background: linear-gradient(91.88deg, #0e449b 0%, #4284eb 100%);
    --oquv-kurslari-card-bg-shadow: 0px 2px 4px 0px #2964c21a,
      -1px 6px 6px 0px #2964c217, -3px 14px 9px 0px #2964c20d,
      -5px 25px 10px 0px #2964c203, -8px 39px 11px 0px #2964c200;

    color: rgb(var(--v-theme-light));
    border-radius: 0.5rem;
  }
  td {
    color: #2964c2;
    text-align: center;
  }
  .correct {
    color: rgb(var(--v-theme-success)) !important;
  }

  th,
  td {
    color: var(--secondary-light);
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
  }
}
</style>
