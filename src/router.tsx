import { createBrowserRouter } from "react-router-dom";
import { AuthRouteGuard } from "./components/AuthRouteGuard/AuthRouteGuard";
import { Contact } from "./components/Contact/Contact";
import { Layout } from "./components/Layout/Layout";
import { NewContact } from "./components/NewContact/NewContact";
import { ContactsView } from "./views/Contacts/ContactsView";
import { DownloadView } from "./views/Download/DownloadView";
import { ErrorView } from "./views/Error/ErrorView";
import { HomeView } from "./views/Home/HomeView";
import { LoginView } from "./views/Login/LoginView";
import { NotFoundView } from "./views/NotFound/NotFoundView";
import { RegisterView } from "./views/Register/RegisterView";
import { TransfersView } from "./views/Transfers/TransfersView";
import { UnauthorizedView } from "./views/Unauthorized/UnauthorizedView";
import { UploadView } from "./views/Upload/UploadView";
import { UserProfileView } from "./views/UserProfile/UserProfileView";

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
        element: (
          <AuthRouteGuard>
            <UploadView />
          </AuthRouteGuard>
        ),
      },
      {
        path: "transfers",
        element: (
          <AuthRouteGuard>
            <TransfersView />
          </AuthRouteGuard>
        ),
      },
      {
        path: "contacts",
        element: (
          <AuthRouteGuard>
            <ContactsView />
          </AuthRouteGuard>
        ),
        children: [
          {
            path: ":id",
            element: <Contact />,
          },
          {
            path: "new",
            element: <NewContact />,
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
        path: "download/:token",
        element: <DownloadView />,
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
