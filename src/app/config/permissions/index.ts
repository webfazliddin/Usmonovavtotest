import {
  CircleIcon,
  FileDescriptionIcon,
  LayoutGridIcon,
  UsersIcon,
} from "vue-tabler-icons";

export default [
  {
    title: "Admin",
    children: [
      {
        title: "categories",
        to: "/admin/categories",
        icon: CircleIcon,
      },
      {
        title: "testPage",
        to: "/admin/questions",
        icon: FileDescriptionIcon,
      },
      {
        title: "users",
        to: "/admin/users",
        icon: UsersIcon,
      },
      {
        title: "myCategories",
        to: "/admin/my-categories",
        icon: LayoutGridIcon,
      },
    ],
  },
];
