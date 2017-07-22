import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import RemoveMessageMutation from '../../mutations/RemoveMessageMutation';
import RenameMessageMutation from '../../mutations/RenameMessageMutation';

import MessageInput from '../MessageInput';
import Icon from 'svg-react-loader?name=Icon!../../assets/edit.svg';
import utcToLocaTime from '../../utils/dateTime';

import './style.scss';

export class Message extends PureComponent {
  state = {
    isEditing: false,
  };
  _onDestroyClick = () => {
    this._removeMessage();
  };
  _onEditClick = () => {
    this._setEditMode(true);
  };
  _onInputCancel = () => {
    this._setEditMode(false);
  };
  _onInputSave = (text) => {
    this._setEditMode(false);
    RenameMessageMutation.commit(
      this.props.relay.environment,
      text,
      this.props.message,
    );
  };
  _removeMessage() {
    RemoveMessageMutation.commit(
      this.props.relay.environment,
      this.props.message,
      this.props.viewer,
    );
  }
  _setEditMode = (isEditing) => {
    this.setState({isEditing});
  };

  renderInput() {
    return (
      <MessageInput
        className="edit"
        existingValue={this.props.message.text}
        onCancel={this._onInputCancel}
        onSave={this._onInputSave}
      />
    );
  }

  renderBallon() {
    const {
      avatar,
    } = this.props.viewer;
    const {
      text,
      createdAt,
    } = this.props.message;
    return (
      <div>
        <img className="img-circle" src={avatar}/>
        <div className="speech-bubble">
          <div className="main-message">{text}</div>
        </div>
        <div className="time-message">{utcToLocaTime(createdAt)}</div>
        <div
          className="rename"
          onClick={this._onEditClick}
        >
          <Icon className="edit-icon" />
        </div>
        <button
          className="destroy"
          onClick={this._onDestroyClick}
        />
      </div>
    );
  }

  render() {
    const {
      isEditing,
    } = this.state;

    return (
      <li
        className={`message-wrapper ${isEditing ? 'editing' : ''}`}
      >
        <div>
          {isEditing ? this.renderInput() : this.renderBallon()}
        </div>
      </li>
    );
  }
}

Message.defaultProps = {
  message: {},
  viewer: {},
};

Message.propTypes = {
  message: PropTypes.shape({}),
  viewer: PropTypes.shape({}),
};

export default createFragmentContainer(Message, {
  message: graphql`
    fragment Message_message on Message {
      id,
      text,
      createdAt,
    }
  `,
  viewer: graphql`
    fragment Message_viewer on User {
      id,
      totalCount,
      avatar,
    }
  `,
});
