// import {
//   ChangeEventHandler,
//   InputHTMLAttributes,
//   LabelHTMLAttributes,
//   HTMLInputTypeAttribute,
//   HTMLAttributes,
//   ReactNode,
// } from "react";
// import styles from "../InputGroup/InputGroup.module.scss";

// type InputProps = Omit<
//   InputHTMLAttributes<HTMLInputElement>,
//   | "label"
//   | "type"
//   | "name"
//   | "placeholder"
//   | "value"
//   | "onChange"
//   | "checked"
//   | "inputMode"
//   | "autoComplete"
// >;
// type LabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor">;

// type Tag = Pick<JSX.IntrinsicElements, "input" | "textarea" | "select">;

// // type InputGroupProps = {
// //   label: string;
// //   type: HTMLInputTypeAttribute;
// //   name: string;
// //   placeholder: string;
// //   inputProps?: InputProps;
// //   labelProps?: LabelProps;
// //   icon?: React.ReactNode;
// //   error?: string;
// //   disabled?: boolean;
// //   value?: string | number;
// //   onChange?:
// //     | ChangeEventHandler<HTMLInputElement>
// //     | ChangeEventHandler<HTMLTextAreaElement>
// //     | ChangeEventHandler<HTMLSelectElement>;
// //   checked?: boolean;
// //   as?: keyof Tag;
// //   inputMode: HTMLAttributes<HTMLInputElement>["inputMode"];
// //   autoComplete?: string;
// //   multiple?: boolean;
// // };

// type InputGroupDefaultProps = {
//   label: string;
//   name: string;
//   inputProps?: InputProps;
//   labelProps?: LabelProps;
//   icon?: ReactNode;
//   error?: string;
//   disabled?: boolean;
//   value?: string | number;
//   onChange?: ChangeEventHandler<HTMLInputElement>;
//   as?: keyof Tag;
// };

// type InputGroupCheckboxProps = {
//   type: "checkbox";
//   checked: boolean;
//   multiple?: never;
//   children?: never;
// };

// type InputGroupFileProps = {
//   type: "file";
//   multiple?: boolean;
//   children?: never;
//   checked?: never;
// };

// type InputGroupSelectProps = {
//   type: never;
//   as: "select";
//   multiple?: never;
//   children: ReactNode;
//   checked?: never;
//   onChange?: ChangeEventHandler<HTMLSelectElement>;
// };

// type InputGroupTextProps = {
//   type: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
//   inputMode: HTMLAttributes<HTMLTextAreaElement>["inputMode"];
//   autoComplete?: string;
//   placeholder: string;
// };

// type ConditionalProps =
//   | InputGroupCheckboxProps
//   | InputGroupFileProps
//   | InputGroupSelectProps
//   | InputGroupTextProps;

// type InputGroupProps = InputGroupDefaultProps & ConditionalProps;

// export const InputGroup2 = ({
//   label,
//   placeholder,
//   icon,
//   error,
//   inputProps,
//   labelProps,
//   name,
//   type,
//   disabled,
//   value,
//   onChange,
//   as,
//   checked,
//   inputMode,
//   autoComplete,
//   multiple,
//   children,
// }: InputGroupProps) => {
//   const Tag = as ?? "input";
//   return (
//     <div className={styles.inputGroup}>
//       <label htmlFor={name} {...labelProps}>
//         <span>{label}</span>
//         <div className={styles.inputFieldContainer}>
//           {as !== "select" ? (
//             <Tag
//               autoComplete={autoComplete}
//               inputMode={
//                 type !== "checkbox" && type !== "file" ? inputMode : undefined
//               }
//               id={name}
//               type={type}
//               name={name}
//               placeholder={placeholder ?? undefined}
//               {...inputProps}
//               disabled={disabled}
//               value={type !== "checkbox" ? value : undefined}
//               checked={type === "checkbox" ? checked : undefined}
//               onChange={onChange}
//               multiple={type === "file" ? multiple : undefined}
//             />
//           ) : (
//             <Tag
//               autoComplete={autoComplete}
//               inputMode={
//                 type !== "checkbox" && type !== "file" ? inputMode : undefined
//               }
//               id={name}
//               type={type}
//               name={name}
//               placeholder={placeholder ?? undefined}
//               {...inputProps}
//               disabled={disabled}
//               value={type !== "checkbox" ? value : undefined}
//               checked={type === "checkbox" ? checked : undefined}
//               onChange={onChange}
//               multiple={type === "file" ? multiple : undefined}
//             >
//               {children}
//             </Tag>
//           )}

//           {icon}
//         </div>
//       </label>
//       {error && <span className={styles.error}>{error}</span>}
//     </div>
//   );
// };
// @ts-ignore
export const InputGroup2 = <C,>({
  as,
  children,
}: {
  as?: C;
  children: React.ReactNode;
}) => {
  const Component = as || "span";
  // @ts-ignore
  return <Component>{children}</Component>;
};
