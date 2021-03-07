import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {
  Nav,
  Navbar
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Resorts from "./Views/Resorts";
import Home from "./Views/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar>
          <Navbar.Brand as={Link} to="/">SkiResorts</Navbar.Brand>
          <Nav>
            <Nav.Item>
              <Nav.Link as={Link} to="/">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/resorts">Resorts</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/users">Users</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
        <Switch>
          <Route path='/resorts'>
            <Resorts />
          </Route>
          <Route path='/users'>

          </Route>
          <Route path='/'>
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
