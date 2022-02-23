import { Data } from "../../lib/fakeApollo";
import {
  descriptionValidators,
  titleValidators,
  Validator,
} from "./dataValidators";

export type FormInput<T> = {
  value: T;
  touched: boolean;
  error: string | null;
};

export type FormState = {
  title: FormInput<string>;
  description: FormInput<string>;
};

export type FormAction =
  | {
      type: "UPDATE_TITLE";
      payload: string;
    }
  | {
      type: "UPDATE_DESCRIPTION";
      payload: string;
    }
  | { type: "CLEAR_DATA" };

export const emptyDataFormState: FormState = {
  title: {
    value: "",
    touched: false,
    error: null,
  },
  description: {
    value: "",
    touched: false,
    error: null,
  },
};

export const getInitialDataFormState = (data: Data): FormState => ({
  title: {
    value: data.title,
    touched: true,
    error: getErrorForValue(data.title, titleValidators),
  },
  description: {
    value: data.description,
    touched: true,
    error: getErrorForValue(data.description, descriptionValidators),
  },
});

const getErrorForValue = <T>(
  value: T,
  validators: Validator<T>[]
): string | null => {
  let error = null;

  validators.find((validator) => {
    const validatorError = validator(value);
    if (validatorError !== null) {
      error = validatorError;
      return true;
    }
    return false;
  });

  return error;
};

export const dataFormReducer = (
  state: FormState = emptyDataFormState,
  action: FormAction
): FormState => {
  switch (action.type) {
    case "UPDATE_TITLE":
      return {
        ...state,
        title: {
          ...state.title,
          value: action.payload,
          touched: true,
          error: getErrorForValue(action.payload, titleValidators),
        },
      };
    case "UPDATE_DESCRIPTION":
      return {
        ...state,
        description: {
          ...state.description,
          value: action.payload,
          touched: true,
          error: getErrorForValue(action.payload, descriptionValidators),
        },
      };
    case "CLEAR_DATA":
      return {
        ...state,
        title: { value: "", touched: false, error: null },
        description: { value: "", touched: false, error: null },
      };
    default:
      return { ...state };
  }
};
