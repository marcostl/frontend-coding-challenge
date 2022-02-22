import { Link, useLocation, useParams } from "react-router-dom";
import { EditDataForm } from "../components/DataForm/DataForm";
import LoadingMessage from "../components/LoadingMessage";
import Page from "../components/Page";
import { MAIN_PATH } from "../constants";
import { Data, useDataQuery } from "../lib/fakeApollo";

const getDataForId = (dataList: Data[] | null, id: string): Data | null => {
  if (dataList === null) return null;
  return dataList.find((data) => data.id === id) || null;
};

const EditPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation<{ data?: Data }>();
  const { data: dataList, loading } = useDataQuery();

  const dataFromRouter =
    location.state === undefined ? null : location.state.data || null;
  const dataFromApollo = getDataForId(dataList, id);
  const data = dataFromRouter !== null ? dataFromRouter : dataFromApollo;

  return (
    <Page>
      <h1 className="text-2xl font-bold">Edit data</h1>
      {loading && data === null && <LoadingMessage message="Loading data..." />}
      {!loading && data === null && (
        <div>
          <p>Uh oh, something wrong happened</p>
          <Link to={MAIN_PATH} className="text-sm underline">
            Go back to main page
          </Link>
        </div>
      )}
      {data !== null && <EditDataForm data={data} />}
    </Page>
  );
};

export default EditPage;
