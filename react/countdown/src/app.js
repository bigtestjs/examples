import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Switch } from 'react-router';
import createHistory from 'history/createBrowserHistory';

import './app.css';
import DateForm from './form';
import Countdown from './countdown';

export default class App extends Component {
  static propTypes = {
    history: PropTypes.object
  };

  static defaultProps = {
    history: createHistory()
  };

  render() {
    let { history } = this.props;

    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={DateForm} />
          <Route path="/:date*" exact component={Countdown} />
        </Switch>
      </Router>
    );
  }
}
