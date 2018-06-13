import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router';
import createHistory from 'history/createBrowserHistory';

import './app.css';
import DateForm from './form';
import Countdown from './countdown';
import EmbedAddressBar from './embed-address-bar';

export default class App extends Component {
  static propTypes = {
    // this is defined as a prop with a default value so we can use a
    // memory-based history object in our tests
    history: PropTypes.object
  };

  static defaultProps = {
    // the default history is a browser history object
    history: createHistory()
  };

  render() {
    let { history } = this.props;

    return (
      <Router history={history}>
        <Fragment>
          {/* this is strictly for demo purposes */}
          <Route component={EmbedAddressBar} />

          <Switch>
            <Route path="/" exact component={DateForm} />
            <Route path="/:date*" exact component={Countdown} />
          </Switch>
        </Fragment>
      </Router>
    );
  }
}
