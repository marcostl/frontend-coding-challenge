import { useCallback } from "react";
import { XIcon } from "@heroicons/react/outline";
import LoadingMessage from "../components/LoadingMessage";
import { Data, useDataQuery, useRemoveDataMutation } from "../lib/fakeApollo";
import { useHistory } from "react-router-dom";
import { NEW_PATH } from "../constants";
import Page from "../components/Page";

const DataItem = ({ data }: { data: Data }) => {
  const [remove, { loading: loadingRemoval }] = useRemoveDataMutation();
  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove]
  );

  return (
    <li className="flex flex-col space-y-2">
      {loadingRemoval ? (
        <LoadingMessage message="Removing data..." />
      ) : (
        <>
          <div className="flex items-center space-x-1 font-semibold">
            <button onClick={() => handleRemove(data.id)}>
              <XIcon className="w-4 h-4" />
            </button>
            <span>{data.title}</span>
          </div>
          <p className="text-justify">{data.description}</p>
        </>
      )}
    </li>
  );
};

function MainPage() {
  const { data: dataList, loading } = useDataQuery();
  const history = useHistory();

  const handleAdd = useCallback(() => {
    history.push(NEW_PATH);
  }, [history]);

  return (
    <Page>
      <h1 className="text-2xl font-bold">Data points</h1>
      {loading ? (
        <LoadingMessage />
      ) : (
        <ul className="space-y-4">
          {dataList?.map((data: Data) => (
            <DataItem key={data.id} data={data} />
          ))}
        </ul>
      )}
      <button onClick={handleAdd} className="text-sm underline">
        Add new
      </button>
    </Page>
  );
}

export default MainPage;
