import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class MonthField extends Component {
  static propTypes = {
    value: PropTypes.number
  };

  static defaultProps = {
    // default value to the current month
    value: moment().month()
  };

  // months are zero indexed
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

  render() {
    return (
      <Spinner
        name="month"
        {...this.props}
        options={this.options}
        data-test-month-field
      />
    );
  }
}
