import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class HourField extends Component {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: moment().hour()
  };

  get options() {
    let options = [];

    for (let hour = 0; hour < 24; hour++) {
      options.push({
        label: hour.toString().padStart(2, '0'),
        value: hour
      });
    }

    return options;
  }

  handleChange = hour => {
    this.props.onChange(hour);
  };

  render() {
    return (
      <Spinner
        name="hour"
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.options}
        data-test-hour-field
      />
    );
  }
}
