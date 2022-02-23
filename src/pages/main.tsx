import { useCallback, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { PencilIcon, XIcon } from "@heroicons/react/outline";
import LoadingMessage from "../components/LoadingMessage";
import Page from "../components/Page";
import { EDIT_ID_PATH, MAIN_PATH, NEW_PATH } from "../constants";
import { Data, useRemoveDataMutation } from "../lib/fakeApollo";
import PageNavigator from "../components/PageNavigator";
import usePaginatedData from "../hooks/usePaginatedData";
import UndoRemovalProvider, {
  useUndoRemoval,
} from "../components/UndoRemoval/UndoRemoval";

const DataItem = ({ data }: { data: Data }) => {
  const history = useHistory();
  const { removeData } = useUndoRemoval();
  const [remove, { loading: loadingRemoval }] = useRemoveDataMutation();

  const handleRemove = useCallback(
    (data: Data) => {
      remove({ id: data.id });
      removeData(data);
    },
    [remove, removeData]
  );

  const handleEdit = useCallback(
    (data: Data) => {
      history.push(EDIT_ID_PATH(data.id), { data });
    },
    [history]
  );

  return (
    <li className="flex flex-col space-y-2">
      {loadingRemoval ? (
        <LoadingMessage message="Removing data..." />
      ) : (
        <>
          <div className="flex items-center space-x-1 font-semibold">
            <button onClick={() => handleRemove(data)}>
              <XIcon className="w-4 h-4" />
            </button>
            <button onClick={() => handleEdit(data)}>
              <PencilIcon className="w-4 h-4" />
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
  const {
    data: { dataList, loading },
    nav,
  } = usePaginatedData();
  const history = useHistory();
  const location = useLocation<{ goToLastPage?: boolean }>();

  const handleAdd = useCallback(() => {
    history.push(NEW_PATH);
  }, [history]);

  useEffect(() => {
    if (dataList !== null && location.state && location.state.goToLastPage) {
      nav.goToPage(nav.maxPages - 1);
      history.replace({ pathname: MAIN_PATH });
    }
  }, [location.state, nav, dataList, history]);

  return (
    <Page>
      <UndoRemovalProvider>
        <h1 className="text-2xl font-bold">Data points</h1>
        <button onClick={handleAdd} className="text-sm underline">
          Add new
        </button>
        {loading ? (
          <LoadingMessage />
        ) : (
          <ul className="space-y-4">
            {dataList?.map((data: Data) => (
              <DataItem key={data.id} data={data} />
            ))}
          </ul>
        )}
        {!loading && <PageNavigator navigator={nav} />}
      </UndoRemovalProvider>
    </Page>
  );
}

export default MainPage;
