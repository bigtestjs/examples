import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class YearField extends Component {
  static propTypes = {
    value: PropTypes.number,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    value: moment().year()
  };

  get options() {
    let options = [];

    for (let y = 1000; y <= 9999; y++) {
      options.push({ label: y, value: y });
    }

    return options;
  }

  handleChange = year => {
    this.props.onChange(year);
  };

  render() {
    return (
      <Spinner
        name="year"
        value={this.props.value}
        className={this.props.className}
        onChange={this.handleChange}
        options={this.options}
        data-test-year-field
      />
    );
  }
}
