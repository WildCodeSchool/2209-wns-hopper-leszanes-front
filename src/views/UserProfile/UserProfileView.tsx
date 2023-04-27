import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { useAuth } from "../../contexts/authContext";
import style from "./UserProfileView.module.scss";

export const UserProfileView = () => {
  const { user } = useAuth();
  const textColor = "#000";
  const completed = 95;
  const setColor = () => {
    if (completed > 60 && completed < 90) {
      return "orange";
    }
    if (completed >= 90) {
      return "red";
    }
    return "green";
  };

  return (
    <div className={style.profileContainer}>
      <div>
        <h1>Profile</h1>
        <p>Username: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Utilisation de l'espace de stockage : </p>
        <ProgressBar
          bgcolor={setColor()}
          completed={completed}
          textColor={textColor}
          fullText="Espace de stockage plein"
        />
      </div>
    </div>
  );
};
