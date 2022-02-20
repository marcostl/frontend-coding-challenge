import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { FakeAPIProvider } from "./lib/fakeApollo";
import EditPage from "./pages/edit";
import MainPage from "./pages/main";
import NewPage from "./pages/new";

export default function App() {
  return (
    <FakeAPIProvider
      initialState={[
        { title: "Hello world", id: uuid() },
        { title: "Some more data", id: uuid() },
      ]}
    >
      <Router>
        <Switch>
          <Route exact path="/new">
            <NewPage />
          </Route>
          <Route exact path="/edit/:id">
            <EditPage />
          </Route>
          <Route path="/">
            <MainPage />
          </Route>
        </Switch>
      </Router>
    </FakeAPIProvider>
  );
}
