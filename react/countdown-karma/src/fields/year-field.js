import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Spinner from './spinner';

export default class YearField extends Component {
  static propTypes = {
    value: PropTypes.number
  };

  static defaultProps = {
    // default value to the current year
    value: moment().year()
  };

  // year options range from 1000-9999 and are generated with a loop
  options = (() => {
    let options = [];

    for (let y = 1000; y <= 9999; y++) {
      options.push({ label: y, value: y });
    }

    return options;
  })();

  render() {
    return (
      <Spinner
        name="year"
        {...this.props}
        options={this.options}
        data-test-year-field
      />
    );
  }
}
