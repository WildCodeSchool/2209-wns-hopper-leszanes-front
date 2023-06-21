import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { useAuth } from "../../contexts/authContext";
import style from "./UserProfileView.module.scss";

export const UserProfileView = () => {
  const { user } = useAuth();
  const textColor = "#000";
  const completed = 91;
  const setColor = () => {
    // TODO : fix this
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (completed > 60 && completed < 90) {
      return "#f27800";
    }
    // TODO : fix this
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (completed >= 90) {
      return "#DF2525";
    }
    return "#69b870";
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
