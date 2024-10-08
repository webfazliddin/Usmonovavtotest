<script setup lang="ts">
import VIcon from "@/components/VIcon.vue";
import { MailIcon, PhoneIcon, WorldIcon } from "vue-tabler-icons";
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="left-collar">
        <div class="logo">
          <img src="@/assets/logo.svg" alt="" />
          <p >{{ $t("logo") }}</p>
        </div>
        <div class="social-networks">
          <VIcon bg="var(--secondary-light)" :rounded="false">
            <svg
              width="1rem"
              height="0.9375rem"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15.6495 7.45059C15.6495 11.5393 12.2241 14.8543 7.99932 14.8543C3.7745 14.8543 0.349121 11.5393 0.349121 7.45059C0.349121 3.36189 3.7745 0.046875 7.99932 0.046875C12.2241 0.046875 15.6495 3.36189 15.6495 7.45059ZM8.27346 5.51267C7.52947 5.8119 6.04215 6.43196 3.81211 7.37223C3.45 7.51167 3.26002 7.64802 3.24281 7.78129C3.21348 8.0071 3.50547 8.09595 3.902 8.21626C3.95619 8.23291 4.01229 8.24957 4.06967 8.26808C4.46047 8.39086 4.98578 8.53461 5.25864 8.54017C5.50663 8.5451 5.78331 8.44639 6.08869 8.24402C8.17209 6.88235 9.24758 6.19442 9.31516 6.17962C9.36297 6.16913 9.42927 6.15556 9.4739 6.19442C9.51853 6.23268 9.51406 6.30548 9.5096 6.32522C9.48027 6.4443 8.33657 7.47403 7.74368 8.0071C7.5588 8.17307 7.42811 8.29091 7.40133 8.31806C7.34141 8.3779 7.2802 8.43528 7.22155 8.49019C6.85817 8.8283 6.58659 9.08249 7.23685 9.4971C7.54924 9.69638 7.79914 9.86111 8.04841 10.0252C8.32063 10.2048 8.59221 10.3837 8.94412 10.607C9.03337 10.6638 9.1188 10.7224 9.20232 10.7798C9.51916 10.9988 9.80413 11.195 10.156 11.1642C10.36 11.1457 10.5717 10.9599 10.6788 10.4053C10.9319 9.0936 11.4304 6.25304 11.5458 5.08202C11.5529 4.98479 11.5486 4.88711 11.5331 4.7908C11.5238 4.71302 11.4847 4.64145 11.4234 4.59029C11.3323 4.5181 11.1907 4.50268 11.127 4.50391C10.8395 4.50885 10.3983 4.65754 8.27346 5.51267Z"
                fill="var(--bar-background-color)"
              />
            </svg>
          </VIcon>
          <VIcon bg="var(--secondary-light)" :rounded="false">
            <svg
              width="1.0625rem"
              height="0.9375rem"
              viewBox="0 0 17 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.49678 4.98163C7.09204 4.98163 5.94567 6.09109 5.94567 7.45059C5.94567 8.81009 7.09204 9.91954 8.49678 9.91954C9.90151 9.91954 11.0479 8.81009 11.0479 7.45059C11.0479 6.09109 9.90151 4.98163 8.49678 4.98163ZM16.1482 7.45059C16.1482 6.42818 16.1578 5.41504 16.0984 4.39449C16.0391 3.2091 15.7597 2.15706 14.864 1.29024C13.9664 0.421566 12.8813 0.153 11.6565 0.0955826C10.6001 0.038165 9.5532 0.0474259 8.49869 0.0474259C7.44227 0.0474259 6.39542 0.038165 5.34091 0.0955826C4.11607 0.153 3.02903 0.423418 2.13337 1.29024C1.23579 2.15891 0.958289 3.2091 0.898961 4.39449C0.839633 5.41689 0.849202 6.43004 0.849202 7.45059C0.849202 8.47114 0.839633 9.48613 0.898961 10.5067C0.958289 11.6921 1.23771 12.7441 2.13337 13.6109C3.03094 14.4796 4.11607 14.7482 5.34091 14.8056C6.39733 14.863 7.44418 14.8538 8.49869 14.8538C9.55511 14.8538 10.602 14.863 11.6565 14.8056C12.8813 14.7482 13.9684 14.4778 14.864 13.6109C15.7616 12.7423 16.0391 11.6921 16.0984 10.5067C16.1597 9.48613 16.1482 8.47299 16.1482 7.45059ZM8.49678 11.2494C6.32461 11.2494 4.57156 9.55281 4.57156 7.45059C4.57156 5.34836 6.32461 3.65177 8.49678 3.65177C10.6689 3.65177 12.422 5.34836 12.422 7.45059C12.422 9.55281 10.6689 11.2494 8.49678 11.2494ZM12.5828 4.38338C12.0756 4.38338 11.666 3.98701 11.666 3.49618C11.666 3.00536 12.0756 2.60899 12.5828 2.60899C13.0899 2.60899 13.4995 3.00536 13.4995 3.49618C13.4996 3.61273 13.476 3.72817 13.43 3.83587C13.384 3.94358 13.3165 4.04144 13.2313 4.12385C13.1462 4.20626 13.045 4.27161 12.9337 4.31614C12.8225 4.36068 12.7032 4.38352 12.5828 4.38338Z"
                fill="var(--bar-background-color)"
              />
            </svg>
          </VIcon>
          <VIcon bg="var(--secondary-light)" :rounded="false">
            <svg
              width="1rem"
              height="0.9375rem"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.40578 8.60228H3.39122C3.1859 7.84734 3.1859 7.05383 3.39122 6.2989H5.40578C5.35337 6.68078 5.32498 7.06538 5.32078 7.45059C5.32498 7.8358 5.35337 8.2204 5.40578 8.60228ZM3.88424 5.14721H5.61828C5.81658 4.43663 6.09598 3.74962 6.45131 3.09885C5.36697 3.45727 4.45449 4.18537 3.88424 5.14721ZM12.1125 5.14721C11.5377 4.18581 10.6228 3.45821 9.53689 3.09885C9.89711 3.7465 10.174 4.43441 10.3614 5.14721M7.99835 12.0327C8.50345 11.338 8.88818 10.5684 9.13738 9.75397H6.85932C7.10852 10.5684 7.49324 11.338 7.99835 12.0327ZM7.99835 2.86029C7.49281 3.55764 7.10809 4.33008 6.85932 5.14721H9.13738C8.88861 4.33008 8.50389 3.55764 7.99835 2.86029ZM3.88424 9.75397C4.45807 10.7129 5.36926 11.4399 6.45131 11.8023C6.09598 11.1516 5.81658 10.4645 5.61828 9.75397M15.6485 1.69214V13.209C15.6485 13.6454 15.4694 14.0639 15.1506 14.3724C14.8318 14.681 14.3994 14.8543 13.9485 14.8543H2.04819C1.59731 14.8543 1.1649 14.681 0.846076 14.3724C0.527256 14.0639 0.348145 13.6454 0.348145 13.209V1.69214C0.348145 1.25579 0.527256 0.837311 0.846076 0.528763C1.1649 0.220215 1.59731 0.046875 2.04819 0.046875H13.9485C14.3994 0.046875 14.8318 0.220215 15.1506 0.528763C15.4694 0.837311 15.6485 1.25579 15.6485 1.69214ZM13.9485 7.45059C13.9485 6.31168 13.5995 5.19834 12.9457 4.25137C12.2919 3.3044 11.3626 2.56632 10.2754 2.13048C9.18812 1.69464 7.99175 1.5806 6.83753 1.80279C5.68331 2.02498 4.62309 2.57342 3.79095 3.37875C2.95881 4.18409 2.39211 5.21014 2.16252 6.32717C1.93293 7.4442 2.05076 8.60203 2.50112 9.65425C2.95147 10.7065 3.71412 11.6058 4.69262 12.2386C5.67111 12.8713 6.82152 13.209 7.99835 13.209C9.57643 13.209 11.0899 12.6023 12.2057 11.5224C13.3216 10.4425 13.9485 8.97782 13.9485 7.45059ZM10.6759 7.45059C10.6717 7.8358 10.6433 8.2204 10.5909 8.60228H12.6055C12.8108 7.84734 12.8108 7.05383 12.6055 6.2989H10.5909C10.6433 6.68078 10.6717 7.06538 10.6759 7.45059ZM9.53689 11.8023C10.6217 11.441 11.5359 10.7139 12.1125 9.75397H10.3614C10.174 10.4668 9.89711 11.1547 9.53689 11.8023ZM6.60431 6.2989C6.47743 7.06178 6.47743 7.83939 6.60431 8.60228H9.39238C9.45059 8.22089 9.48183 7.8361 9.48588 7.45059C9.48207 7.06507 9.45083 6.68026 9.39238 6.2989H6.60431Z"
                fill="var(--bar-background-color)"
              />
            </svg>
          </VIcon>
        </div>
      </div>
      <a
        href="https://yandex.uz/map-widget/v1/?ll=69.221873%2C41.273489&mode=whatshere&utm_source=share&whatshere%5Bpoint%5D=69.220565%2C41.273711&whatshere%5Bzoom%5D=17&z=17"
        target="_blank"
        class="map"
      >
        <img
          src="@/assets/others/location.png"
          width="360"
          height="187"
          alt=""
        />
        <p>{{ $t("address") }}</p>
      </a>
      <div class="right-collar">
        <div class="item">
          <div class="item-title">
            <PhoneIcon color="var(--success)" />
            {{ $t("phoneNumber") }}
          </div>
          <a href="tel:+998555120066" class="item-content">+998 55 512 00 66</a>
        </div>
        <div class="item">
          <div class="item-title">
            <MailIcon color="var(--success)" />
            {{ $t("mail") }}
          </div>
          <div class="item-content">
            <a href="mailto:ihmamarkaz@exat.uz">ihmamarkaz@exat.uz </a>
            <a href="mailto:info@istc.uz">info@istc.uz </a>
          </div>
        </div>
        <div class="item">
          <div class="item-title">
            <WorldIcon color="var(--success)" />
            {{ $t("website") }}
          </div>
          <a href="www.istc.uz" target="_blank" class="item-content"
            >www.istc.uz</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  // background: var(--bar-background-color);
  background: var(--footer-bg-color);
  padding: 2.5rem 0;
  color: var(--secondary-light);
  // color: #2964C2;
  &-inner {
    margin-top: auto;
    padding: 2rem 1rem 4rem 1rem;
    max-width: 90%;
    margin: 0 auto;
    display: grid;
    grid-template-areas: "left-collar map right-collar";
    justify-content: space-between;
    gap: 4rem;

    @media screen and (max-width: 1336px) {
      grid-template-areas:
        "left-collar map"
        "right-collar right-collar";
    }

    @media (tablet) {
    }

    @include media(mini-tablet) {
      grid-template-areas:
        "left-collar"
        "map"
        "right-collar";

      gap: 2rem;
    }
  }
  .left-collar {
    display: flex;
    flex-direction: column;
    grid-area: left-collar;
    .logo {
      display: flex;
      align-items: center;
      gap: 0.625rem;

      img {
        width: 3.1875rem;
      }
      p {
        font-size: 0.6875rem;
        line-height: 0.875rem;
        width: 11.4375rem;
        text-transform: uppercase;
      }
    }

    .social-networks {
      display: flex;
      margin-top: 2rem;
      gap: 0.8125rem;

      :deep() .btn-icon {
        flex: 0 0 2rem;
        height: 2rem;
        width: 2rem;
      }
    }
  }

  .map {
    grid-area: map;
    img {
      border-radius: 0.75rem;
      width: 22.5rem;
      height: 11.6875rem;

      @include media(laptop) {
        width: 100%;
        height: unset;
      }

      @include media(phone) {
        width: 100%;
        height: auto;
      }
    }
    p {
      font-size: 0.75rem;
      line-height: 1.125rem;
      font-weight: 600;
      text-decoration: underline solid;
    }
  }
  .right-collar {
    grid-area: right-collar;
    display: flex;
    flex-direction: column;
    .item {
      margin-bottom: 1rem;
      &-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--bar-card-stroke-color);
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 500;
        margin-bottom: 8px;
      }
      &-content {
        font-size: 0.875rem;
        line-height: 1.3125rem;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
