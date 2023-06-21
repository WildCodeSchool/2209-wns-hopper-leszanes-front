import * as SelectPrimitive from "@radix-ui/react-select";
import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./Select.module.scss";

type Group = {
  id: string | number;
  groupContainer?: SelectPrimitive.SelectGroupProps &
    React.RefAttributes<HTMLDivElement>;
  groupLabel: SelectPrimitive.SelectLabelProps &
    React.RefAttributes<HTMLDivElement>;
  groupItems: Item[];
};

type Item = {
  id: string | number;
  itemContainer?: SelectPrimitive.SelectItemProps &
    React.RefAttributes<HTMLDivElement>;
  itemLabel: SelectPrimitive.SelectItemTextProps &
    React.RefAttributes<HTMLSpanElement>;
  itemIndicator?: SelectPrimitive.SelectItemIndicatorProps &
    React.RefAttributes<HTMLSpanElement>;
};

type Separator = {
  id: string | number;
  separatorContainer?: SelectPrimitive.SelectSeparatorProps &
    React.RefAttributes<HTMLDivElement>;
};

type AdditionalProps = {
  label: string;
  name: string;
  items: (Item | Group | Separator)[];
  displayLabel?: string;
  className?: string;
};

export type SelectProps = SelectPrimitive.SelectProps & AdditionalProps;

export const Select = ({
  label,
  name,
  items,
  defaultValue,
  value,
  onValueChange,
  autoComplete,
  disabled,
  required,
  dir,
  open,
  defaultOpen,
  displayLabel,
  className,
}: SelectProps) => {
  const renderItems = useMemo(() => {
    return items.map((item) => {
      if ("itemLabel" in item) {
        return (
          <SelectPrimitive.Item
            className={`${styles.select__item} ${
              item.itemContainer?.className ?? ""
            }`}
            key={`${name}-direct-item-${item.id}`}
            value={item.itemContainer?.value ?? ""}
            disabled={item.itemContainer?.disabled ?? false}
            {...item.itemContainer}
          >
            <SelectPrimitive.ItemText
              className={`${styles.select__itemText} ${
                item.itemLabel.className ?? ""
              }`}
              {...item.itemLabel}
            />
            <SelectPrimitive.ItemIndicator
              className={`${styles.select__itemIndicator} ${
                item.itemIndicator?.className ?? ""
              }`}
              {...item.itemIndicator}
            />
          </SelectPrimitive.Item>
        );
      }
      if ("groupLabel" in item) {
        return (
          <SelectPrimitive.Group
            className={`${styles.select__group} ${
              item.groupContainer?.className ?? ""
            }`}
            key={`${name}-group-${item.id}`}
            {...item.groupContainer}
          >
            <SelectPrimitive.Label
              {...item.groupLabel}
              className={`${styles.select__groupLabel} ${
                item.groupLabel.className ?? ""
              }`}
            />
            {item.groupItems.map((groupItem) => {
              return (
                <SelectPrimitive.Item
                  className={`${styles.select__item} ${
                    groupItem.itemContainer?.className ?? ""
                  }`}
                  key={`${name}-group-item-${groupItem.id}`}
                  value={groupItem.itemContainer?.value ?? ""}
                  disabled={groupItem.itemContainer?.disabled ?? false}
                >
                  <SelectPrimitive.ItemText
                    className={`${styles.select__itemText} ${
                      groupItem.itemLabel.className ?? ""
                    }`}
                    {...groupItem.itemLabel}
                  />
                  <SelectPrimitive.ItemIndicator
                    className={`${styles.select__itemIndicator} ${
                      groupItem.itemIndicator?.className ?? ""
                    }`}
                    {...groupItem.itemIndicator}
                  />
                </SelectPrimitive.Item>
              );
            })}
          </SelectPrimitive.Group>
        );
      }
      return (
        <SelectPrimitive.Separator
          className={`${styles.select__separator} ${
            item.separatorContainer?.className ?? ""
          }`}
          key={`${name}-separator-${item.id}`}
          {...item.separatorContainer}
        />
      );
    });
  }, [items, name]);
  return (
    <label htmlFor={name} className={`${styles.select} ${className ?? ""}`}>
      <span className={styles.select__label}>{displayLabel}</span>
      <SelectPrimitive.Root
        name={name}
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange}
        autoComplete={autoComplete}
        defaultOpen={defaultOpen}
        disabled={disabled}
        required={required}
        dir={dir}
        open={open}
      >
        <SelectPrimitive.Trigger className={styles.select__trigger} id={name}>
          <SelectPrimitive.Value>{label}</SelectPrimitive.Value>
          <SelectPrimitive.Icon asChild className={styles.select__icon}>
            <ChevronDown />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className={styles.select__content}>
            <SelectPrimitive.ScrollUpButton />
            <SelectPrimitive.Viewport className={styles.select__viewport}>
              {renderItems}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton />
            <SelectPrimitive.Arrow />
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </label>
  );
};
