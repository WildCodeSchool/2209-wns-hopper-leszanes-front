import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { ErrorView } from "./views/Error/ErrorView";
import { UnauthorizedView } from "./views/Unauthorized/UnauthorizedView";
import { NotFoundView } from "./views/NotFound/NotFoundView";
import { LoginView } from "./views/Login/LoginView";
import { RegisterView } from "./views/Register/RegisterView";
import { UserProfileView } from "./views/UserProfile/UserProfileView";
import { HomeView } from "./views/Home/HomeView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorView />,
    children: [
      {
        path: "",
        element: <HomeView />,
      },
      {
        path: "profil",
        element: (
          // <AuthProvider>
          <UserProfileView />
          // </AuthProvider>
        ),
      },
    ],
  },
  {
    path: "login",
    element: <LoginView />,
    errorElement: <ErrorView />,
  },
  {
    path: "register",
    element: <RegisterView />,
    errorElement: <ErrorView />,
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
  {
    path: "unauthorized",
    element: <UnauthorizedView />,
  },
]);
