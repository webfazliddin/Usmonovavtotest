import {
  CircleIcon,
  FileDescriptionIcon,
  LayoutGridIcon,
  UsersIcon,
} from "vue-tabler-icons";
import { useUserStore } from "../layouts/store/user";

const userStore = useUserStore()

export default [
  {
    title: "Admin",
    children: [
      {
        title: "categories",
        to: "/admin/categories",
        icon: CircleIcon,
        visible: userStore.isAdmin
      },
      {
        title: "testPage",
        to: "/admin/questions",
        icon: FileDescriptionIcon,
        visible: userStore.isAdmin
      },
      {
        title: "users",
        to: "/admin/users",
        icon: UsersIcon,
        visible: userStore.isAdmin
      },
      {
        title: "myCategories",
        to: "/admin/my-categories",
        icon: LayoutGridIcon,
        visible: true
      },
    ],
  },
];
