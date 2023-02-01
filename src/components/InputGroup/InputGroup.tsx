import { ChangeEventHandler } from "react";
import styles from "./InputGroup.module.scss";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "label" | "type" | "name" | "placeholder" | "value" | "onChange"
>;
type LabelProps = Omit<React.LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">;

type InputGroupProps = {
  label: string;
  type: React.HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const InputGroup = ({
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
}: InputGroupProps) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={name} {...labelProps}>
        <span>{label}</span>
        <div className={styles.inputFieldContainer}>
          <input
            id={name}
            type={type}
            name={name}
            placeholder={placeholder}
            {...inputProps}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
          {icon}
        </div>
      </label>
      {error && <span className={error}>{error}</span>}
    </div>
  );
};
