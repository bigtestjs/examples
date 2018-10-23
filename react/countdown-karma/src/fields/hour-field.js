import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class HourField extends Component {
  static propTypes = {
    value: PropTypes.number
  };

  static defaultProps = {
    // default value to the current hour
    value: moment().hour()
  };

  // hour options range from 00-23 and are generated with a loop
  options = (() => {
    let options = [];

    for (let hour = 0; hour < 24; hour++) {
      options.push({
        label: hour.toString().padStart(2, '0'),
        value: hour
      });
    }

    return options;
  })();

  render() {
    return (
      <Spinner
        name="hour"
        {...this.props}
        options={this.options}
        data-test-hour-field
      />
    );
  }
}
