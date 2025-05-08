import {
  CircleIcon,
  FileDescriptionIcon,
  LayoutGridIcon,
  LockBoltIcon,
  LockOffIcon,
  UsersIcon,
} from "vue-tabler-icons";
import { useUserStore } from "../layouts/store/user";
import { computed } from "vue";
const userStore = useUserStore();

const result = computed(() => {
  const array = [
    {
      title: "Admin",
      children: [
        {
          title: "categories",
          to: "/admin/categories",
          icon: CircleIcon,
          visible: userStore.getIsAdmin,
        },
        {
          title: "testPage",
          to: "/admin/questions",
          icon: FileDescriptionIcon,
          visible: userStore.getIsAdmin,
        },
        {
          title: "cardTest",
          to: "/admin/card-tests",
          icon: LayoutGridIcon,
          visible: userStore.getIsAdmin,
        },
        {
          title: "users",
          to: "/admin/users",
          icon: UsersIcon,
          visible: userStore.getIsAdmin,
        },
        {
          title: "myCategories",
          to: "/admin/my-categories",
          icon: LayoutGridIcon,
          visible: true,
        },
        // {
        //   title: "markCategories",
        //   to: "/admin/mark-categories",
        //   icon: LayoutGridIcon,
        //   visible: userStore.getIsAdmin,
        // },
        // {
        //   title: "trafficMarks",
        //   to: "/admin/traffic-marks",
        //   icon: LayoutGridIcon,
        //   visible: userStore.getIsAdmin,
        // },

        {
          title: "50",
          to: "admin/complete-test",
          icon: LayoutGridIcon,
          visible: true,
        },
        {
          title: "cardTests",
          to: "/card",
          icon: LockBoltIcon,
          visible: true,
        },
      ],
    },
  ];

  return array;
});
export default result;
