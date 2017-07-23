import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;

export default class MessageInput extends PureComponent {
  state = {
    isEditing: false,
    text: this.props.existingValue || '',
  };

  componentDidMount() {
    ReactDOM.findDOMNode(this).focus();
  }
  _commitChanges = () => {
    const {
      text,
    } = this.state;

    if (text.trim() !== '') {
      this.props.onSave(text);
      this.setState({text: ''});
    }
  };

  _onChange = (e) => {
    this.setState({text: e.target.value});
  };
  _onKeyDown = (e) => {
    if (e.keyCode === ESC_KEY_CODE) {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
    if (e.keyCode === ENTER_KEY_CODE) {
      this._commitChanges();
    }
  };
  render() {
    return (
      <input
        className={this.props.className}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        placeholder={this.props.placeholder}
        value={this.state.text}
      />
    );
  }
}

MessageInput.defaultProps = {
  className: '',
  existingValue: '',
  onCancel: () => {},
  onSave: () => {},
  placeholder: '',
};

MessageInput.propTypes = {
  className: PropTypes.string,
  existingValue: PropTypes.string,
  onCancel: PropTypes.func,
  onSave: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};
