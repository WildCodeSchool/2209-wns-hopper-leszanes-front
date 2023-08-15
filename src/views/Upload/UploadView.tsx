import { useApolloClient, useMutation } from "@apollo/client";
import axios, { AxiosProgressEvent } from "axios";
import confetti from "canvas-confetti";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { useToast } from "../../contexts/hooks/ToastContext";
import { createTransfer } from "../../graphql/createTransfer";
import { createFile } from "../../graphql/file/createFile";
import { CreateTransferResponse } from "../../types/CreateTransferResponse";
import { UploadFilesResponse } from "../../types/UploadFilesResponse";
import { UploadFormEvent } from "../../types/UploadFormEvent";
import { UploadResponse } from "../../types/UploadResponse";
import styles from "./UploadView.module.scss";
import { ImportFiles } from "./components/ImportFiles/ImportFiles";
import { TransferForm } from "./components/TransferForm/TransferForm";

export const UploadView = () => {
  const [transferName, setTransferName] = useState<string>("");
  const [completed, setCompleted] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const [transferDescription, setTransferDescription] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1);
  const [displayLoader, setDisplayLoader] = useState<boolean>(true);
  const [transferStartDate, setTransferStartDate] = useState<
    string | undefined
  >(undefined);
  const [transferEndDate, setTransferEndDate] = useState<string | undefined>(
    undefined
  );
  const [doCreateFileMutation, { loading: uploadingFiles }] =
    useMutation<UploadResponse>(createFile);
  const { createToast } = useToast();
  const [doCreateTransferMutation] =
    useMutation<CreateTransferResponse>(createTransfer);
  const navigate = useNavigate();
  const client = useApolloClient();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (currentFile: File) => {
    setFiles(files.filter((file) => file !== currentFile));
  };

  const doCreateTransfer = async (
    name: string,
    description: string,
    startDate: string | undefined,
    endDate: string | undefined
  ) => {
    try {
      const res = await doCreateTransferMutation({
        variables: {
          data: {
            name,
            description,
            isPrivate,
            startDate: !isPrivate ? startDate : undefined,
            endDate: !isPrivate && endDate ? endDate : undefined,
          },
        },
      });
      return Number(res.data?.createTransfer.id ?? undefined);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("An unknown error occurred");
    }
  };

  const doCreateFile = async (
    name: string,
    fileName: string,
    type: string,
    size: number,
    signature: string,
    transferId: number
  ) => {
    try {
      await doCreateFileMutation({
        variables: {
          data: {
            name,
            fileName,
            type,
            size,
            signature,
            transferId,
          },
        },
      });
    } catch (err) {
      createToast({
        id: "create-file-error",
        title: "Une erreur est survenue",
        description: "Erreur lors de la création du fichier",
        variant: "error",
      });
      if (err instanceof Error) {
        throw new Error(err.message);
      }
      throw new Error("Unexpected error occurred when creating file");
    }
  };

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    const { loaded, total } = progressEvent;
    if (total !== undefined) {
      const percent = Math.floor((loaded * 100) / total);
      setCompleted(percent);
    }
  };

  const handleUploadSubmit = async (e: UploadFormEvent) => {
    e.preventDefault();
    if (files.length <= 0) {
      createToast({
        id: "upload-error",
        title: "Une erreur est survenue",
        description: "Aucun fichier à mettre en ligne",
        variant: "error",
      });
      return;
    }
    setStep(3);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append(`files`, file, file.name);
    });
    const transferId = await doCreateTransfer(
      transferName,
      transferDescription,
      transferStartDate,
      transferEndDate
    );
    axios
      .post<{ filesWithHash: UploadFilesResponse[] }>(
        "http://localhost:4000/files/upload",
        formData,
        {
          onUploadProgress,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if (res.data.filesWithHash.length > 0) {
          res.data.filesWithHash.forEach((file) => {
            doCreateFile(
              file.originalname,
              file.filename,
              file.mimetype,
              file.size,
              file.signature,
              transferId
            );
          });
        }
      })
      .catch(() => {
        createToast({
          id: "upload-error",
          title: "Une erreur est survenue",
          description: "Erreur lors de l'upload du fichier",
          variant: "error",
        });
      })
      .then(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          setDisplayLoader(false);
        }, 2000);

        setTimeout(() => {
          client.resetStore();
          navigate(`/transfers`);
        }, 3750);
      })
      .catch(() =>
        createToast({
          id: "create-file-error-data",
          title: "Une erreur est survenue",
          description: "Erreur lors de la création du fichier",
          variant: "error",
        })
      );
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.titleContainer}>
        <h1>Importer des fichiers</h1>
        <div className={styles.stepContainer}>
          <Button
            variant="muted"
            onClick={() => step !== 1 && setStep(1)}
            className={step === 1 ? styles.stepActive : styles.stepInactive}
          >
            1
          </Button>
          <Button
            variant="muted"
            onClick={() => step !== 2 && setStep(2)}
            className={step === 2 ? styles.stepActive : styles.stepInactive}
          >
            2
          </Button>

          <span
            className={step === 3 ? styles.stepActive : styles.stepInactive}
          >
            3
          </span>
        </div>
      </div>
      <div className={styles.stepContent}>
        {step === 1 && (
          <ImportFiles
            files={files}
            setFiles={setFiles}
            handleRemoveFile={handleRemoveFile}
            handleFileChange={handleFileChange}
            setStep={setStep}
          />
        )}
        {step === 2 && (
          <TransferForm
            handleUploadSubmit={handleUploadSubmit}
            uploadingFiles={uploadingFiles}
            setStep={setStep}
            transferName={transferName}
            setTransferName={setTransferName}
            transferDescription={transferDescription}
            setTransferDescription={setTransferDescription}
            isPrivate={isPrivate}
            setIsPrivate={setIsPrivate}
            transferStartDate={transferStartDate}
            setTransferStartDate={setTransferStartDate}
            transferEndDate={transferEndDate}
            setTransferEndDate={setTransferEndDate}
          />
        )}
        {step === 3 && (
          <div className={styles.step3}>
            {displayLoader ? (
              <div>
                <iframe
                  style={{
                    width: "100%",
                    height: "40vh",
                  }}
                  title="lottie-file"
                  src="https://lottie.host/?file=9ca06c71-2b46-42dc-a7f4-3cbba4154594/YMZZgH4aJ0.json"
                />
                <ProgressBar
                  bgcolor="#b2e4eb"
                  completed={completed}
                  textColor="#333"
                  fullText="Terminé"
                />
              </div>
            ) : (
              <>
                <iframe
                  style={{
                    width: "100%",
                    height: "50vh",
                  }}
                  title="lottie-file"
                  src="https://lottie.host/?file=70843af1-03e3-4ec8-90d1-19287754a914/RRuW9oL8zl.json"
                />
                <h2>
                  Votre transfert est prêt ! Vous pouvez le retrouver dans la
                  liste des transferts.
                </h2>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
