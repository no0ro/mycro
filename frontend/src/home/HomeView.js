import React, { Component } from 'react';
import ReactGA from 'react-ga';
import PropTypes from 'prop-types'

class Home extends Component {
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
    this.context.mixpanel.track("HomeView", this.state);
  }

  render() {
    return (
      <div className="Page">
        <p>Hello World</p>
      </div>
    );
  }
}

Home.contextTypes = {
    mixpanel: PropTypes.object.isRequired
};

export default Home;
