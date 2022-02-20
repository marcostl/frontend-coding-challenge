import { useCallback } from "react";
import { useDataQuery, useRemoveDataMutation } from "../lib/fakeApollo";
import { XIcon } from "@heroicons/react/outline";

function MainPage() {
  const { data, loading } = useDataQuery();

  const [remove] = useRemoveDataMutation();
  const handleRemove = useCallback(
    (id: string) => {
      remove({ id });
    },
    [remove]
  );

  const handleAdd = useCallback(() => {
    alert("not implemeted");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Data points</h1>
        <ul>
          {data?.map((x) => (
            <li key={x.id} className="flex items-center space-x-2">
              <span>{x.title}</span>
              <button onClick={() => handleRemove(x.id)}>
                <XIcon className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleAdd} className="text-sm underline">
          Add new
        </button>
      </div>
    </div>
  );
}

export default MainPage;
