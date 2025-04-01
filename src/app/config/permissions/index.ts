import {
  CircleIcon,
  FileDescriptionIcon,
  LayoutGridIcon,
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
        {
          title: "markCategories",
          to: "/admin/mark-categories",
          icon: LayoutGridIcon,
          visible: userStore.getIsAdmin,
        },
      ],
    },
  ];

  return array;
});
export default result;
