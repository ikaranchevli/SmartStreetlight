import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import { connect } from "react-redux";

class Dashboard extends Component {
    render() {
        const { user: currentUser } = this.props;

        if(!currentUser) {
            return <Redirect to="/login" />;
        }

        return (
                <h3>
                  <strong>{currentUser.firstname} {currentUser.lastname} Role:{currentUser.roles[0]}</strong> Dashboard
                </h3>
          );
    }
}

function mapStateToProps(state) {
    const { user } = state.auth;
    return {
      user,
    };
  }
  
  export default connect(mapStateToProps)(Dashboard);