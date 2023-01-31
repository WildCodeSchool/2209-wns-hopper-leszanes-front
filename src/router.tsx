import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { ErrorView } from "./views/Error/ErrorView";
import { UnauthorizedView } from "./views/Unauthorized/UnauthorizedView";
import { NotFoundView } from "./views/NotFound/NotFoundView";
import { LoginView } from "./views/Login/LoginView";
import { RegisterView } from "./views/Register/RegisterView";
import { UserProfileView } from "./views/UserProfile/UserProfileView";
import { HomeView } from "./views/Home/HomeView";
import { AuthRouteGuard } from "./components/AuthRouteGuard/AuthRouteGuard";
import { ImportFile } from "./components/ImportFile/ImportFile";

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
        path: "profile",
        element: (
          <AuthRouteGuard>
            <UserProfileView />
          </AuthRouteGuard>
        ),
      },
      {
        path: "upload",
        element: <ImportFile />,
      },
      {
        path: "files",
        element: <h1>My files</h1>,
      },
      {
        path: "contacts",
        element: <h1>My contacts</h1>,
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
    ],
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
