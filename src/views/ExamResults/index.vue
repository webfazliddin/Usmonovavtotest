<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { AttemptsReportService } from "@/services/services/AttemptsReport.service";
import { notify } from "@kyvg/vue3-notification";
import { IAttemptReport } from "@/features/Exam/types";
import UiParentCard from "@/components/UiParentCard.vue";

const router = useRouter();

const attempts = ref<IAttemptReport[]>([]);
const loading = ref(false);
const filter = ref({
  page: 1,
  size: 10,
  search: "",
});
const totalPages = ref(0);

let searchTimeout: NodeJS.Timeout | null = null;

const fetchAttempts = async () => {
  loading.value = true;
  try {
    const { data } = await AttemptsReportService.GetUsersAttemptsReport({
      page: filter.value.page,
      size: filter.value.size,
      search: filter.value.search,
    });
    attempts.value = data.items || [];
    totalPages.value = data.totalPages || 0;
  } catch (error: any) {
    notify({
      text: error.response?.data?.message || "Ma'lumotlarni yuklashda xatolik yuz berdi",
      type: "error",
    });
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    filter.value.page = 1;
    fetchAttempts();
  }, 500);
};

const handlePageChange = (page: number) => {
  filter.value.page = page;
  fetchAttempts();
};

const viewDetails = (attemptId: number) => {
  router.push({ name: "ExamResultDetails", params: { attemptId } });
};

const getStatusClass = (percentage: number) => {
  return percentage >= 90 ? "status-passed" : "status-failed";
};

const getStatusText = (percentage: number) => {
  return percentage >= 90 ? "O'tdi" : "O'tmadi";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchAttempts();
});
</script>

<template>
  <div class="admin-page-container">
    <v-row class="page-header">
      <v-col md="6" cols="12" class="header-left">
        <h2 class="page-title">Imtihon natijalari</h2>
      </v-col>
    </v-row>

    <v-row class="search-row">
      <v-col cols="12">
        <v-text-field
          v-model="filter.search"
          placeholder="Foydalanuvchi ismi yoki email bo'yicha qidirish..."
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          @input="handleSearch"
          class="search-input"
        >
          <template v-slot:prepend-inner>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </template>
        </v-text-field>
      </v-col>
    </v-row>

    <UiParentCard>
      <div v-if="loading" class="loading-container">
        <v-progress-circular indeterminate color="primary" :size="50"></v-progress-circular>
      </div>

      <div v-else-if="attempts.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 11H15M9 15H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-linecap="round"/>
        </svg>
        <p>Hozircha imtihon natijalari yo'q</p>
      </div>

      <div v-else class="attempts-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Foydalanuvchi</th>
              <th>Email</th>
              <th>Test turi</th>
              <th>To'g'ri javoblar</th>
              <th>Foiz</th>
              <th>Status</th>
              <th>Sana</th>
              <th>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attempt in attempts" :key="attempt.id">
              <td>{{ attempt.attemptId }}</td>
              <td class="user-cell">
                <div class="user-avatar">
                  {{ attempt.userName.charAt(0).toUpperCase() }}
                </div>
                <span>{{ attempt.userName }}</span>
              </td>
              <td>{{ attempt.userEmail }}</td>
              <td>
                <div class="test-type-badge">
                  {{ attempt.testType }}
                </div>
              </td>
              <td>
                <div class="score-cell">
                  <span class="correct">{{ attempt.correctAnswers }}</span>
                  <span class="separator">/</span>
                  <span class="total">{{ attempt.totalQuestions }}</span>
                </div>
              </td>
              <td>
                <div class="percentage-badge" :class="getStatusClass(attempt.percentage)">
                  {{ attempt.percentage }}%
                </div>
              </td>
              <td>
                <div class="status-badge" :class="getStatusClass(attempt.percentage)">
                  {{ getStatusText(attempt.percentage) }}
                </div>
              </td>
              <td class="date-cell">{{ formatDate(attempt.completedAt) }}</td>
              <td>
                <button class="view-btn" @click="viewDetails(attempt.attemptId)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Ko'rish
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination-container">
        <button
          class="pagination-btn"
          :disabled="filter.page === 1"
          @click="handlePageChange(filter.page - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="pagination-pages">
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination-page"
            :class="{ active: filter.page === page }"
            @click="handlePageChange(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          :disabled="filter.page === totalPages"
          @click="handlePageChange(filter.page + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </UiParentCard>
  </div>
</template>

<style lang="scss" scoped>
.admin-page-container {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
}

.search-row {
  margin-bottom: 20px;
}

.search-input {
  font-family: 'Poppins', sans-serif;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9CA3AF;

  svg {
    margin-bottom: 16px;
  }

  p {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
  }
}

.attempts-table {
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Poppins', sans-serif;
  }

  thead {
    background: #F9FAFB;
    border-bottom: 2px solid #E5E7EB;

    th {
      padding: 16px 12px;
      text-align: left;
      font-size: 13px;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #E5E7EB;
      transition: background-color 0.2s ease;

      &:hover {
        background: #F9FAFB;
      }
    }

    td {
      padding: 16px 12px;
      font-size: 14px;
      color: #1F2937;
    }
  }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5D87FF 0%, #4A7FCC 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.test-type-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #F3E8FF;
  color: #7C3AED;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.score-cell {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;

  .correct {
    color: #10B981;
  }

  .separator {
    color: #9CA3AF;
  }

  .total {
    color: #6B7280;
  }
}

.percentage-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;

  &.status-passed {
    background: #D1FAE5;
    color: #10B981;
  }

  &.status-failed {
    background: #FEE2E2;
    color: #EF4444;
  }
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;

  &.status-passed {
    background: #D1FAE5;
    color: #10B981;
  }

  &.status-failed {
    background: #FEE2E2;
    color: #EF4444;
  }
}

.date-cell {
  color: #6B7280;
  font-size: 13px;
  white-space: nowrap;
}

.view-btn {
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  color: #5D87FF;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #EEF2FF;
    border-color: #5D87FF;
  }

  svg {
    flex-shrink: 0;
  }
}

.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px 8px;
  margin-top: 20px;
  border-top: 1px solid #E5E7EB;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #F9FAFB;
    border-color: #5D87FF;

    svg {
      color: #5D87FF;
    }
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    color: #6B7280;
  }
}

.pagination-pages {
  display: flex;
  gap: 6px;
}

.pagination-page {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F9FAFB;
    border-color: #5D87FF;
    color: #5D87FF;
  }

  &.active {
    background: #5D87FF;
    border-color: #5D87FF;
    color: white;
  }
}

// Responsive
@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }

  .attempts-table {
    table {
      font-size: 12px;
    }

    thead th {
      padding: 12px 8px;
      font-size: 11px;
    }

    tbody td {
      padding: 12px 8px;
      font-size: 12px;
    }
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .view-btn {
    padding: 6px 12px;
    font-size: 12px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
}
</style>
