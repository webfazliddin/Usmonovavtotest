import {
  CircleIcon,
  FileDescriptionIcon,
  LayoutGridIcon,
  LockBoltIcon,
  UsersIcon,
  SchoolIcon,
  ClipboardListIcon,
  ListCheckIcon,
  LayoutDashboardIcon,
} from "vue-tabler-icons";
import { useUserStore } from "../layouts/store/user";
import { computed } from "vue";
const userStore = useUserStore();

const result = computed(() => {
  const isAdmin = userStore.getIsAdmin;

  const array = [
    // User section - available for all users
    {
      header: "menu",
      children: [
        {
          title: "myCategories",
          to: "/admin/my-categories",
          icon: LayoutDashboardIcon,
          visible: true,
        },
        {
          title: "randomTests",
          to: "/admin/complete-test",
          icon: ListCheckIcon,
          visible: true,
        },
        {
          title: "cardTests",
          to: "/my-courses",
          icon: LockBoltIcon,
          visible: true,
        },
        {
          title: "exam",
          to: "/exam",
          icon: SchoolIcon,
          visible: true,
        },
      ],
    },
    // Admin section - only for admins
    ...(isAdmin
      ? [
          {
            header: "admin",
            children: [
              {
                title: "categories",
                to: "/admin/categories",
                icon: CircleIcon,
                visible: true,
              },
              {
                title: "testPage",
                to: "/admin/questions",
                icon: FileDescriptionIcon,
                visible: true,
              },
              {
                title: "cardTest",
                to: "/admin/card-tests",
                icon: LayoutGridIcon,
                visible: true,
              },
              {
                title: "users",
                to: "/admin/users",
                icon: UsersIcon,
                visible: true,
              },
              {
                title: "examResults",
                to: "/admin/exam-results",
                icon: ClipboardListIcon,
                visible: true,
              },
              {
                title: "assignmentSubmissions",
                to: "/admin/assignment-submissions",
                icon: ClipboardListIcon,
                visible: true,
              },
            ],
          },
        ]
      : []),
  ];

  return array;
});
export default result;
