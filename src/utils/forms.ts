import { FormEvent } from "react";

/**
 * getFormData function return the data of a form element
 *
 * @param {FormEvent<HTMLFormElement>} event
 * @return {Object} data
 *  */
export const getFormData = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  return Object.fromEntries(formData.entries());
};
