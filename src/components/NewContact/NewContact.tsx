import { type FormEvent } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { getFormData } from "../../utils/forms";
import { InputGroup } from "../InputGroup/InputGroup";
import { Button } from "../Button/Button";
import { useToast } from "../../contexts/hooks/ToastContext";
import styles from "./NewContact.module.scss";
import { useAuth } from "../../contexts/authContext";

export const NewContact = () => {
  const { createToast } = useToast();
  const { user } = useAuth();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const data = getFormData(event);
    try {
      const response = await axios.post("http://localhost:4000/mails/invite", {
        email: data.email,
        invitedBy: user?.email,
      });

      if (response.status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        // @ts-expect-error : TODO
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        event.target.reset();
        createToast({
          id: "send-invitation-success",
          description: "L'invitation a bien été envoyée",
          title: "Succès",
          variant: "success",
        });
      }
    } catch (error) {
      createToast({
        id: "send-invitation-error",
        description: "Une erreur est survenue lors de l'envoi de l'invitation",
        title: "Erreur",
        variant: "error",
      });
    }
  };
  return (
    <div className={styles.container}>
      <h1>Inviter un contact</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <InputGroup
          inputMode="email"
          label="Email"
          name="email"
          placeholder="john@doe.com"
          required
          type="email"
          autoComplete="email"
          icon={<Mail width={25} />}
        />
        <Button type="submit">Ajouter</Button>
      </form>
    </div>
  );
};
