<script setup lang="ts">
import { ref, toRefs } from "vue";
import { ICategoryAttemp, MyCategories } from "../types";
import { useFormatter } from "@/utils/formatter";

interface IProps {
  category: MyCategories;
  count: number;
}
const props = defineProps<IProps>();
const { category } = toRefs(props);

const { secondsToHms } = useFormatter();
const attemp = ref<ICategoryAttemp | null>(null);

const timer_interval = ref<number | undefined>();
const timer = ref(60);

const clearTimer = () => clearInterval(timer_interval.value);

const refreshTimer = () => {
  clearTimer();

  timer_interval.value = setInterval(() => {
    if (timer.value === 0) {
      clearTimer();
      return;
    }

    timer.value--;
  }, 1000);
};

refreshTimer();
</script>

<template>
  <v-card class="bg-background">
    <v-card-title class="pa-0 ma-8">
      <v-toolbar color="info" class="px-8 py-4 bg-gradient rounded-lg">
        <div class="test-header">
          <div class="left-collar">
            <div class="img">
              <img src="@/assets/images/testIcon.png" alt="" />
            </div>
            <h5>{{ category.name }}</h5>
          </div>

          <div class="right-collar">
            <div class="icon">
              <img src="@/assets/images/testTimer.png" alt="" />
            </div>
            {{ secondsToHms(timer) }}
          </div>
        </div>
      </v-toolbar>
    </v-card-title>

    <v-card-text class="bg-light">
      <v-slide-group show-arrows>
        <v-slide-group-item v-for="n in 5" :key="n" icon>
          <div class="d-flex align-center">
            <button class="btn">
              <span>{{ n }}</span>
            </button>
            <div class="divider" v-if="i + 1 !== data?.questionCount"></div>
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(91.88deg, #0e449b 0%, #4284eb 100%);
}
.test-header {
  display: flex;
  justify-content: space-between;
  width: 100%;

  .left-collar {
    display: flex;
    align-items: center;
    gap: 10px;
    .img {
      width: 40px;
      height: 40px;
      background-color: rgb(var(--v-theme-background));
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      img {
        width: 27px;
        height: 27px;
      }
    }
  }

  .right-collar {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    .icon {
      width: 2.5625rem;
      height: 2.5625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      img {
        width: 1.5625rem;
        height: 1.5625rem;
      }

      background-color: rgb(var(--v-theme-background));
    }
  }
}

.btn {
  flex: 0 0 2rem;
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(var(--v-theme-background));
  border-radius: 50%;
  border: 1px solid;
  span {
    padding: 4px;
    width: 90%;
    height: 90%;
  }
}
.divider {
  width: 11px;
  height: 0.0625rem;
  background: rgb(var(--v-theme-background));
  margin: 32px 0;
}

// .counts {
//   display: flex;
//   text-align: center;
//   .counts-inner {
//     display: flex;
//     margin: 0 auto;
//     overflow-x: auto;
//   }
//   .item {
//     display: flex;
//     align-items: center;
//     .divider {
//       flex: 0 0 1.125rem;
//       width: 1.125rem;
//       padding: 0;
//     }
//     .btn-outline {
//       border: 0.0625rem solid;
//       border-radius: 50%;
//       flex: 0 0 2.5rem;
//       width: 2.5rem;
//       height: 2.5rem;
//       flex: 0 0 2.5rem;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }
//     :deep().btn {
//       flex: 0 0 2rem;
//       width: 2rem;
//       height: 2rem;
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       span {
//         color: var(--secondary-light) !important;
//       }

//       &.active {
//         background: var(--bar-card-active-bg-color) !important;
//       }
//       &.less {
//         background: var(--success) !important;
//       }
//       &.pass {
//         background: var(--error) !important;
//       }
//     }
//   }
// }
</style>
