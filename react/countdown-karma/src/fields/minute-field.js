import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class MinuteField extends Component {
  static propTypes = {
    value: PropTypes.number
  };

  static defaultProps = {
    // default value to the current minute
    value: moment().minute()
  };

  // minute options range from 00-59 and are generated with a loop
  options = (() => {
    let options = [];

    for (let min = 0; min < 60; min++) {
      options.push({
        label: min.toString().padStart(2, '0'),
        value: min
      });
    }

    return options;
  })();

  render() {
    return (
      <Spinner
        name="minute"
        {...this.props}
        options={this.options}
        data-test-minute-field
      />
    );
  }
}
