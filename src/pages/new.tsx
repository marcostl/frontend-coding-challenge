import { NewDataForm } from "../components/DataForm/DataForm";
import Page from "../components/Page";

const NewPage = () => {
  return (
    <Page>
      <h1 className="text-2xl font-bold">New data</h1>
      <NewDataForm />
    </Page>
  );
};

export default NewPage;
