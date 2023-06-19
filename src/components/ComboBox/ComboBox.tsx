import { Key } from "react";
import { InputGroup, InputGroupProps } from "../InputGroup/InputGroup";
import styles from "./ComboBox.module.scss";

type KeyOfTWhoIsAString<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type KeyOfTWhoIsAKey<T> = {
  [K in keyof T]: T[K] extends Key ? K : never;
}[keyof T];

type InputGroupPropsForComboBox = Omit<InputGroupProps, "type" | "inputMode">;

export type ComboBoxProps<T> = {
  dataList: T[];
  dataListKeys: KeyOfTWhoIsAKey<T>;
  dataListValues: KeyOfTWhoIsAString<T>;
  dataListItems: KeyOfTWhoIsAString<T>;
} & InputGroupPropsForComboBox;

export const ComboBox = <T,>({
  dataList,
  dataListKeys,
  dataListValues,
  dataListItems,
  ...props
}: ComboBoxProps<T>) => {
  return (
    <>
      <InputGroup
        {...props}
        type="search"
        inputMode="search"
        inputProps={{
          ...props.inputProps,
          list: `${props.name}-list`,
        }}
      />
      <datalist id={`${props.name}-list`} style={{ display: "none" }}>
        {dataList.map((item) => (
          <option
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // @ts-expect-error dataListKeys is a string
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            key={item[dataListKeys as string]}
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            // @ts-expect-error dataListKeys is a string
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            value={item[dataListValues]}
          >
            {item[dataListItems as string]}
          </option>
        ))}
      </datalist>
    </>
  );
};
