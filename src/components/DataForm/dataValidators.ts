export type Validator<T> = (value: T) => string | null;

const getEmptyValueValidator: (descriptor: string) => Validator<string> =
  (descriptor: string) =>
  (value: string): string | null => {
    if (value.length !== 0) return null;
    return `${descriptor} cannot be empty`;
  };

const getMaxLengthValidator: (
  descriptor: string,
  maxLength: number
) => Validator<string> =
  (descriptor: string, maxLength: number) =>
  (value: string): string | null => {
    if (value.length <= maxLength) return null;
    return `${descriptor} is too large`;
  };

export const titleValidators = [
  getEmptyValueValidator("Title"),
  getMaxLengthValidator("Title", 30),
];

export const descriptionValidators = [
  getEmptyValueValidator("Description"),
  getMaxLengthValidator("Description", 500),
];
