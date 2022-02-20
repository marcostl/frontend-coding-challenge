import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Data, FakeAPIProvider } from "./lib/fakeApollo";
import EditPage from "./pages/edit";
import MainPage from "./pages/main";
import NewPage from "./pages/new";

const INITIAL_DATA: Data[] = [
  {
    title: "Hello world",
    description: "From: your neighbour, Mars",
    id: uuid(),
  },
  {
    title: "Some more data",
    description: "Because one can never get enough",
    id: uuid(),
  },
  {
    title: "This has a long description",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    id: uuid(),
  },
];

export default function App() {
  return (
    <FakeAPIProvider initialState={INITIAL_DATA}>
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
