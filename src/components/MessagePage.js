import AddMessageMutation from '../mutations/AddMessageMutation';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

import React, { PureComponent } from 'react';
import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import './style.scss';

class MessagePage extends PureComponent {
  _onInputSave = (text) => {
    AddMessageMutation.commit(
      this.props.relay.environment,
      text,
      this.props.viewer,
    );
  };
  render() {
    const {
      viewer,
    } = this.props;

    return (
      <div className="message-page-wrapper">
        <MessageList viewer={viewer} />
        <div className="message-wrapper">
          <MessageInput
            className="message"
            onSave={this._onInputSave}
            placeholder="Enter your message ..."
          />
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(MessagePage, {
  viewer: graphql`
    fragment MessagePage_viewer on User {
      id,
      totalCount,
      ...MessageList_viewer,
    }
  `,
});
