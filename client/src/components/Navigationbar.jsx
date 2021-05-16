import React, { Component } from "react";
import { connect } from "react-redux";
import "./Navigationbar/Navigationbar.css";
import streetlightLogo from "./images/streetlightLogo.svg";
import userAccount from "./images/userAccount.jpg";
import "bootstrap/dist/css/bootstrap.css";
import { logout } from "../actions/auth";

class Navigationbar extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      menu: false,
    };
  }

  logOut() {
    this.props.dispatch(logout());
  }
  render() {
    const { user: currentUser } = this.props;
    return (
      <>
        <nav>
          <div className="parent">
            <div>
              <img
                src="https://jemena.com.au/jemena/siteassets/images/jemena-logo.svg"
                alt="jemena"
                className="brand1"
                href="/http://localhost:3000/users"
              />
            </div>
            <div className="child1"></div>
            <div className="child2"></div>
            <div>
              <img alt="portal" src={streetlightLogo} className="brand2" />
            </div>
            <div className="user-profile">
              <img alt="user" src={userAccount} className="user-image" />
            </div>
            <div
              className="user-info"
              onClick={() => this.setState({ menu: !this.state.menu })}
            >
              <div className="user-name-area">
                <text className="user-name">{currentUser.firstname}</text>
              </div>
              <div className="user-type-area">
                <text className="user-type">Councilman</text>
              </div>
              <div className="arrow-area">
                <div className="dropdown-arrow"></div>
                {this.state.menu && (
                  <div className="dropdown-menu-area">
                    <div className="dropdown-menu-items">
                      <a href="/users" className="dropdown-menu-text">
                        Manage Users
                      </a>
                    </div>
                    <div className="dropdown-menu-items">
                      <a href="#" className="dropdown-menu-text">
                        Edit Account
                      </a>
                    </div>
                    <hr className="solid"></hr>
                    <div className="dropdown-menu-items">
                      <a
                        href="#"
                        className="dropdown-menu-text"
                        onClick={this.logOut}
                      >
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Navigationbar);
