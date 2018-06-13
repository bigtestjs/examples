import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './embed-address-bar.css';

/**
 * Displays a fake address bar when the app is embedded in an
 * iframe. This is strictly for demo purposes only.
 */
export default class EmbedAddressBar extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
      goForward: PropTypes.func.isRequired
    }).isRequired
  };

  // when the url changes, generate fresh state
  static getDerivedStateFromProps(props, state) {
    let url = props.location.pathname.substr(1);

    if (url !== state.last) {
      return { url, last: url };
    } else {
      return null;
    }
  }

  // the url is stored without a leading slash
  state = { url: '' };
  // true when embedded in an iframe
  isEmbedded = window.self !== window.top;

  // handlers to forward to the history object

  goBack = () => {
    this.props.history.goBack();
  };

  goForward = () => {
    this.props.history.goForward();
  };

  // the url input is controlled
  handleChange = e => {
    this.setState({ url: e.target.value });
  };

  // when <enter> is pressed, blur the input and push the new URL
  handleKeyUp = e => {
    if (e.key === 'Enter') {
      this.input.blur();
      this.props.history.push(`/${e.target.value}`);
    }
  };

  render() {
    // only render the address bar if we're embedded
    return this.isEmbedded && (
      <div className={styles.bar}>
        <button className={styles.button} onClick={this.goBack}>
          <svg viewBox="0 0 100 100"><path d="M75,0L25,50L75,100" /></svg>
        </button>

        <button className={styles.button} onClick={this.goForward}>
          <svg viewBox="0 0 100 100"><path d="M25,0L75,50L25,100" /></svg>
        </button>

        <span className={styles.input}>
          <input
            ref={i => this.input = i}
            value={this.state.url}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
          />
        </span>
      </div>
    );
  }
}
