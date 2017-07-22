import {
  commitMutation,
  graphql,
} from 'react-relay';

const mutation = graphql`
  mutation RenameMessageMutation($input: RenameMessageInput!) {
    renameMessage(input:$input) {
      message {
        id
        text
      }
    }
  }
`;

function getOptimisticResponse(text, message) {
  return {
    renameMessage: {
      message: {
        id: message.id,
        text: text,
      },
    },
  };
}

function commit(
  environment,
  text,
  message
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {text, id: message.id},
      },
      optimisticResponse: getOptimisticResponse(text, message),
    }
  );
}

export default {commit};
