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

  // the moment date derived from the URL params
  date = moment(this.props.match.params.date, 'YYYY/MM/DD/HH:mm');
  // initial duration from the date
  state = { duration: moment.duration(this.date.diff()) };

  // on mount, we start re-rendering every tick to constantly keep the
  // rendered duration in sync with the real duration in time
  componentDidMount() {
    this.tick();
  }

  // on unmount, we need to cancel the animation loop
  componentWillUnmount() {
    cancelAnimationFrame(this._loop);
  }

  // when the date change in the url, the date needs to be reset; the
  // duration will update during the next tick
  componentDidUpdate(prevProps) {
    if (this.props.match.params.date !== prevProps.match.params.date) {
      this.date = moment(this.props.match.params.date, 'YYYY/MM/DD/HH:mm');
    }
  }

  // the `tick` updates the duration and cuases a re-render, then
  // schedules another tick to re-render again during the next
  // animation frame
  tick = () => {
    this.setState(() => ({
      duration: moment.duration(this.date.diff())
    }), () => {
      this._loop = requestAnimationFrame(this.tick);
    });
  };

  // renders the specific unit type (year, month, day, etc.) using the
  // current duration, and pads seconds and milliseconds to two and
  // three digits respectively
  renderUnit(type) {
    let units = Math.abs(this.state.duration.get(type));

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
    return (
      <div
        className={cx('countdown')}
        data-test-countdown
      >

        {/* render relevant units */}
        {this.renderUnit('years')}
        {this.renderUnit('months')}
        {this.renderUnit('days')}
        {this.renderUnit('hours')}
        {this.renderUnit('minutes')}
        {this.renderUnit('seconds')}
        {this.renderUnit('milliseconds')}

        {/* show the target date and direction of time */}
        <div className={cx('countdown-end')}>
          <div
            className={cx('countdown-end-direction')}
            data-test-countdown-direction
          >
            {this.date.isAfter() ? 'Until' : 'Since'}
          </div>
          <div
            className={cx('countdown-end-target')}
            data-test-countdown-target
          >
            {this.date.format('HH:mm') === '00:00'
              ? this.date.format('MMMM D, YYYY')
              : this.date.format('MMMM D, YYYY @ HH:mm')}
          </div>
        </div>

        {/* link back to the date form */}
        <Link to="/" className={cx('countdown-link')}>
          New Countdown
        </Link>
      </div>
    );
  }
}
