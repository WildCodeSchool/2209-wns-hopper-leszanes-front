import styles from "./InputGroup.module.scss";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "label" | "type" | "name" | "placeholder"
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
          />
          {icon}
        </div>
      </label>
      {error && <span className={error}>{error}</span>}
    </div>
  );
};
