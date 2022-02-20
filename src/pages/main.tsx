import { useCallback } from "react";
import { XIcon } from "@heroicons/react/outline";
import LoadingMessage from "../components/LoadingMessage";
import { Data, useDataQuery, useRemoveDataMutation } from "../lib/fakeApollo";

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

  const handleAdd = useCallback(() => {
    alert("not implemeted");
  }, []);

  return (
    <div className="flex justify-center py-8 min-h-screen w-screen">
      <div className="w-4/5 space-y-6">
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
      </div>
    </div>
  );
}

export default MainPage;
