import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { Frown, Search, X } from "lucide-react";
import { getCurrentUserTransfers } from "../../graphql/transfer/getCurrentUserTransfers";
import { Transfer } from "../../types/Transfer";
import { TransferElement } from "../TransferElement/TransferElement";
import styles from "./TransferList.module.scss";
import { LoadingLayout } from "../LoadingLayout/LoadingLayout";
import { Button } from "../Button/Button";
import { InputGroup } from "../InputGroup/InputGroup";
import { bulkDeleteCurrentUserTransfers } from "../../graphql/transfer/bulkDeleteCurrentUserTransfers";
import { useToast } from "../../contexts/hooks/ToastContext";
import { ConfirmDialog } from "../ConfirmDialog/ConfirmDialog";
import { ComboBox } from "../ComboBox/ComboBox";
import { Select } from "../Select/Select";

type GetCurrentUser = {
  getCurrentUserTransfers: Transfer[] | null;
};

export const TransferList = () => {
  const { data, loading, error, refetch } = useQuery<GetCurrentUser>(
    getCurrentUserTransfers
  );
  const [selectedTransfers, setSelectedTransfers] = useState<number[]>([]);
  const [doDeleteMutation, { loading: isDeleteLoading }] = useMutation<boolean>(
    bulkDeleteCurrentUserTransfers
  );
  const { createToast } = useToast();
  const [search, setSearch] = useState("");
  const [initialTransfers, setInitialTransfers] = useState<Transfer[]>(
    data?.getCurrentUserTransfers ?? []
  );
  const [transfers, setTransfers] = useState<Transfer[]>(initialTransfers);

  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">(
    "updatedAt"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const sortByItems = useMemo(
    () => [
      {
        id: "createdAt",
        itemContainer: { value: "createdAt" },
        itemLabel: { children: "Date de création" },
      },
      {
        id: "updatedAt",
        itemContainer: { value: "updatedAt" },
        itemLabel: { children: "Date de modification" },
      },
      {
        id: "name",
        itemContainer: { value: "name" },
        itemLabel: { children: "Nom" },
      },
    ],
    []
  );

  const sortOrderItems = useMemo(
    () => [
      {
        id: "asc",
        itemContainer: { value: "asc" },
        itemLabel: { children: "Croissant" },
      },
      {
        id: "desc",
        itemContainer: { value: "desc" },
        itemLabel: { children: "Décroissant" },
      },
    ],
    []
  );
  const sortTransfers = useCallback(
    (
      sort: "name" | "createdAt" | "updatedAt",
      order: "asc" | "desc" | undefined = "asc"
    ) => {
      if (sort === "name") {
        setInitialTransfers((prev) => {
          const prevTransfers = [...prev];
          prevTransfers.sort((a, b) => {
            if (a.name < b.name) {
              return order === "asc" ? -1 : 1;
            }
            if (a.name > b.name) {
              return order === "asc" ? 1 : -1;
            }
            return 0;
          });
          return prevTransfers;
        });
        return;
      }
      if (sort === "createdAt") {
        setInitialTransfers((prev) => {
          const prevTransfers = [...prev];
          prevTransfers.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (dateA.getTime() < dateB.getTime()) {
              return order === "asc" ? -1 : 1;
            }
            if (dateA.getTime() > dateB.getTime()) {
              return order === "asc" ? 1 : -1;
            }
            return 0;
          });
          return prevTransfers;
        });
        return;
      }
      setInitialTransfers((prev) => {
        const prevTransfers = [...prev];
        prevTransfers.sort((a, b) => {
          const dateA = new Date(a.updatedAt);
          const dateB = new Date(b.updatedAt);
          if (dateA.getTime() < dateB.getTime()) {
            return order === "asc" ? -1 : 1;
          }
          if (dateA.getTime() > dateB.getTime()) {
            return order === "asc" ? 1 : -1;
          }
          return 0;
        });
        return prevTransfers;
      });
    },
    []
  );

  useMemo(() => {
    sortTransfers(sortBy, sortOrder);
  }, [sortBy, sortOrder, sortTransfers]);

  useMemo(() => {
    if (data?.getCurrentUserTransfers) {
      setInitialTransfers(data.getCurrentUserTransfers);
      setTransfers(data.getCurrentUserTransfers);
    }
  }, [data?.getCurrentUserTransfers]);

  const searchTransfers = useCallback(
    (searchValue: string) => {
      if (searchValue === "") {
        setTransfers(initialTransfers);
        return;
      }
      const filteredTransfers = initialTransfers.filter((transfer) =>
        transfer.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setTransfers(filteredTransfers);
    },
    [initialTransfers]
  );

  useMemo(() => {
    searchTransfers(search);
  }, [search, searchTransfers]);

  const handleOnSelectChange = (id: number) => {
    if (selectedTransfers.includes(id)) {
      setSelectedTransfers((prev) => prev.filter((el) => el !== id));
    } else {
      setSelectedTransfers((prev) => [...prev, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTransfers.length === transfers.length) {
      setSelectedTransfers([]);
    } else {
      setSelectedTransfers(transfers.map((transfer) => transfer.id));
    }
  };

  const deleteTransfers = async () => {
    try {
      const { data: dataDeletedTransfers } = await doDeleteMutation({
        variables: {
          bulkDeleteCurrentUserTransfersIds: selectedTransfers,
        },
      });
      if (!isDeleteLoading && dataDeletedTransfers) {
        createToast({
          id: "bulkDeletedTransfersSuccess",
          title: "Suppression des transferts",
          description: "Les transferts ont bien été supprimés",
          variant: "success",
        });
        refetch();
        setSelectedTransfers([]);
        return;
      }
      if (!isDeleteLoading && !dataDeletedTransfers) {
        createToast({
          id: "bulkDeletedTransfersError",
          title: "Suppression des transferts",
          description: "Les transferts n'ont pas pu être supprimés",
          variant: "error",
        });
      }
    } catch (err) {
      createToast({
        id: "bulkDeletedTransfersError",
        title: "Suppression des transferts",
        description: "Les transferts n'ont pas pu être supprimés",
        variant: "error",
      });
    }
  };

  const handleOnConfirmDialog = (type: "cancel" | "confirm") => {
    if (type === "confirm") {
      deleteTransfers();
    }
    setIsConfirmDialogOpen(false);
  };

  if (loading) {
    return <LoadingLayout />;
  }

  if (error) return <p>{error.message}</p>;

  return (
    <div className={styles.transferList}>
      <div className={styles.transferList__titleContainer}>
        <h1 className={styles.transferList__title}>Mes derniers transferts</h1>
        <ComboBox
          dataList={transfers}
          dataListItems="name"
          dataListKeys="id"
          dataListValues="name"
          name="search"
          label=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher"
          icon={<Search width={20} height={20} />}
          width="max-content"
        />
      </div>
      <div className={styles.transferList__header}>
        <InputGroup
          width="max-content"
          type="checkbox"
          name="selectAll"
          label="Tout sélectionner"
          onChange={handleSelectAll}
          checked={
            selectedTransfers.length === transfers.length &&
            transfers.length > 0
          }
          placeholder=""
          inputMode="none"
        />
        <div className={styles.transferList__header__actions}>
          <Select
            className={styles.transferList__select}
            displayLabel="Trier par"
            label={`${
              sortByItems.find((item) => item.itemContainer.value === sortBy)
                ?.itemLabel.children ?? "Trier par"
            }`}
            name="sortBy"
            value={sortBy}
            onValueChange={(e) => {
              setSortBy(e as "name" | "createdAt" | "updatedAt");
            }}
            items={sortByItems}
          />
          <Select
            className={styles.transferList__select}
            displayLabel="Ordre"
            label={`${
              sortOrderItems.find(
                (item) => item.itemContainer.value === sortOrder
              )?.itemLabel.children ?? "Ordre"
            }`}
            name="sortOrder"
            value={sortOrder}
            onValueChange={(e) => {
              setSortOrder(e as "asc" | "desc");
            }}
            items={sortOrderItems}
          />
        </div>
      </div>
      <ul className={styles.transferList}>
        {transfers.map((transfer) => (
          <TransferElement
            key={transfer.id}
            transferData={transfer}
            refresh={refetch}
            onSelectChange={handleOnSelectChange}
            isSelected={selectedTransfers.includes(transfer.id) || undefined}
          />
        ))}
      </ul>
      {selectedTransfers.length > 0 && (
        <Button
          icon={<X width={35} height={35} />}
          variant="destructive"
          className={styles.transferList__close}
          onClick={() => setIsConfirmDialogOpen(true)}
        />
      )}
      {!transfers.length && search && (
        <div className={styles.transferList__noResult}>
          <Frown width={50} height={50} />
          <p>Aucun résultat</p>
        </div>
      )}
      {transfers.length === 0 && !search && (
        <div className={styles.transferList__noResult}>
          <Frown width={50} height={50} />
          <p>Pas de transferts pour le moment</p>
        </div>
      )}
      <ConfirmDialog
        title="Supprimer les transferts"
        onClose={handleOnConfirmDialog}
        open={isConfirmDialogOpen}
      >
        <p>Êtes-vous sûr de vouloir supprimer ces transferts ?</p>
      </ConfirmDialog>
    </div>
  );
};
