import { nodeDefinitions, fromGlobalId } from 'graphql-relay';
import { Context } from 'koa';
import registeredTypes from './registeredTypes';

export const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    const registeredType = registeredTypes.find(x => {
      return type === x.name;
    });

    return registeredType?.loader({} as Context, id);
  },
  obj => {
    const registeredType = registeredTypes.find(x => obj instanceof x.dbType);

    if (registeredType) return registeredType.qlType;

    return null;
  },
);
