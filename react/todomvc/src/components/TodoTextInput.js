import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class TodoTextInput extends PureComponent {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    text: PropTypes.string,
    placeholder: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      orignalText: props.text
    };
  }

  handleSubmit = e => {
    if (e.which === 13) {
      this.props.onSave(e.target.value);
    } else if (e.which === 27) {
      console.log("called blur");
      this.props.onBlur(this.state.orignalText);
    }
  };

  handleChange = e => {
    this.props.onInputChange(e.target.value);
  };

  handleBlur = e => {
    if (this.props.onBlur) {
      this.props.onBlur(e.target.value);
    }
  };

  render() {
    return (
      <input
        className={this.props.classes}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.props.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
