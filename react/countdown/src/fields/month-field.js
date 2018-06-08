import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class MonthField extends Component {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: moment().month()
  };

  options = [
    { label: 'Jan', value: 0 },
    { label: 'Feb', value: 1 },
    { label: 'Mar', value: 2 },
    { label: 'Apr', value: 3 },
    { label: 'May', value: 4 },
    { label: 'Jun', value: 5 },
    { label: 'Jul', value: 6 },
    { label: 'Aug', value: 7 },
    { label: 'Sep', value: 8 },
    { label: 'Oct', value: 9 },
    { label: 'Nov', value: 10 },
    { label: 'Dec', value: 11 }
  ];

  handleChange = month => {
    this.props.onChange(month);
  };

  render() {
    return (
      <Spinner
        name="month"
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.options}
        data-test-month-field
      />
    );
  }
}
