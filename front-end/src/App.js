import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Ship from "./Ship";
import Crewmember from "./Crewmember";

function App() {
  return (
      <Router>
        <Switch>
          <Route exact path="/crewmember/:id">
            <Crewmember/>
          </Route>
          <Route path="/">
            <Ship />
          </Route>

        </Switch>
      </Router>
  );
}

export default App;
