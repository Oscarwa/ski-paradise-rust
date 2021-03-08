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
import UserRegistration from "./Views/UserRegistration";
import ThankYou from "./Views/ThankYou";
import Report from "./Views/Report";

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
              <Nav.Link as={Link} to="/report">Report</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar>
          <Switch>
            <Route path='/resorts'>
              <Resorts />
            </Route>
            <Route path='/users'>
              <UserRegistration />
            </Route>
            <Route path='/report'>
              <Report />
            </Route>
            <Route path='/thank-you'>
              <ThankYou />
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
