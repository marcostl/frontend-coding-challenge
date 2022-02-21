import { useEffect, useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import { MAIN_PATH } from "../../constants";
import { useCreateDataMutation } from "../../lib/fakeApollo";
import LoadingMessage from "../LoadingMessage";
import "./dataForm.css";
import {
  FormInput,
  dataFormReducer,
  initialDataFormState,
} from "./dataFormReducer";

const FormLabel = ({
  formInput,
  htmlFor,
  label,
}: {
  formInput: FormInput<string>;
  htmlFor: string;
  label: string;
}) => {
  return (
    <label htmlFor={htmlFor} className="font-semibold p-1">
      {label}
      {formInput.error !== null && (
        <span className="font-normal text-red-500 ml-1 pl-1 border-l-2 border-red-500">
          {formInput.error}
        </span>
      )}
    </label>
  );
};

const DataForm = () => {
  const history = useHistory();
  const [dataSubmitted, setDataSubmitted] = useState(false);
  const [formState, dispatch] = useReducer(
    dataFormReducer,
    initialDataFormState
  );
  const [createData, { loading }] = useCreateDataMutation();

  useEffect(() => {
    if (dataSubmitted && !loading) {
      history.push(MAIN_PATH);
    }
  }, [dataSubmitted, loading, history]);

  const { title, description } = formState;

  const dataIsValid =
    title.touched &&
    title.error === null &&
    description.touched &&
    description.error === null;

  return (
    <form
      className="flex flex-col items-start"
      onSubmit={(e) => {
        e.preventDefault();
        if (!dataIsValid) return;
        createData({
          data: { title: title.value, description: description.value },
        });
        setDataSubmitted(true);
      }}
    >
      <FormLabel htmlFor="title" label="Title" formInput={title} />
      <input
        disabled={loading}
        className="formInput"
        id="title"
        type="text"
        placeholder="Your data's title"
        value={title.value}
        onChange={(e) =>
          dispatch({ type: "UPDATE_TITLE", payload: e.currentTarget.value })
        }
      />
      <FormLabel
        htmlFor="description"
        label="Description"
        formInput={description}
      />
      <textarea
        disabled={loading}
        className="formInput"
        id="description"
        placeholder="Your data's description"
        value={description.value}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_DESCRIPTION",
            payload: e.currentTarget.value,
          })
        }
      />
      <div className="space-x-2 flex">
        <button
          className="formButton bg-gray-700 text-white"
          type="button"
          onClick={() => dispatch({ type: "CLEAR_DATA" })}
        >
          Clear all
        </button>
        {loading ? (
          <LoadingMessage message="Saving your data..." />
        ) : (
          <button disabled={!dataIsValid} type="submit" className="formButton">
            Add new data
          </button>
        )}
      </div>
    </form>
  );
};

export default DataForm;
