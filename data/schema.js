import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Message,
  User,
  addMessage,
  getMessage,
  getMessages,
  getUser,
  getViewer,
  removeMessage,
  renameMessage,
} from './database';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Message') {
      return getMessage(id);
    }
    if (type === 'User') {
      return getUser(id);
    }
    return null;
  },
  (obj) => {
    if (obj instanceof Message) {
      return GraphQLMessage;
    }
    if (obj instanceof User) {
      return GraphQLUser;
    }
    return null;
  }
);

const GraphQLMessage = new GraphQLObjectType({
  name: 'Message',
  fields: {
    id: globalIdField('Message'),
    text: {
      type: GraphQLString,
      resolve: (obj) => obj.text,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (obj) => obj.createdAt,
    },
  },
  interfaces: [nodeInterface],
});

const {
  connectionType: MessagesConnection,
  edgeType: GraphQLMessageEdge,
} = connectionDefinitions({
  name: 'Message',
  nodeType: GraphQLMessage,
});

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    messages: {
      type: MessagesConnection,
      args: {
        ...connectionArgs,
      },
      resolve: (obj, {...args}) =>
        connectionFromArray(getMessages(), args),
    },
    totalCount: {
      type: GraphQLInt,
      resolve: () => getMessages().length,
    },
    avatar: {
      type: GraphQLString,
      resolve: (obj) => obj.avatar,
    },
  },
  interfaces: [nodeInterface],
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
    node: nodeField,
  },
});

const GraphQLAddMessageMutation = mutationWithClientMutationId({
  name: 'AddMessage',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    messageEdge: {
      type: GraphQLMessageEdge,
      resolve: ({localMessageId}) => {
        const message = getMessage(localMessageId);
        return {
          cursor: cursorForObjectInConnection(getMessages(), message),
          node: message,
        };
      },
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({text}) => {
    const localMessageId = addMessage(text);
    return {localMessageId};
  },
});

const GraphQLRemoveMessageMutation = mutationWithClientMutationId({
  name: 'RemoveMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedMessageId: {
      type: GraphQLID,
      resolve: ({id}) => id,
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localMessageId = fromGlobalId(id).id;
    removeMessage(localMessageId);
    return {id};
  },
});

const GraphQLRenameMessageMutation = mutationWithClientMutationId({
  name: 'RenameMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  outputFields: {
    message: {
      type: GraphQLMessage,
      resolve: ({localMessageId}) => getMessage(localMessageId),
    },
  },
  mutateAndGetPayload: ({id, text}) => {
    const localMessageId = fromGlobalId(id).id;
    renameMessage(localMessageId, text);
    return {localMessageId};
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMessage: GraphQLAddMessageMutation,
    removeMessage: GraphQLRemoveMessageMutation,
    renameMessage: GraphQLRenameMessageMutation,
  },
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
