import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function (ComposedComponent) {

  // If user not authenticated render out to root

  class Authentication extends Component {
    static contextTypes = {
      router: React.PropTypes.object
    };

    componentWillMount() {
      if (!this.props.userInformation.email) {
        this.context.router.push('/');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.userInformation.email) {
        this.context.router.push('/');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return { userInformation: state.userInformation }
  }

  return connect(mapStateToProps)(Authentication);
}