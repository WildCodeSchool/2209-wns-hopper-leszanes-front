import { Button } from "../../../../components/Button/Button";
import { InputGroup } from "../../../../components/InputGroup/InputGroup";
import { Switch } from "../../../../components/Switch/Switch";
import type { UploadFormEvent } from "../../../../types/UploadFormEvent";
import styles from "./TransferForm.module.scss";

export type TransferFormProps = {
  handleUploadSubmit: (e: UploadFormEvent) => void;
  uploadingFiles: boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  transferName: string;
  setTransferName: React.Dispatch<React.SetStateAction<string>>;
  transferDescription: string;
  setTransferDescription: React.Dispatch<React.SetStateAction<string>>;
  isPrivate: boolean;
  setIsPrivate: React.Dispatch<React.SetStateAction<boolean>>;
  transferStartDate: string | undefined;
  setTransferStartDate: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  transferEndDate: string | undefined;
  setTransferEndDate: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const TransferForm = ({
  handleUploadSubmit,
  uploadingFiles,
  setStep,
  transferName,
  setTransferName,
  transferDescription,
  setTransferDescription,
  isPrivate,
  setIsPrivate,
  transferStartDate,
  setTransferStartDate,
  transferEndDate,
  setTransferEndDate,
}: TransferFormProps) => {
  return (
    <form onSubmit={handleUploadSubmit} className={styles.transferForm}>
      <InputGroup
        inputMode="text"
        label="Nom du transfert"
        name="transferName"
        type="text"
        autoComplete="ztransfer-new-transfer-name"
        placeholder="Dossier photos"
        disabled={uploadingFiles}
        value={transferName}
        onChange={(e) => setTransferName(e.target.value)}
        inputProps={{
          autoFocus: true,
        }}
      />
      <InputGroup
        as="textarea"
        label="Description"
        name="description"
        type="textarea"
        placeholder="Description"
        inputMode="text"
        disabled={uploadingFiles}
        value={transferDescription}
        onChange={(e) => setTransferDescription(e.target.value)}
      />
      <Switch
        checked={isPrivate}
        onCheckedChange={() => setIsPrivate((prev) => !prev)}
      >
        {isPrivate
          ? "Privé (partage avec contacts)"
          : "Public (partage avec un lien publique)"}
      </Switch>
      {!isPrivate && (
        <div className={styles.datePickersContainer}>
          <InputGroup
            inputMode="none"
            label="Partager à partir du"
            name="startDate"
            type="datetime-local"
            autoComplete="ztransfer-new-transfer-start-date"
            placeholder=""
            disabled={uploadingFiles}
            value={transferStartDate}
            onChange={(e) => setTransferStartDate(e.target.value)}
          />

          <InputGroup
            inputMode="none"
            label="Date d'expiration"
            name="expirationDate"
            type="datetime-local"
            autoComplete="ztransfer-new-transfer-expiration-date"
            placeholder=""
            disabled={uploadingFiles}
            value={transferEndDate}
            onChange={(e) => setTransferEndDate(e.target.value)}
          />
        </div>
      )}
      <div className={styles.buttonsContainer}>
        <Button type="button" variant="muted" onClick={() => setStep(1)}>
          Précédent
        </Button>
        <Button
          isLoading={uploadingFiles}
          disabled={!transferName || !transferDescription}
          type="submit"
        >
          Envoyer
        </Button>
      </div>
    </form>
  );
};
