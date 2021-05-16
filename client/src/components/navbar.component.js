import React, { Component } from "react";
import { connect } from "react-redux";


import UserService from "../services/user.service";

class Navbar extends Component {

  render() {

    const { user: currentUser } = this.props;


    if(currentUser.roles[0] == "ROLE_ADMIN"){
        return (
            <div>
                <ul>
                    <li> Manage Users </li>
                    <li> Logout </li>
                </ul>
            </div>
        );
    }
    else {
      return (
        <div>
            <ul>
                <li> Logout </li>
            </ul>
        </div>
    );
    }
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Navbar);