import { useAuth } from "../../contexts/authContext";

export const UserProfileView = () => {
  const { user } = useAuth();
  return (
    <>
      <h1>Profile</h1>
      <p>Username: {user?.name}</p>
      <p>Email: {user?.email}</p>
    </>
  );
};
