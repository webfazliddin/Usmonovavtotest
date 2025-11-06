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
  const isAdmin = userStore.getIsAdmin;

  const array = [
    {
      title: "Admin",
      children: [
        // ADMIN ONLY - Categories management
        {
          title: "categories",
          to: "/admin/categories",
          icon: CircleIcon,
          visible: isAdmin, // Only admins can see
        },
        // ADMIN ONLY - Questions management
        {
          title: "testPage",
          to: "/admin/questions",
          icon: FileDescriptionIcon,
          visible: isAdmin, // Only admins can see
        },
        // ADMIN ONLY - Card tests management
        {
          title: "cardTest",
          to: "/admin/card-tests",
          icon: LayoutGridIcon,
          visible: isAdmin, // Only admins can see
        },
        // ADMIN ONLY - Users management
        {
          title: "users",
          to: "/admin/users",
          icon: UsersIcon,
          visible: isAdmin, // Only admins can see
        },
        // BOTH - My training categories (available for all users)
        {
          title: "myCategories",
          to: "/admin/my-categories",
          icon: LayoutGridIcon,
          visible: true, // Available for all users
        },
        // BOTH - Random 50 question tests (available for all users)
        {
          title: "randomTests",
          to: "/admin/complete-test",
          icon: LayoutGridIcon,
          visible: true, // Available for all users
        },
        // BOTH - Card-based tests (available for all users)
        {
          title: "cardTests",
          to: "/card",
          icon: LockBoltIcon,
          visible: true, // Available for all users
        },
        // ADMIN ONLY - Mark categories (commented out, restore if needed)
        // {
        //   title: "markCategories",
        //   to: "/admin/mark-categories",
        //   icon: LayoutGridIcon,
        //   visible: isAdmin,
        // },
        // ADMIN ONLY - Traffic marks (commented out, restore if needed)
        // {
        //   title: "trafficMarks",
        //   to: "/admin/traffic-marks",
        //   icon: LayoutGridIcon,
        //   visible: isAdmin,
        // },
      ],
    },
  ];

  return array;
});
export default result;
