import {
  emptyDataFormState,
  FormAction,
  FormState,
  dataFormReducer as originalDataFormReducer,
} from "./dataFormReducer";
import { Validator } from "./dataValidators";

describe("dataReducer", () => {
  let dataFormReducer: typeof originalDataFormReducer;
  let mockValidators: Validator<string>[];

  const mockDataValidators = (errors: (string | null)[] = [null]) => {
    jest.resetModules();
    mockValidators = errors.map((error) => {
      return jest.fn().mockReturnValue(error);
    });
    jest.doMock("./dataValidators", () => ({
      titleValidators: mockValidators,
      descriptionValidators: mockValidators,
    }));
    dataFormReducer = require("./dataFormReducer").dataFormReducer;
  };

  const checkMockValidators = (value: string) => {
    mockValidators.forEach((validator) => {
      expect(validator).toHaveBeenCalledWith(value);
    });
  };

  beforeEach(() => {
    mockDataValidators();
  });

  it("should return the state unchanged if the action is invalid", () => {
    const state = dataFormReducer({ title: {} } as FormState, {} as FormAction);
    expect(state).toStrictEqual({ title: {} });
  });

  it("should update the title", () => {
    const state = dataFormReducer(emptyDataFormState, {
      type: "UPDATE_TITLE",
      payload: "My title",
    });

    expect(state).toStrictEqual({
      ...emptyDataFormState,
      title: { value: "My title", touched: true, error: null },
    });
    checkMockValidators("My title");
  });

  it("should update the description", () => {
    const state = dataFormReducer(emptyDataFormState, {
      type: "UPDATE_DESCRIPTION",
      payload: "My description",
    });

    expect(state).toStrictEqual({
      ...emptyDataFormState,
      description: { value: "My description", touched: true, error: null },
    });
    checkMockValidators("My description");
  });

  it("should update the title with an error if the validation fails", () => {
    mockDataValidators(["titleError"]);

    const state = dataFormReducer(emptyDataFormState, {
      type: "UPDATE_TITLE",
      payload: "My title",
    });

    expect(state).toStrictEqual({
      ...emptyDataFormState,
      title: { value: "My title", touched: true, error: "titleError" },
    });
    checkMockValidators("My title");
  });

  it("should update the description with an error if the validation fails", () => {
    mockDataValidators(["descriptionError"]);

    const state = dataFormReducer(emptyDataFormState, {
      type: "UPDATE_DESCRIPTION",
      payload: "My description",
    });

    expect(state).toStrictEqual({
      ...emptyDataFormState,
      description: {
        value: "My description",
        touched: true,
        error: "descriptionError",
      },
    });
    checkMockValidators("My description");
  });

  it("should iterate over all validators until one of them fails", () => {
    mockDataValidators([null, "error1", "error2"]);

    const state = dataFormReducer(emptyDataFormState, {
      type: "UPDATE_TITLE",
      payload: "My title",
    });

    expect(state).toStrictEqual({
      ...emptyDataFormState,
      title: { value: "My title", touched: true, error: "error1" },
    });
    expect(mockValidators[0]).toHaveBeenCalledWith("My title");
    expect(mockValidators[1]).toHaveBeenCalledWith("My title");
    expect(mockValidators[2]).not.toHaveBeenCalledWith("My title");
  });

  it("should clear the data", () => {
    const state = dataFormReducer(emptyDataFormState, {
      type: "CLEAR_DATA",
    });
    expect(state).toStrictEqual(emptyDataFormState);
  });
});
