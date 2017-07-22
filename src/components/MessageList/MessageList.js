import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import Message from '../Message';

import './style.scss';

export class MessageList extends PureComponent {

  componentDidUpdate(prevProps) {
    //it only scrolls to bottom when a new message is added
    if (this.props.viewer.totalCount > prevProps.viewer.totalCount) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    node.scrollIntoView({ behavior: 'smooth' });
  }

  noDataBlock = () => {
    return (
      <div className="no-message">
        No message here yet!
      </div>
    );
  }

  renderMessages() {
    const {
      edges,
    } = this.props.viewer.messages;

    if (edges.length === 0) {
      return this.noDataBlock();
    }

    return edges.map(edge =>
      <Message
        key={edge.node.id}
        message={edge.node}
        viewer={this.props.viewer}
      />
    );
  }

  renderCounter() {
    const {
      totalCount,
    } = this.props.viewer;

    return (
      <div className="counter">
        {totalCount} {parseInt(totalCount, 10) > 1 ? 'items' : 'item'}
      </div>
    );
  }

  render() {
    return (
      <div className="message-list-wrapper">
        {this.renderCounter()}
        <ul className="message-list">
          {this.renderMessages()}
          <div ref={(el) => { this.messagesEnd = el; }} />
        </ul>
      </div>
    );
  }
}

MessageList.defaultProps = {
  viewer: {},
};

MessageList.propTypes = {
  viewer: PropTypes.shape({}),
};

export default createFragmentContainer(MessageList, {
  viewer: graphql`
    fragment MessageList_viewer on User {
      messages(
        first: 100
      ) @connection(key: "MessageList_messages") {
        edges {
          node {
            id,
            ...Message_message,
          },
        },
      },
      id,
      totalCount,
      ...Message_viewer,
    }
  `,
});
