import {
  ChangeEventHandler,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  HTMLInputTypeAttribute,
  HTMLAttributes,
  ReactNode,
} from "react";
import styles from "../InputGroup/InputGroup.module.scss";

type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "label"
  | "type"
  | "name"
  | "placeholder"
  | "value"
  | "onChange"
  | "checked"
  | "inputMode"
  | "autoComplete"
>;
type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">;

type Tag = Pick<JSX.IntrinsicElements, "input" | "textarea" | "select">;

// type InputGroupProps = {
//   label: string;
//   type: HTMLInputTypeAttribute;
//   name: string;
//   placeholder: string;
//   inputProps?: InputProps;
//   labelProps?: LabelProps;
//   icon?: React.ReactNode;
//   error?: string;
//   disabled?: boolean;
//   value?: string | number;
//   onChange?:
//     | ChangeEventHandler<HTMLInputElement>
//     | ChangeEventHandler<HTMLTextAreaElement>
//     | ChangeEventHandler<HTMLSelectElement>;
//   checked?: boolean;
//   as?: keyof Tag;
//   inputMode: HTMLAttributes<HTMLInputElement>["inputMode"];
//   autoComplete?: string;
//   multiple?: boolean;
// };

type InputGroupDefaultProps = {
  label: string;
  name: string;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler;
  as: keyof Tag;
};

type InputGroupCheckboxProps = {
  type: "checkbox";
  checked?: boolean;
};

type InputGroupFileProps = {
  type: "file";
  multiple?: boolean;
};

type InputGroupSelectProps = {
  type: "select";
  children: ReactNode;
};

type InputGroupTextProps = {
  type: "textarea";
  inputMode: HTMLAttributes<HTMLTextAreaElement>["inputMode"];
  autoComplete?: string;
  placeholder: string;
};

type ConditionalProps =
  | InputGroupCheckboxProps
  | InputGroupFileProps
  | InputGroupSelectProps
  | InputGroupTextProps;

type InputGroupProps = InputGroupDefaultProps & ConditionalProps;

export const InputGroup2 = ({
  label,
  placeholder,
  icon,
  error,
  inputProps,
  labelProps,
  name,
  type,
  disabled,
  value,
  onChange,
  as,
  checked,
  inputMode,
  autoComplete,
  multiple,
}: InputGroupProps) => {
  const Tag = as ?? "input";
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} {...labelProps}>
        <span>{label}</span>
        <div className={styles.inputFieldContainer}>
          <Tag
            autoComplete={autoComplete}
            inputMode={
              type !== "checkbox" && type !== "file" ? inputMode : undefined
            }
            id={name}
            type={type}
            name={name}
            placeholder={placeholder ?? undefined}
            {...inputProps}
            disabled={disabled}
            value={type !== "checkbox" ? value : undefined}
            checked={type === "checkbox" ? checked : undefined}
            onChange={onChange}
            multiple={type === "file" ? multiple : undefined}
          />
          {icon}
        </div>
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
