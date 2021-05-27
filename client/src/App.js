import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "./App.css";

import Login from "./components/login.component";
import Navigationbar from "./components/navbar.component";
import Portal from "./components/Portal.jsx";
import UsersTable from "./components/UserTable.jsx";
import Modal from "./components/BootstrapModal";
import DeviceSummary from "./components/DeviceSummary.jsx";

import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";

import { history } from "./helpers/history";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
        showAdminContent: user.roles.includes("ROLE_ADMIN"),
      });
    }
  }

  logOut() {
    this.props.dispatch(logout());
  }

  render() {
    const { currentUser, showAdminContent } = this.state;

    return (
      <div>
        <Router history={history}>
          <Switch>
            <Route exact path={["/", "/login"]} component={Login} />
            <Route exact path="/portal" component={Portal} />
            <Route path="/navbar" component={Navigationbar} />
            <Route path="/users" component={UsersTable} />
            <Route path="/modal" component={Modal} />
            <Route path="/devicesummary" component={DeviceSummary} />
          </Switch>
        </Router>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);
