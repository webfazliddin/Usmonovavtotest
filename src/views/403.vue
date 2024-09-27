<template>
  <div class="d-flex justify-center align-center text-center h-100">
    <div class="d-flex flex-column">
      <img src="@/assets/images/403.svg" width="500" alt="404" />
      <v-btn flat color="success" class="mb-4" to="/">
        <svg class="mr-2" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.49992 14.6667H10.4999C13.8333 14.6667 15.1666 13.3333 15.1666 10V6C15.1666 2.66667 13.8333 1.33334 10.4999 1.33334H6.49992C3.16659 1.33334 1.83325 2.66667 1.83325 6V10C1.83325 13.3333 3.16659 14.6667 6.49992 14.6667Z"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M6.50018 10.2533H9.78018C10.9135 10.2533 11.8335 9.33334 11.8335 8.2C11.8335 7.06667 10.9135 6.14667 9.78018 6.14667H5.26685"
            stroke="white"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path d="M6.21341 7.18L5.16675 6.12667L6.21341 5.08" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        {{ $t("goHome") }}
      </v-btn>
    </div>
  </div>
</template>
