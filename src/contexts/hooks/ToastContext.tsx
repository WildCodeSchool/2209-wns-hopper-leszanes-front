import { Provider, Viewport } from "@radix-ui/react-toast";
import {
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Toast } from "../../components/Toast/Toast";
import styles from "./ToastContext.module.scss";

export type ToastType = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  variant?: "success" | "error";
};

const defaultCreateToastRef: (toast: ToastType) => void = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  _toast: ToastType
  // eslint-disable-next-line @typescript-eslint/no-empty-function
) => {};

const defaultValue = {
  createToastRef: { current: defaultCreateToastRef },
};

export type ToastContextData = {
  createToastRef: MutableRefObject<(toast: ToastType) => void>;
};

const toastContext = createContext<ToastContextData>(
  defaultValue as ToastContextData
);

const ToastProvider = toastContext.Provider;

const Toasts = () => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const { createToastRef } = useContext(toastContext);
  createToastRef.current = useCallback(
    (toast: ToastType) => {
      setToasts((prevToasts) => [...prevToasts, toast]);
    },
    [setToasts]
  );
  return (
    <Provider swipeDirection="left">
      <Viewport className={styles.toasts}>
        {toasts.map((toast) => {
          return <Toast key={toast.id} {...toast} />;
        })}
      </Viewport>
    </Provider>
  );
};

export const ToastContextProvider = ({ children }: PropsWithChildren) => {
  const createToastRef = useRef(defaultCreateToastRef);
  return (
    <ToastProvider
      value={{
        createToastRef,
      }}
    >
      <Toasts />
      {children}
    </ToastProvider>
  );
};

export const useToast = () => {
  const { createToastRef } = useContext(toastContext);
  const createToast = useCallback(
    (toast: ToastType) => {
      createToastRef.current({
        ...toast,
        id: toast.id
          ? toast.id + Math.random().toString()
          : Math.random().toString(),
      });
    },
    [createToastRef]
  );

  return {
    createToast,
  };
};
