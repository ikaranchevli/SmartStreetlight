import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { validate } from "react-email-validator";
import ssl_logo from "../ssl_logo.svg";
import logo from "../logo.svg";

import { connect } from "react-redux";
import { login } from "../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-secondary" role="alert">
        This field is required!
      </div>
    );
  }
};

const validateEmail = (value) => {
  if (!value) {
    return (
      <div className="alert alert-secondary" role="alert">
        This field is required!
      </div>
    );
  } else if (!validate(value)) {
    return (
      <div className="alert alert-secondary" role="alert">
        Valid Email address is required!
      </div>
    );
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: false,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    this.form.validateAll();

    const { dispatch, history } = this.props;

    if (this.checkBtn.context._errors.length === 0) {
      dispatch(login(this.state.email, this.state.password))
        .then(() => {
          history.push("/portal");
          window.location.reload();
        })
        .catch(() => {
          this.setState({
            loading: false,
          });
        });
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { isLoggedIn, message } = this.props;

    if (isLoggedIn) {
      return <Redirect to="/portal" />;
    }

    return (
      <div className="d-lg-flex half">
        <div className="bg order-2 halfleft order-md-1">
          <div className="text-center">
            <img
              className="ssl-logo align-middle img-fluid"
              src={ssl_logo}
            ></img>
          </div>
        </div>
        <div className="contents order-1 order-md-2">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-7">
                <div className="text-center">
                  <img className="logo img-fluid" src={logo}></img>
                </div>
                <h3>Hi, Welcome Back!</h3>
                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
                <Form
                  onSubmit={this.handleLogin}
                  ref={(c) => {
                    this.form = c;
                  }}
                >
                  <div className="form-group first">
                    <label htmlFor="email">Email</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      placeholder="your-email@company.com"
                      value={this.state.email}
                      onChange={this.onChangeEmail}
                      validations={[validateEmail]}
                    />
                  </div>
                  <div className="form-group last mb-3">
                    <label htmlFor="password">Password</label>
                    <Input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Your password"
                      value={this.state.password}
                      onChange={this.onChangePassword}
                      validations={[required]}
                    />
                  </div>
                  <button
                    className="btn btn-login btn-primary btn-block"
                    disabled={this.state.loading}
                  >
                    {this.state.loading && (
                      <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                  </button>

                  <CheckButton
                    style={{ display: "none" }}
                    ref={(c) => {
                      this.checkBtn = c;
                    }}
                  />
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
  };
}

export default connect(mapStateToProps)(Login);
