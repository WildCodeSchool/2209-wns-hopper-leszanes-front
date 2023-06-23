import { useQuery } from "@apollo/client";
import { Plus, Trash2, Users } from "lucide-react";
import {
  ChangeEvent,
  LegacyRef,
  MouseEvent,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "../../../../components/Button/Button";
import styles from "./EditUsersForm.module.scss";
import { User } from "../../../../types/User";
import { getCurrentUserContacts } from "../../../../graphql/user/getCurrentUserContacts";
import { ComboBox } from "../../../../components/ComboBox/ComboBox";
import { Loader } from "../../../../components/Loader/Loader";
import { getCurrentUserTransferUsers } from "../../../../graphql/transfer/getCurrentUserTransferUsers";
import { Link } from "../../../../components/Link/Link";

export type EditUsersFormProps = {
  isLoading?: boolean;
  transferId: number;
  updateUsersTransfer: (users: User[]) => Promise<void>;
};

export const EditUsersForm = forwardRef(
  (
    { transferId, isLoading, updateUsersTransfer }: EditUsersFormProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const {
      data: dataContacts,
      loading: isLoadingContacts,
      error: contactError,
    } = useQuery<{
      getCurrentUserContacts: User[];
    }>(getCurrentUserContacts);

    const {
      data: dataTransferUsers,
      loading: isLoadingTransferUsers,
      error: transferUsersError,
      refetch: refetchTransferUsers,
    } = useQuery<{
      getCurrentUserTransferUsers: User[];
    }>(getCurrentUserTransferUsers, {
      variables: { getCurrentUserTransferUsersId: transferId },
    });

    const [selectedUser, setSelectedUser] = useState<string>("");

    const transferUsers = dataTransferUsers?.getCurrentUserTransferUsers ?? [];

    const contacts =
      dataContacts?.getCurrentUserContacts.filter(
        (contact) => !transferUsers.find((user) => user.id === contact.id)
      ) ?? [];

    const initualLoadingRef = useRef(true);
    useMemo(() => {
      initualLoadingRef.current = true;
    }, []);

    if (
      (isLoadingContacts || isLoadingTransferUsers || isLoading) &&
      initualLoadingRef.current
    ) {
      initualLoadingRef.current = false;
      return (
        <div className={styles.editUsersForm}>
          <div className={styles.editUsersForm__loader}>
            <Loader />
          </div>
        </div>
      );
    }

    if (contactError || transferUsersError) {
      return (
        <div className={styles.editUsersForm}>
          <p className={styles.editUsersForm__error}>
            Une erreur est survenue.
          </p>
        </div>
      );
    }

    const deleteTransferUser = async (userId: number) => {
      const newTransferUsers = transferUsers.filter(
        (transferUser) => transferUser.id !== userId
      );
      await updateUsersTransfer(newTransferUsers);
      refetchTransferUsers();
    };

    const addTransferUser = async (e: MouseEvent) => {
      e.preventDefault();
      if (!selectedUser) return;
      const contact = contacts.find((c) => c.name === selectedUser);
      if (!contact) return;
      const newTransferUsers = [...transferUsers, contact];
      await updateUsersTransfer(newTransferUsers);
      refetchTransferUsers();
      setSelectedUser("");
    };

    const handleSelectUser = (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedUser(event.target.value);
    };

    return (
      <div ref={ref} className={styles.editUsersForm}>
        <p className={styles.editUsersForm__description}>
          Vous pouvez modifier les utilisateurs avec qui vous partagez ce
          transfert.
        </p>
        <div className={styles.editUsersForm__contacts}>
          <h6>Ont accès :</h6>
          {transferUsers.length > 0 ? (
            transferUsers.map((user) => (
              <div key={user.id} className={styles.editUsersForm__contact}>
                <p>{user.name}</p>
                <Button
                  variant="destructive"
                  icon={<Trash2 width={15} height={15} />}
                  onClick={() => deleteTransferUser(user.id)}
                />
              </div>
            ))
          ) : (
            <p className={styles.editUsersForm__notShared}>
              Ce transfert n'est partagé avec aucun utilisateur.
            </p>
          )}
        </div>
        {contacts.length > 0 ? (
          <div className={styles.editUsersForm__addContact}>
            <ComboBox
              dataList={contacts}
              dataListItems="name"
              dataListKeys="id"
              dataListValues="name"
              name="contacts"
              label="Ajouter un contact"
              placeholder="Rechercher un contact"
              icon={<Users width={20} height={20} />}
              value={selectedUser}
              // @ts-expect-error : TODO
              onChange={handleSelectUser}
            />
            <Button
              icon={<Plus width={20} height={20} />}
              onClick={addTransferUser}
            />
          </div>
        ) : (
          <p className={styles.editUsersForm__noContacts}>
            {transferUsers.length > 0
              ? "Aucun contact à ajouter."
              : "Vous n'avez aucun contact."}
          </p>
        )}
        <p>
          Pas encore en contact avec la personne:{" "}
          <Link className={styles.editUsersForm__link} to="/contacts">
            ajouter un contact
          </Link>{" "}
          dès maintenant.
        </p>
      </div>
    );
  }
);
