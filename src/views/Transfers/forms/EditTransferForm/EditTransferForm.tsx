import { FormEvent, forwardRef } from "react";
import { Button } from "../../../../components/Button/Button";
import { InputGroup } from "../../../../components/InputGroup/InputGroup";
import styles from "./EditTransferForm.module.scss";

export type EditTransferFormProps = {
  name: string;
  description: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export const EditTransferForm = forwardRef<
  HTMLFormElement,
  EditTransferFormProps
>(({ name, description, onSubmit, isLoading = false }, ref) => {
  return (
    <form onSubmit={onSubmit} ref={ref} className={styles.editTransferForm}>
      <InputGroup
        inputMode="text"
        label="Nom du transfert"
        name="name"
        defaultValue={name}
        required
        type="text"
        placeholder="Photos de vacances 2003"
        disabled={isLoading}
        inputProps={{ autoFocus: true, maxLength: 50 }}
      />
      <InputGroup
        as="textarea"
        inputMode="text"
        label="Description du transfert"
        name="description"
        defaultValue={description}
        required
        type="text"
        placeholder="Photos de vacances en espagne avec les copains"
        inputProps={{
          // @ts-expect-error rows is not a valid prop for other input types
          rows: 3,
          maxLength: 255,
        }}
        disabled={isLoading}
      />
      <div className={styles.editTransferForm__actions}>
        <Button isLoading={isLoading} type="submit">
          Modifier
        </Button>
      </div>
    </form>
  );
});
