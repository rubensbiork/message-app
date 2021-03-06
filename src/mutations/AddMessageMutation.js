import {
  commitMutation,
  graphql,
} from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation AddMessageMutation($input: AddMessageInput!) {
    addMessage(input:$input) {
      messageEdge {
        __typename
        cursor
        node {
          id
          text
          createdAt
        }
      }
      viewer {
        id
        totalCount
      }
    }
  }
`;

function sharedUpdater(store, user, newEdge) {
  const userProxy = store.get(user.id);
  const conn = ConnectionHandler.getConnection(
    userProxy,
    'MessageList_messages',
  );
  ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempID = 0;

function commit(
  environment,
  text,
  user
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {
          text,
          clientMutationId: tempID += 1,
        },
      },
      updater: (store) => {
        const payload = store.getRootField('addMessage');
        const newEdge = payload.getLinkedRecord('messageEdge');
        sharedUpdater(store, user, newEdge);
      },
      optimisticUpdater: (store) => {
        const id = `client:newMessage: ${tempID += 1}`;
        const node = store.create(id, 'Message');
        node.setValue(text, 'text');
        node.setValue(id, 'id');
        const newEdge = store.create(
          `client:newEdge: ${tempID += 1}`,
          'MessageEdge',
        );
        newEdge.setLinkedRecord(node, 'node');
        sharedUpdater(store, user, newEdge);
        const userProxy = store.get(user.id);
        userProxy.setValue(
          userProxy.getValue('totalCount') + 1,
          'totalCount',
        );
      },
    }
  );
}

export default { commit };
