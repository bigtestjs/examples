import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class MinuteField extends Component {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: moment().minute()
  };

  get options() {
    let options = [];

    for (let min = 0; min < 60; min++) {
      options.push({
        label: min.toString().padStart(2, '0'),
        value: min
      });
    }

    return options;
  }

  handleChange = minute => {
    this.props.onChange(minute);
  };

  render() {
    return (
      <Spinner
        name="minute"
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.options}
        data-test-minute-field
      />
    );
  }
}
