import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './spinner.css';

const cx = classNames.bind(styles);

export default class Spinner extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool
        ]).isRequired,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool
        ]).isRequired
      })
    ).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool
    ]).isRequired,
    onChange: PropTypes.func,
    onEnter: PropTypes.func,
    className: PropTypes.string
  };

  // used for the typeahead feature
  _query = '';

  // on unmount, clear any pending timeouts
  componentWillUnmount() {
    if (this._queryTimeout) {
      clearTimeout(this._queryTimeout);
    }
  }

  // computed index based on the current value and options
  get selectedIndex() {
    let { options, value: selected } = this.props;

    let selectedIndex = options.findIndex(({ value }) => {
      return value === selected;
    });

    // default to the first option
    return Math.max(selectedIndex, 0);
  }

  // triggers `onChange` with the previous option and wraps around to the
  // last option if there is no previous option
  prev = () => {
    let { options, onChange } = this.props;
    let prevIndex = this.selectedIndex - 1;
    let { value } = options[prevIndex] || options[options.length - 1];

    onChange(value);
  };

  // triggers `onChange` with the next option and wraps around to the
  // first option if there is no next option
  next = () => {
    let { options, onChange } = this.props;
    let nextIndex = this.selectedIndex + 1;
    let { value } = options[nextIndex] || options[0];

    onChange(value);
  };

  // triggers `onChange` with the option whose label matches the
  // provided query from the start of the string (case insensitive)
  select = query => {
    let { options, onChange } = this.props;
    let regexp = new RegExp(`^${query}`, 'i');
    let match = options.find(({ label }) => regexp.test(label));
    let selected = options[this.selectedIndex];

    if (match && !regexp.test(selected.label)) {
      onChange(match.value);
    }
  };

  // <up> triggers `this.prev`
  // <down> triggers `this.prev`
  // <enter> triggers `onEnter` prop
  // <backspace> clears the current query
  handleKeyDown = e => {
    let { onEnter } = this.props;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.prev();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.next();
    } else if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      clearTimeout(this._queryTimeout);
      this._query = '';
    }
  };

  // if any single character key is pressed, add it to the current
  // query and select an option matching said query
  handleKeyPress = e => {
    if (/^.$/.test(e.key)) {
      e.preventDefault();

      // add to the current query
      this._query += e.key;

      // after one second, the query is cleared
      this._queryTimeout = setTimeout(() => {
        this._query = '';
      }, 1000);

      this.select(this._query);
    }
  };

  render() {
    let { name, options, value, className, onChange, ...props } = this.props;
    let selectedIndex = this.selectedIndex;

    // we only need to display the previous, current, and next
    // options; wrapped around to the last or first option
    let visibleOptions = [
      options[selectedIndex - 1] || options[options.length - 1],
      options[selectedIndex],
      options[selectedIndex + 1] || options[0]
    ];

    return (
      <div
        tabIndex={0}
        className={cx('spinner', className)}
        onKeyDown={this.handleKeyDown}
        onKeyPress={this.handleKeyPress}
        {...props}
      >
        <input name={name} value={value} readOnly />

        <div className={cx('spinner-options')}>
          {visibleOptions.map(({ label, value }, i) => (
            <div
              key={value}
              // the selected index is always `1`, so the previous
              // index is less than `1` (`0`), and the next index is
              // greater than `1` (`2`)
              className={cx('spinner-option', {
                'spinner-option--selected': i === 1,
                'spinner-option--prev': i < 1,
                'spinner-option--next': i > 1
              })}
              // previous and next options are clickable
              onClick={i < 1 ? this.prev : i > 1 ? this.next : null}
              // testing attribute for each option type
              data-test-spinner-option={i < 1 ? 'prev' : i > 1 ? 'next' : 'selected'}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
