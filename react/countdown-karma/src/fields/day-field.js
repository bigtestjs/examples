import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class DayField extends Component {
  static propTypes = {
    value: PropTypes.number,
    length: PropTypes.number
  };

  static defaultProps = {
    // default value to the current day of the month
    value: moment().date(),
    // default length to the number of days in the current month
    length: moment().daysInMonth()
  };

  // day options are dynamically generated up to the `length` prop
  get options() {
    let { length } = this.props;
    let options = [];

    for (let day = 1; day <= length; day++) {
      options.push({
        label: day.toString().padStart(2, '0'),
        value: day
      });
    }

    return options;
  }

  render() {
    // the spinner does not accept a length prop
    let { length, ...props } = this.props;

    return (
      <Spinner
        name="day"
        {...props}
        options={this.options}
        data-test-day-field
      />
    );
  }
}
