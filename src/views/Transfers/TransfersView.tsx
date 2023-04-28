import { TransferList } from "../../components/TransferList/TransferList";
import styles from "./TransfersView.module.scss";

export const TransfersView = () => {
  return (
    <div className={styles.transfersView}>
      <h1 className={styles.transfersView__title}>Mes derniers transferts</h1>
      <TransferList />
    </div>
  );
};
