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
    className: PropTypes.string
  };

  // used for typeahead
  _query = '';

  componentWillUnmount() {
    if (this._queryTimeout) {
      clearTimeout(this._queryTimeout);
    }
  }

  get selectedIndex() {
    let { options, value: selected } = this.props;

    let selectedIndex = options.findIndex(({ value }) => {
      return value === selected;
    });

    return Math.max(selectedIndex, 0);
  }

  prev = () => {
    let { options, onChange } = this.props;
    let prevIndex = this.selectedIndex - 1;
    let { value } = options[prevIndex] || options[options.length - 1];

    onChange(value);
  };

  next = () => {
    let { options, onChange } = this.props;
    let nextIndex = this.selectedIndex + 1;
    let { value } = options[nextIndex] || options[0];

    onChange(value);
  };

  select = query => {
    let { options, onChange } = this.props;
    let regexp = new RegExp(`^${query}`, 'i');
    let match = options.find(({ label }) => regexp.test(label));
    let selected = options[this.selectedIndex];

    if (match && !regexp.test(selected.label)) {
      onChange(match.value);
    }
  };

  handleKeyDown = ({ key }) => {
    if (key === 'ArrowUp') {
      this.prev();
    } else if (key === 'ArrowDown') {
      this.next();
    } else if (key === 'Backspace') {
      this._query = '';
      clearTimeout(this._queryTimeout);
    }
  };

  handleKeyPress = ({ key }) => {
    if (/^\S$/.test(key)) {
      this._query += key;

      this._queryTimeout = setTimeout(() => {
        this._query = '';
      }, 1000);

      this.select(this._query);
    }
  };

  render() {
    let { name, options, value, className, onChange, ...props } = this.props;
    let selectedIndex = this.selectedIndex;

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
              onClick={i < 1 ? this.prev : i > 1 ? this.next : null}
              className={cx('spinner-option', {
                'spinner-option--selected': i === 1,
                'spinner-option--prev': i < 1,
                'spinner-option--next': i > 1
              })}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
