<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { AttemptsReportService } from "@/services/services/AttemptsReport.service";
import { notify } from "@kyvg/vue3-notification";
import UiParentCard from "@/components/UiParentCard.vue";

const router = useRouter();

const attempts = ref<any[]>([]);
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
    const response = await AttemptsReportService.GetUsersAttemptsReport({
      page: filter.value.page,
      size: filter.value.size,
      search: filter.value.search || "",
      testTypeId: 4,
    });

    const data = response.data;

    // API returns { data: [...], page, size, totalCount, totalPages }
    if (data.data && Array.isArray(data.data)) {
      attempts.value = data.data;
    } else if (data.items && Array.isArray(data.items)) {
      attempts.value = data.items;
    } else if (Array.isArray(data)) {
      attempts.value = data;
    }

    totalPages.value = data.totalPages || Math.ceil((data.totalCount || 0) / filter.value.size) || 1;
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

const handleClear = () => {
  filter.value.search = "";
  filter.value.page = 1;
  fetchAttempts();
};

const handlePageChange = (page: number) => {
  filter.value.page = page;
  fetchAttempts();
};

const viewDetails = (userId: number) => {
  router.push({ name: "ExamResultDetails", params: { userId } });
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
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
    <div class="page-header">
      <h2 class="page-title">Imtihon natijalari</h2>
    </div>

    <div class="search-row">
        <v-text-field
          v-model="filter.search"
          placeholder="Foydalanuvchi ismi yoki email bo'yicha qidirish..."
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
          class="search-input"
          @input="handleSearch"
          @click:clear="handleClear"
        >
          <template v-slot:prepend-inner>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </template>
        </v-text-field>
    </div>

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

      <!-- Desktop Table -->
      <div class="attempts-table desktop-only">
        <table>
          <thead>
            <tr>
              <th>Foydalanuvchi</th>
              <th>Jami urinishlar</th>
              <th>O'tgan</th>
              <th>Yiqilgan</th>
              <th>Oxirgi urinish</th>
              <th>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="attempt in attempts" :key="attempt.userId">
              <td class="user-cell">
                <div class="user-avatar">
                  {{ (attempt.fullName || attempt.userName || '?').charAt(0).toUpperCase() }}
                </div>
                <div class="user-info">
                  <span class="user-name">{{ attempt.fullName || attempt.userName }}</span>
                  <span class="user-email">@{{ attempt.userName }}</span>
                </div>
              </td>
              <td>
                <div class="score-badge total-badge">
                  {{ attempt.totalAttempts }}
                </div>
              </td>
              <td>
                <div class="score-badge correct-badge">
                  {{ attempt.passedAttempts }}
                </div>
              </td>
              <td>
                <div class="score-badge incorrect-badge">
                  {{ attempt.failedAttempts }}
                </div>
              </td>
              <td class="date-cell">{{ formatDate(attempt.lastAttemptDate) }}</td>
              <td>
                <button class="view-btn" @click="viewDetails(attempt.userId)">
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

      <!-- Mobile Cards -->
      <div class="mobile-cards mobile-only">
        <div
          v-for="attempt in attempts"
          :key="'m-' + attempt.userId"
          class="mobile-card"
          @click="viewDetails(attempt.userId)"
        >
          <div class="mobile-card-header">
            <div class="user-cell">
              <div class="user-avatar">
                {{ (attempt.fullName || attempt.userName || '?').charAt(0).toUpperCase() }}
              </div>
              <div class="user-info">
                <span class="user-name">{{ attempt.fullName || attempt.userName }}</span>
                <span class="user-email">@{{ attempt.userName }}</span>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div class="mobile-card-stats">
            <div class="mobile-stat">
              <span class="mobile-stat-label">Jami</span>
              <div class="score-badge total-badge">{{ attempt.totalAttempts }}</div>
            </div>
            <div class="mobile-stat">
              <span class="mobile-stat-label">O'tgan</span>
              <div class="score-badge correct-badge">{{ attempt.passedAttempts }}</div>
            </div>
            <div class="mobile-stat">
              <span class="mobile-stat-label">Yiqilgan</span>
              <div class="score-badge incorrect-badge">{{ attempt.failedAttempts }}</div>
            </div>
          </div>
          <div class="mobile-card-footer">
            <span class="mobile-date">{{ formatDate(attempt.lastAttemptDate) }}</span>
          </div>
        </div>
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
  overflow-x: hidden;
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
    font-size: 14px;
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

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-weight: 600;
  color: #1F2937;
}

.user-email {
  font-size: 12px;
  color: #9CA3AF;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #5D87FF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.score-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;

  &.total-badge {
    background: #EEF2FF;
    color: #5D87FF;
  }

  &.correct-badge {
    background: #D1FAE5;
    color: #10B981;
  }

  &.incorrect-badge {
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
  border: none;
  border-radius: 8px;
  color: #5D87FF;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #EEF2FF;
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
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #F9FAFB;

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
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F9FAFB;
    color: #5D87FF;
  }

  &.active {
    background: #5D87FF;
    color: white;
  }
}

// Mobile cards
.mobile-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-card {
  background: #F9FAFB;
  border-radius: 14px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #F3F4F6;
  }
}

.mobile-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.mobile-card-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.mobile-stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  background: white;
  border-radius: 10px;
}

.mobile-stat-label {
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.mobile-card-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.mobile-date {
  font-size: 12px;
  color: #9CA3AF;
}

// Visibility toggles
.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

// Responsive
@media (max-width: 768px) {
  .page-title {
    font-size: 20px;
  }

  .page-header {
    margin-bottom: 16px;
  }

  .search-row {
    margin-bottom: 12px;
  }

  .mobile-only {
    display: flex;
  }

  .desktop-only {
    display: none;
  }

  .score-badge {
    min-width: 36px;
    padding: 5px 10px;
    font-size: 13px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-email {
    font-size: 11px;
  }

  .pagination-container {
    padding: 16px 8px 4px;
  }

  .pagination-btn,
  .pagination-page {
    min-width: 32px;
    height: 32px;
    font-size: 13px;
  }
}
</style>
