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
import { TransfersView } from "./views/Transfers/TransfersView";
import { ContactsView } from "./views/Contacts/ContactsView";
import { Contact } from "./components/Contact/Contact";
import { NewContact } from "./components/NewContact/NewContact";

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
            <ImportFile />
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
        element: <ContactsView />,
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
