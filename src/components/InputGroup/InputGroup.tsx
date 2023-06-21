import {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  HTMLInputTypeAttribute,
  HTMLAttributes,
  ChangeEvent,
} from "react";
import styles from "./InputGroup.module.scss";

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

export type InputGroupProps = {
  label: string;
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => void;
  checked?: boolean;
  as?: keyof Tag;
  inputMode: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  multiple?: boolean;
  defaultValue?: string;
  required?: boolean;
  iconPosition?: "left" | "right";
  width?: React.CSSProperties["width"];
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
  as,
  checked,
  inputMode,
  autoComplete,
  multiple,
  defaultValue,
  required,
  iconPosition,
  width,
}: InputGroupProps) => {
  const Tag = as ?? "input";
  let computedClassName = styles.inputFieldContainer;
  if (icon) {
    if (!iconPosition || iconPosition === "left") {
      computedClassName = `${computedClassName} ${styles.inputFieldContainer__iconLeft}`;
    }
    if (iconPosition === "right") {
      computedClassName = `${computedClassName} ${styles.inputFieldContainer__iconRight}`;
    }
  }

  return (
    <div className={styles.inputGroup} style={{ width }}>
      <label htmlFor={name} {...labelProps}>
        <span>{label}</span>
        <div className={computedClassName}>
          {/* @ts-expect-error should throw an error if the type does not accept the prop */}
        <div className={styles.inputFieldContainer}>
          <Tag
            autoComplete={autoComplete}
            inputMode={
              type !== "checkbox" && type !== "file" ? inputMode : undefined
            }
            id={name}
            type={type}
            name={name}
            placeholder={type !== "checkbox" ? placeholder : undefined}
            {...inputProps}
            disabled={disabled}
            value={type !== "checkbox" ? value : undefined}
            checked={type === "checkbox" ? checked : undefined}
            onChange={onChange}
            multiple={type === "file" ? multiple : undefined}
            defaultValue={defaultValue}
            required={required}
          />
          {icon}
        </div>
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};
