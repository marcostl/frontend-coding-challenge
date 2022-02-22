import "@testing-library/jest-dom";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { NewDataForm } from "./DataForm";
import { MAIN_PATH, NEW_PATH } from "../../constants";
import * as fakeApollo from "../../lib/fakeApollo";

describe("NewDataForm", () => {
  const renderDataForm = () =>
    render(
      <fakeApollo.FakeAPIProvider initialState={[]}>
        <MemoryRouter initialEntries={["/new"]}>
          <Route path={NEW_PATH}>
            <NewDataForm />
          </Route>
          <Route exact path={MAIN_PATH}>
            <div>Main page</div>
          </Route>
        </MemoryRouter>
      </fakeApollo.FakeAPIProvider>
    );

  it("should render the data form", () => {
    renderDataForm();

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("should have the button disabled if data is not valid", () => {
    renderDataForm();

    const button = screen.getByText("Add new data");

    expect(button).toBeDisabled();

    const titleInput = screen.getByLabelText("Title");
    const descriptionInput = screen.getByLabelText("Description");

    fireEvent.change(titleInput, { target: { value: "My title" } });
    fireEvent.change(descriptionInput, { target: { value: "My description" } });

    expect(button).toBeEnabled();
  });

  it("should clear the data if the clear all button is clicked", () => {
    renderDataForm();

    const button = screen.getByText("Clear all");

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "My title" } });
    fireEvent.change(descriptionInput, { target: { value: "My description" } });

    expect(titleInput.value).toBe("My title");
    expect(descriptionInput.value).toBe("My description");

    fireEvent.click(button);

    expect(titleInput.value).toBe("");
    expect(descriptionInput.value).toBe("");
  });

  it("should show a title's error if title is not valid", () => {
    renderDataForm();

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "My title" } });
    fireEvent.change(titleInput, { target: { value: "" } });

    expect(screen.getByText("Title cannot be empty")).toBeInTheDocument();
  });

  it("should show a descriptions's error if description is not valid", () => {
    renderDataForm();

    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;

    fireEvent.change(descriptionInput, { target: { value: "My description" } });
    fireEvent.change(descriptionInput, { target: { value: "" } });

    expect(screen.getByText("Description cannot be empty")).toBeInTheDocument();
  });

  it("should submit the data", () => {
    const useCreateMock = jest.fn();
    jest
      .spyOn(fakeApollo, "useCreateDataMutation")
      .mockImplementation(() => [useCreateMock, { loading: false }]);

    renderDataForm();

    const button = screen.getByText("Add new data");

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "My title" } });
    fireEvent.change(descriptionInput, { target: { value: "My description" } });

    expect(titleInput.value).toBe("My title");
    expect(descriptionInput.value).toBe("My description");

    expect(button).toBeEnabled();
    fireEvent.click(button);

    expect(useCreateMock).toHaveBeenCalledWith({
      data: { title: "My title", description: "My description" },
    });

    jest.restoreAllMocks();
  });

  it("should navigate to the main page when submitting data", async () => {
    renderDataForm();

    const button = screen.getByText("Add new data");

    const titleInput = screen.getByLabelText("Title") as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(
      "Description"
    ) as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: "My title" } });
    fireEvent.change(descriptionInput, { target: { value: "My description" } });

    expect(titleInput.value).toBe("My title");
    expect(descriptionInput.value).toBe("My description");

    expect(button).toBeEnabled();
    fireEvent.click(button);

    expect(screen.getByText("Saving your data...")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText("Main page")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );
  });
});
