import { useAuth } from "../../contexts/authContext";

export const UserProfileView = () => {
  const { user, setUser } = useAuth();
  return (
    <>
      <h1>Profile</h1>
      <p>Username: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <button
        type="button"
        onClick={() => {
          localStorage.removeItem("token");
          setUser(null);
        }}
      >
        Déconnexion
      </button>
    </>
  );
};
