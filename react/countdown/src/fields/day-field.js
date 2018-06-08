import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class DayField extends Component {
  static propTypes = {
    value: PropTypes.number,
    length: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: moment().date(),
    length: moment().daysInMonth()
  };

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

  handleChange = day => {
    this.props.onChange(day);
  };

  render() {
    return (
      <Spinner
        name="day"
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.options}
        data-test-day-field
      />
    );
  }
}
