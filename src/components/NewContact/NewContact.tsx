import { type FormEvent } from "react";
import { Mail } from "lucide-react";
import axios from "axios";
import { getFormData } from "../../utils/forms";
import { InputGroup } from "../InputGroup/InputGroup";
import { Button } from "../Button/Button";
import { useToast } from "../../contexts/hooks/ToastContext";

export const NewContact = () => {
  const { createToast } = useToast();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const data = getFormData(event);
    try {
      await axios.post("http://localhost:4000/mails/invite", data);
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
    <form onSubmit={handleSubmit}>
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
  );
};
