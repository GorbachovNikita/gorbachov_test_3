import Feed from "../pages/Feed/Feed";
import Reviews from "../pages/Reviews/Reviews";
import ChatsWithSupport from "../pages/ChatsWithSupport/ChatsWithSupport";
import ChatsWithCustomers from "../pages/ChatsWithCustomers/ChatsWithCustomers";

export const privateRouters = [
  { path: "/", element: Feed },
  { path: "/feed", element: Feed },

  { path: "/reviews", element: Reviews },
  { path: "/chatsWithSupport", element: ChatsWithSupport },
  { path: "/chatsWithCustomers", element: ChatsWithCustomers },
];
