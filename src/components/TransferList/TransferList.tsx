import { useQuery } from "@apollo/client";
import { getCurrentUserTransfers } from "../../graphql/getCurrentUserTransfers";
import { Transfer } from "../../types/Transfer";
import { TransferElement } from "../TransferElement/TransferElement";
import styles from "./TransferList.module.scss";
import { LoadingLayout } from "../LoadingLayout/LoadingLayout";

type GetCurrentUser = {
  getCurrentUserTransfers: Transfer[] | null;
};

export const TransferList = () => {
  const { data, loading, error, refetch } = useQuery<GetCurrentUser>(
    getCurrentUserTransfers
  );

  if (loading) {
    return <LoadingLayout />;
  }

  if (data?.getCurrentUserTransfers?.length === 0) {
    return <p>No transfers yet</p>;
  }

  if (error) return <p>{error.message}</p>;

  return (
    <ul className={styles.transferList}>
      {data?.getCurrentUserTransfers?.map((transfer) => (
        <TransferElement
          key={transfer.id}
          transfer={transfer}
          onDelete={refetch}
        />
      ))}
    </ul>
  );
};
