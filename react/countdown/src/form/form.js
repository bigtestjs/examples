import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';

import styles from './form.css';
import YearField from '../fields/year-field';
import MonthField from '../fields/month-field';
import DayField from '../fields/day-field';
import HourField from '../fields/hour-field';
import MinuteField from '../fields/minute-field';

const cx = classNames.bind(styles);

export default class DateForm extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  state = {
    date: moment()
      .second(0)
      .millisecond(0)
  };

  setYear = year => {
    this.setState(({ date }) => ({
      date: date.clone().year(year)
    }));
  };

  setMonth = month => {
    this.setState(({ date }) => ({
      date: date.clone().month(month)
    }));
  };

  setDay = day => {
    this.setState(({ date }) => ({
      date: date.clone().date(day)
    }));
  };

  setHour = hour => {
    this.setState(({ date }) => ({
      date: date.clone().hour(hour)
    }));
  };

  setMinute = minute => {
    this.setState(({ date }) => ({
      date: date.clone().minute(minute)
    }));
  };

  submit = event => {
    let { history } = this.props;
    let { date } = this.state;

    event.preventDefault();

    if (date.format('HH:mm') === '00:00') {
      history.push(`/${date.format('YYYY/MM/DD')}`);
    } else {
      history.push(`/${date.format('YYYY/MM/DD/HH:mm')}`);
    }
  };

  render() {
    let { date } = this.state;

    return (
      <form
        data-test-date-form
        className={cx('date-form')}
        onSubmit={this.submit}
      >
        <MonthField value={date.month()} onChange={this.setMonth} />

        <DayField
          value={date.date()}
          length={date.daysInMonth()}
          onChange={this.setDay}
        />

        <YearField
          className={cx('date-form-year')}
          value={date.year()}
          onChange={this.setYear}
        />

        <HourField
          className={cx('date-form-hour')}
          value={date.hour()}
          onChange={this.setHour}
        />

        <MinuteField value={date.minute()} onChange={this.setMinute} />

        <button type="submit" className={cx('date-form-submit')}>
          Get {date.isAfter() ? 'Countdown' : 'Elapsed'}
        </button>
      </form>
    );
  }
}
