import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import moment from 'moment';

import { Link } from 'react-router-dom';
import styles from './countdown.css';

const cx = classNames.bind(styles);

export default class Countdown extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        date: PropTypes.string.isRequired
      })
    })
  };

  componentDidMount() {
    this.tick();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this._loop);
  }

  tick = () => {
    this.forceUpdate(() => {
      this._loop = requestAnimationFrame(this.tick);
    });
  };

  renderUnit(duration, type) {
    let units = Math.abs(duration.get(type));

    if (type === 'seconds') {
      units = units.toString().padStart(2, '0');
    } else if (type === 'milliseconds') {
      units = units.toString().padStart(3, '0');
    }

    return (
      !!units && (
        <div className={cx('countdown-unit', `countdown-${type}`)}>
          <span
            className={cx('countdown-unit-number')}
            data-test-countdown-unit={type}
          >
            {units}
          </span>
          <span className={cx('countdown-unit-type')}>
            {type}
          </span>
        </div>
      )
    );
  }

  render() {
    let { match: { params } } = this.props;
    let date = moment(params.date, 'YYYY/MM/DD/HH:mm');
    let duration = moment.duration(date.diff());

    return (
      <div
        className={cx('countdown')}
        data-test-countdown
      >
        {this.renderUnit(duration, 'years')}
        {this.renderUnit(duration, 'months')}
        {this.renderUnit(duration, 'days')}
        {this.renderUnit(duration, 'hours')}
        {this.renderUnit(duration, 'minutes')}
        {this.renderUnit(duration, 'seconds')}
        {this.renderUnit(duration, 'milliseconds')}

        <div className={cx('countdown-end')}>
          <div
            className={cx('countdown-end-direction')}
            data-test-countdown-direction
          >
            {date.isAfter() ? 'Until' : 'Since'}
          </div>
          <div
            className={cx('countdown-end-target')}
            data-test-countdown-target
          >
            {date.format('HH:mm') === '00:00'
              ? date.format('MMMM D, YYYY')
              : date.format('MMMM D, YYYY @ HH:mm')}
          </div>
        </div>

        <Link to="/" className={cx('countdown-link')}>
          New Countdown
        </Link>
      </div>
    );
  }
}
