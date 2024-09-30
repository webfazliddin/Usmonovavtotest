import { FileDescriptionIcon, UsersIcon } from "vue-tabler-icons";

  export default [
  {
    title: "Admin",
    children: [
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
    ],
  },
];
